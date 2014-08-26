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
	var timer;
	var lastRotate;
	var tickRotation;
	var currentMousePosition = {'x': 0, 'y': 0};
	
	function trackMousePosition(e){
		currentMousePosition = {'x': e.pageX, 'y': e.pageY};
	}

	function wheelDrag(){
		var totalRotate = Math.atan2(wheelCentre['x'] - currentMousePosition['x'], wheelCentre['y'] - currentMousePosition['y']);
		tickRotation = lastRotate - totalRotate;
		
		// set the rotation point as the middle of the canvas, then rotate the canvas
		context.translate(canvas.width /2, canvas.height /2);
		context.rotate(tickRotation);
		
		//now that the canvas is rotated, move back to the top left corner to prepare for drawing (since we want all drawing to occur from the top left corner)
		context.translate(-canvas.width/2, -canvas.height/2);
		
		//Clear the canvas to remove the previous frame
		context.clearRect(0, 0, canvas.width, canvas.height);

		//Draw the next frame (which is just the same image again, but now on a rotated canvas)
		context.drawImage(wheelImg, 0, 0);
		
		lastRotate = totalRotate;
	}

	canvas.addEventListener("mousedown", function(e){ 
		$(document).bind('mousemove', trackMousePosition);
		currentMousePosition = {'x': e.pageX, 'y' : e.pageY};
		lastRotate = Math.atan2(wheelCentre['x'] - e.pageX, wheelCentre['y'] - e.pageY);
		clearInterval(timer);
		timer = setInterval(wheelDrag, 100, false);
	});
	
	canvas.addEventListener("mouseup", function(){
		$(document).unbind('mousemove');
		clearInterval(timer);
		timer = setInterval(wheelRelease, 100, false);
	});
	
	function wheelRelease(e){
	
		// set the rotation point as the middle of the canvas, then rotate the canvas
		context.translate(canvas.width /2, canvas.height /2);
		context.rotate(tickRotation);
		
		//now that the canvas is rotated, move back to the top left corner to prepare for drawing (since we want all drawing to occur from the top left corner)
		context.translate(-canvas.width/2, -canvas.height/2);
		
		//Clear the canvas to remove the previous frame
		context.clearRect(0, 0, canvas.width, canvas.height);

		//Draw the next frame (which is just the same image again, but now on a rotated canvas)
		context.drawImage(wheelImg, 0, 0);
		
		if (tickRotation < 0)
			tickRotation += Math.min(-tickRotation, 0.005);
		else if (tickRotation > 0)
			tickRotation -= Math.min(tickRotation, 0.005); 
		else
			clearInterval(timer);
	}
});
