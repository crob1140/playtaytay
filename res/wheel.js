var canvas = document.getElementById('wheelCanvas');
var context = canvas.getContext('2d');

var wheelImg = new Image();
wheelImg.src = "res/wheel.png";
wheelImg.onload = function(){
	context.drawImage(wheelImg, 0, 0);
};

//occurs every frame
function step()
{
	rotateWheel()
}

function rotateWheel(){

	// set the rotation point as the middle of the canvas, then rotate the canvas
	context.translate(canvas.width /2, canvas.height /2);
	context.rotate(10*Math.PI / 180);
	
	//now that the canvas is rotated, move back to the top left corner to prepare for drawing (since we want all drawing to occur from the top left corner)
	context.translate(-canvas.width/2, -canvas.height/2);
	
	//Clear the canvas to remove the previous frame
	context.clearRect(0, 0, canvas.width, canvas.height);

	//Draw the next frame (which is just the same image again, but now on a rotated canvas)
	context.drawImage(wheelImg, 0, 0);
}

var timer = setInterval(step, 10);
