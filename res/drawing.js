var canvas;
var context;
var drawTimer;

var framesPerSecond = 60; // constant
var millisecondsPerFrame = 1000 / framesPerSecond; // measured in milliseconds / frame (put frames per second as denominator)
var TO_RADIANS = Math.PI/180; 
	
$(document).ready(function(){		
	
canvas = document.getElementById('wheelCanvas');
context = canvas.getContext('2d');

drawTimer = setInterval(draw, millisecondsPerFrame, false);
});

var sprites = []

function makeSprite(src)
{
	var img = new Image();
	img.src = src;
	var spr = {image:img, x:0, y:0, angle:0, visible:true}
	sprites.push(spr);
	return spr;
}

function drawSprite(sprite)
{
	// save the current co-ordinate system 
	// before we screw with it
	context.save(); 
 
	// move to the middle of where we want to draw our image
	context.translate(sprite.x, sprite.y);
 
	// rotate around that point, converting our 
	// angle from degrees to radians 
	context.rotate(sprite.angle);
 
	// draw it up and to the left by half the width
	// and height of the image 
	context.drawImage(sprite.image, -(sprite.image.width/2), -(sprite.image.height/2));
 
	// and restore the co-ords to how they were when we began
	context.restore(); 
}

function draw()
{
	for (var i = 0; i < sprites.length; i++)
	{
		if (sprites[i].visible)
			drawSprite(sprites[i]);
	}
}


