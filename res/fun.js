var taytaylove = [];
var funTimer;
var bannerTimer;
var tayperiod = 500;
var bannerDrop = 120;
var taystep = (Math.PI)/tayperiod;
var tayprog = 0;
var taysprite;

function init_fun(){
	taytaylove.push(makeSprite("res/bird.png"));
	taytaylove.push(makeSprite("res/red_queen.png"));
	taytaylove.push(makeSprite("res/booyeah.png"));
	taytaylove.push(makeSprite("res/frontal_orafice.png"));
	taytaylove.push(makeSprite("res/mlady.png"));
	
	for (var i = 0; i < taytaylove.length; i++)
	{
		taytaylove[i].visible=false;
		
	}
}

function invoke_fun()
{
	if (!funTimer){
		drop_banner();
		funTimer = setInterval(funFunction, millisecondsPerFrame, false);
	}
}

function drop_banner(){
	banner=makeSprite("res/banner.png");
	banner.image.onload = function(){
	
		//hardcoding ftw
		banner.x=400;
		banner.y=-110;
		banner.visible=true;
		bannerTimer = setInterval(bannerFunction, millisecondsPerFrame, false);
	}
}

function bannerFunction(){
	if (banner.y < bannerDrop){
		banner.y++;
	}
	else{
		clearInterval(bannerTimer);
	}
}


function funFunction()
{
	if (tayprog > tayperiod)
		tayprog = 0;
	if (tayprog == 0)
	{
		//more tay tay
		var ind = Math.floor((Math.random() * taytaylove.length));
		if (taysprite)
			taysprite.visible = false;
			
		taysprite = taytaylove[ind];
		taysprite.visible = true;
		taysprite.x = canvas.width / 2;
	}
	
	taysprite.y = canvas.height + taysprite.image.height/2 - Math.sin(tayprog*taystep)*taysprite.image.height + 30;
	
	tayprog++;
}
