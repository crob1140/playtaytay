	
	function selectSong(){
		totalRotation = wrapAngle(totalRotation);
		for (i = numSegments; i > 0; i--){
			if (totalRotation > i*radiansPerPeg){
				if (currentSong){
					currentSong.pause();
					currentSong.currentTime=0;
				}
				currentSong = songs[i-1];
				currentSong.loop = true;
				currentSong.play();
				break;
			}
		}
	}