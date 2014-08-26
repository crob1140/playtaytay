$(document).ready(function(){				
	
	//'Global' variable instantiation
	var canvas = document.getElementById('wheelCanvas');
	var context = canvas.getContext('2d');
	var wheelImg = new Image();
	wheelImg.src = "res/wheel.png";
	wheelImg.onload = function(){
		context.drawImage(wheelImg, 0, 0);
	};
	
	var wheelCentre = {'x': canvas.offsetLeft + (canvas.width / 2), 'y': canvas.offsetTop + (canvas.height / 2)};
	var currentMousePosition = {'x': 0, 'y': 0};
	var timer;
	
	var framesPerSecond = 60; // constant
	var millisecondsPerFrame = 1000 / framesPerSecond; // measured in milliseconds / frame (put frames per second as denominator)
	
	// Wheel rotation metrics
	var spinSpeed = 0; // measured in radians per second
	var naturalDeceleration = 1 / framesPerSecond; // measured in radians/second lost per frame (put radians/second that should be lost per second as the numerator)
	var collisionDeceleration = 1; // measured in radians/second lost per peg collision
	
	function trackMousePosition(e){
		currentMousePosition = {'x': e.pageX, 'y': e.pageY};
	}

	var lastRotate; // keep track of the rotation from the last tick of wheelDrag, so that we can calculate the difference and adjust the rotation angle accordingly
	function wheelDrag(){
		var currentRotate = Math.atan2(wheelCentre['x'] - currentMousePosition['x'], wheelCentre['y'] - currentMousePosition['y']);
		var tickRotation = lastRotate - currentRotate;
		
		rotateWheel(tickRotation);
	
		lastRotate = currentRotate;
		spinSpeed = tickRotation * framesPerSecond; // rotation/second = (rotation/frame) * (frame/second)
	}

	canvas.addEventListener("mousedown", function(e){ 
		$(document).bind('mousemove', trackMousePosition); // start tracking the mouse position
		currentMousePosition = {'x': e.pageX, 'y' : e.pageY}; // since the mouse may not change position at all, we need to instantiate the currentMousePosition variable
		lastRotate = Math.atan2(wheelCentre['x'] - e.pageX, wheelCentre['y'] - e.pageY); // since rotation is calculated using difference from last frame, we also need to instantiate this variable
		clearInterval(timer); // clear any intervals bound to the timer variable (which could be the rotateWheel event)
		timer = setInterval(wheelDrag, millisecondsPerFrame, false); // then bind the wheelDrag function to our timer, calling it every millisecondsPerFrame milliseconds
	});
	
	canvas.addEventListener("mouseup", function(){
		$(document).unbind('mousemove'); // when the left mouse button is released, we can stop tracking the mouse position
		clearInterval(timer); // we can also stop calling the wheelDrag function
		timer = setInterval(wheelRelease, millisecondsPerFrame, false); // and instead start calling the wheelRelease function
	});
	
	function wheelRelease(){
		var tickRotation = spinSpeed / framesPerSecond; // rotation/frame = (rotation/second) / (frames/second)
		rotateWheel(tickRotation);
		
		if (spinSpeed < 0)
			spinSpeed += Math.min(-spinSpeed, naturalDeceleration);
		else if (spinSpeed > 0)
			spinSpeed -= Math.min(spinSpeed, naturalDeceleration); 
		else
			clearInterval(timer); //if our speed has hit 0, we can stop the timer completely
	}
	
	function rotateWheel(angle){
		// set the rotation point as the middle of the canvas, then rotate the canvas
		context.translate(canvas.width /2, canvas.height /2);
		context.rotate(angle);
		
		//now that the canvas is rotated, move back to the top left corner to prepare for drawing (since we want all drawing to occur from the top left corner)
		context.translate(-canvas.width/2, -canvas.height/2);
		
		//Clear the canvas to remove the previous frame
		context.clearRect(0, 0, canvas.width, canvas.height);

		//Draw the next frame (which is just the same image again, but now on a rotated canvas)
		context.drawImage(wheelImg, 0, 0);
	}
});
