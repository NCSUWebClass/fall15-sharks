// Wait for document to finish loading DOM content before trying to execute JS on its elements
// Doesn't require jQuery which is lovely.
document.addEventListener('DOMContentLoaded', init);

var curYPos = 0;
var curXPos = 0;
var curDown = false;

window.addEventListener('mousemove', function(e) {
	if(curDown === true)
		window.scrollTo(document.body.scrollLeft + (curXPos - e.pageX), document.body.scrollTop + (curYPos - e.pageY));
});

window.addEventListener('mousedown', function(e){ curDown = true; curYPos = e.pageY; curXPos = e.pageX; });
window.addEventListener('mouseup', function(e){ curDown = false; });

// Defines game container characteristics
var gameContainer = {
	truesize: {
		width: 3006,
		height: 5344
	},
	size: {
		width: 900,
		height: 600
	},
	position: {
		x: 0,
		y: 0
	},
	trueposition: {
		x: 0,
		y: 0
	},
	id: 'digarea',
	bgfilename: '',
	bgfilenames: []
};

var i = Math.floor(Math.random() * 22) + 1;
gameContainer.bgfilename = '/static/img/backgrounds/bg'+i+'.jpg';

var shovelSounds = {
	filenames: ['static/sound/shovel_scooping_stones.mp3',
				'static/sound/snow_shovel_dig_into_slush.mp3',
				'static/sound/spade_hit_1.mp3'],
	sounds: []
};

/** Create sound objects for clicks. **/
function setupSounds() {
	for (var i = 0; i < shovelSounds.filenames.length; i++)
		shovelSounds.sounds[i] = new Audio(shovelSounds.filenames[i]);
}

/** Play random sound from sound objects. **/
function playSound() {
	var soundIndex = Math.floor(Math.random() * shovelSounds.sounds.length);
	shovelSounds.sounds[soundIndex].play();
}

/** Initiate game logic */
function init() {
	$("#instructions").modal();
	$.ajaxSetup({async:false});
	retrieveTeeth();
	// Prevent drag and drop on elements, we use dragging for moving screen.
	// Event will still propogate and bubble up to listeners.
	var body = document.getElementsByTagName("body")[0];
	body.addEventListener('dragstart', function() { return false; });
	body.addEventListener('drop', function() { return false; });
	setupSounds();
	setupContainer(gameContainer.id);
	var bg = document.getElementById('gamebg');
	bg.addEventListener('dragstart', function() { return false; });
	bg.addEventListener('drop', function() { return false });
	setupTeeth(gameContainer.id, 15);
}

/** Retrieve random teeth from database and place in cookie. **/
function retrieveTeeth() {
	$.get("/getTeeth", function(data) {
        var d = new Date();
        d.setTime(d.getTime() + (2*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = "teeth="+data+";"+expires;
    });
}

/**
 * Create background element.
 */
function setupContainer(containerId) {
	var container = document.createElement('img');
	container.id = 'gamebg';
	container.setAttribute('src', gameContainer.bgfilename);
	document.getElementById(containerId).appendChild(container);
}

function setupTeeth(containerId, numTeeth) {
	var teethStr = getCookie("teeth");
	if (teethStr == "") {
		console.log("Could not retrieve cookie.");
		return;
	}
    var teethData = JSON.parse(teethStr);
	var container = document.getElementById(containerId);
	var containerLocation = getPosition(container);
	gameContainer.trueposition.x = containerLocation.x;
	gameContainer.trueposition.y = containerLocation.y;
	var currTeeth =  0;
	for (var j = 0; j < numTeeth; j++) {
		var tooth = document.createElement('div');
		var id = j.toString();
		tooth.style.display = 'block';
		tooth.className = 'tooth';
		tooth.id = "tooth" + id;
		tooth.style.backgroundImage = 'url("/static/img/ProcessedTeethPics/' + teethData[j].imgfilename + '")';
		var measurement = teethData[j].measurement * 13;
		tooth.style.height = measurement;
		tooth.style.width = measurement;
		var originLeft = Math.abs(containerLocation.x + Math.abs(Math.floor(Math.random() * gameContainer.truesize.width) - measurement));
		var originTop = Math.abs(containerLocation.y + Math.abs(Math.floor(Math.random() * gameContainer.truesize.height) - measurement));
		tooth.style.left = originLeft;
		tooth.style.top = originTop;
		var degrees = Math.floor(Math.random() * 360);
		tooth.style.webkitTransform = 'rotate('+ degrees +'deg)';
	    tooth.style.mozTransform    = 'rotate('+ degrees +'deg)';
	    tooth.style.msTransform     = 'rotate('+ degrees +'deg)';
	    tooth.style.oTransform      = 'rotate('+ degrees +'deg)';
		tooth.style.transform 		= 'rotate('+ degrees +'deg)';
		tooth.onclick = function() {
			this.style.left = null;
			this.style.top = null;
			this.style.position = 'relative';
			this.style.transform = 'rotate(0deg)';
			if($(this).parent()[0].id != 'digresults') {
				playSound();
				currTeeth++;
				if (currTeeth != numTeeth) {
					document.getElementById('digCounter').innerHTML = ('Teeth Found: ' + currTeeth + ' / ' + numTeeth);
				} else {
					document.getElementById('digCounter').innerHTML = ('All teeth found! Go see your results!');
					document.getElementById('digCounter').style.fontSize = "25px";
					var measurementPageButton = document.createElement("BUTTON");
					var btnText = document.createTextNode(('Go to measurement page'));
					measurementPageButton.appendChild(btnText);
					measurementPageButton.onclick = function () {
						window.location.href = "/measure";
					};
					document.getElementById('digCounter').appendChild(measurementPageButton);
				}
			}
			var toothForResults = this;
			toothForResults.id = toothForResults.id + 'new';
			document.getElementById('digresults').appendChild(toothForResults);
		};
		container.appendChild(tooth);
	}
}

// http://www.kirupa.com/html5/get_element_position_using_javascript.htm
// Gets position of element on screen and returns in {x, y} format.
function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;
    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
}

//function found at http://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
