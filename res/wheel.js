$(document).ready(function(){				
	
	var wheelCentre;
	//'Global' variable instantiation
	wheel = makeSprite("res/wheel.jpg");
	wheel.image.onload = function()
	{
		wheel.x = wheel.image.width / 2;
		wheel.y = wheel.image.height / 2;
		wheelCentre= {x:wheel.x, y:wheel.y};
		
		canvas.width = wheel.image.width;
		canvas.height = wheel.image.height;
	};
	
	init_fun()

	var currentMousePosition = {'x': 0, 'y': 0};
	var timer;
	
	var numSegments = 10;
	var songs = new Array(numSegments);
	songs[0] = new Audio('res/songs/quack1.mp3');
	songs[1] = new Audio('res/songs/quack2.mp3');
	songs[2] = new Audio('res/songs/quack3.mp3');
	songs[3] = new Audio('res/songs/quack4.mp3');
	songs[4] = new Audio('res/songs/quack5.mp3');
	songs[5] = new Audio('res/songs/quack6.mp3');
	songs[6] = new Audio('res/songs/quack7.mp3');
	songs[7] = new Audio('res/songs/cowbell1.mp3');
	songs[8] = new Audio('res/songs/cowbell2.mp3');
	songs[9] = new Audio('res/songs/cowbell3.mp3');
	
	var currentSong;
	
	var radiansPerPeg = 2*Math.PI / numSegments;
	
	var pegSound = new Audio('res/peg.mp3');
	pegSound.volume = 0.05;
	
	// Wheel rotation metrics
	var spinSpeed = 0; // measured in radians per second
	var naturalDeceleration = 1 / framesPerSecond; // measured in radians/second lost per frame (put radians/second that should be lost per second as the numerator)
	var collisionDeceleration = 6 / framesPerSecond; // measured in radians/second lost per peg collision
	
	function trackMousePosition(e){
		currentMousePosition = {'x': e.pageX, 'y': e.pageY};
	}

	var lastRotate; // keep track of the rotation from the last tick of wheelDrag, so that we can calculate the difference and adjust the rotation angle accordingly
	var totalRotation = 0;
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
		var tickDeceleration = naturalDeceleration;

		rotateWheel(tickRotation);
		
		//If we have moved into a new segment, calculate how many pegs where crossed and decelerate accordingly
		if (previousNextPeg != currentNextPeg){
			var numCollisions = Math.abs(currentNextPeg - previousNextPeg) / radiansPerPeg;
			tickDeceleration += (numCollisions * collisionDeceleration);
		}
		
		if (spinSpeed < 0)
			spinSpeed += Math.min(-spinSpeed, tickDeceleration);
		else if (spinSpeed > 0)
			spinSpeed -= Math.min(spinSpeed, tickDeceleration); 
		else{
			clearInterval(timer); //if our speed has hit 0, we can stop the timer completely
			selectSong();
			invoke_fun();
		}
	}
	
	function wrapAngle(angle){
		var wrappedAngle = (angle % 2*Math.PI);
		alert("input: " + angle + ", output:" + wrappedAngle);
		if (angle < 0)
			wrappedAngle = 2*Math.PI-wrappedAngle;
		return wrappedAngle;
	}	
	
	var previousNextPeg;
	var currentNextPeg;
	function rotateWheel(angle){
		previousNextPeg = currentNextPeg;
	
		// set the rotation point as the middle of the canvas, then rotate the canvas
		totalRotation += angle;
		wheel.angle = totalRotation;//wrapAngle(totalRotation);
		
		//Play the peg collision sound if we have moved into a new segment
		currentNextPeg = Math.ceil(totalRotation/radiansPerPeg)*radiansPerPeg
		if (previousNextPeg != currentNextPeg){
			pegSound.currentTime=0;
			pegSound.play();
		}
	}
	
	function selectSong(){
		alert(totalRotation + " will be changed to ...");
		totalRotation = wrapAngle(totalRotation);
		alert(totalRotation);
		for (i = 1; i <= numSegments; i++){
			if (totalRotation < i*radiansPerPeg){ 
				if (currentSong){
					currentSong.pause();
					currentSong.currentTime=0;
				}
				//alert("playing segment " + i);
				currentSong = songs[i-1];
				currentSong.loop = true;
				currentSong.play();
				break;
			}
		}
	}	
});
