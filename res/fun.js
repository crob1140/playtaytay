var taytaylove = [];
var funTimer;
var tayperiod = 500;
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
	funTimer = setInterval(funFunction, millisecondsPerFrame, false);
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
