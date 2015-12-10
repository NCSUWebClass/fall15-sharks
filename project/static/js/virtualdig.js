	// Wait for document to finish loading DOM content before trying to execute JS on its elements
	// Doesn't require jQuery which is lovely.
	document.addEventListener('DOMContentLoaded', init);

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
		id: 'game-container',
		bgfilename: '',
		bgfilenames: []
	};

	for (var i = 1; i < 24; i++)
		gameContainer.bgfilenames[i-1] = '/static/img/backgrounds/bg'+i+'.jpg';
	gameContainer.bgfilename = gameContainer.bgfilenames[Math.floor(Math.random() * gameContainer.bgfilenames.length)];

	var shovelSounds = {
		filenames: ['static/sound/shovel_scooping_stones.mp3',
					'static/sound/snow_shovel_dig_into_slush.mp3',
					'static/sound/spade_hit_1.mp3'],
		numSounds: 3,
		sounds: []
	};

	function setupSounds() {
		var i = 0;
		for (var s in shovelSounds.filenames) {
			shovelSounds.sounds[i++] = new Audio(shovelSounds.filenames[s]);
		}
	}

	function playSound() {
		var soundIndex = Math.floor(Math.random() * shovelSounds.numSounds);
		shovelSounds.sounds[soundIndex].play();
	}

	var shovelSound;

	// General container for section specific information
	var sections = {
		sectionSize: {
			width: (gameContainer.size.width / 3),
			height: (gameContainer.size.height / 3)
		},
		sectionTeeth: []
	};

	var teeth = {};
	teeth.positions = [];
	teeth.displayed = [];
	teeth.removeTooth = function(toothIndex) {
		teeth.positions.splice(toothIndex, 1);
		teeth.displayed.splice(toothIndex, 1);
	}

	//var teeth = [];
	//var teethPositions = [];
	//var displayedTeeth = [];

	var sectionDisplayed = false;

	var mouseDown = false;
	var lastMouse = {
		x: 0,
		y: 0
	};

	/** Initiate game logic */
	function init() {
		var body = document.getElementsByTagName("body")[0];
		body.addEventListener("dragstart", function() { return false; });
		body.addEventListener("drop", function() { return false; });
		setupSounds();
		setupContainer(gameContainer.id);
		//setupSections(gameContainer.id, 'game-section');
		setupTeeth(gameContainer.id, 15);
	}

	/**
	 * Set game container size to that specified in the global gameContainerSize variable.
	 */
	function setupContainer(containerId) {
		var container = document.createElement('img');
		container.setAttribute('src', gameContainer.bgfilename);
		document.getElementById('digarea').appendChild(container);
		/* var container = document.getElementById(containerId);
		container.style.width = gameContainer.size.width + 'px';
		container.style.height = gameContainer.size.height + 'px';
		container.style.backgroundImage = 'url("'+gameContainer.bgfilename+'")';
		container.addEventListener("mousedown", function() {
			mouseDown = true;
			return false;
		});
		document.addEventListener("mouseup", function() {
			mouseDown = false;
		});
		container.addEventListener("mouseenter", function(position) {
			lastMouse.x = position.pageX;
			lastMouse.y = position.pageY;
		});
		container.addEventListener("mousemove", function(movement) {
			if (mouseDown) {
				deltaX = movement.pageX - lastMouse.x;
				deltaY = movement.pageY - lastMouse.y;
				gameContainer.position.x += deltaX;
				gameContainer.position.y += deltaY;
				gameContainer.trueposition.x += deltaX;
				gameContainer.trueposition.y += deltaY;
				this.style.backgroundPosition = gameContainer.position.x + 'px ' + gameContainer.position.y + 'px';
				var containerRight = gameContainer.trueposition.x + gameContainer.size.width;
				var containerBottom = gameContainer.trueposition.y + gameContainer.size.height;
				for (var i = 0; i < teeth.positions.length; i++) {
					var xPos = teeth.positions[i][0];
					var yPos = teeth.positions[i][1];
					if (((xPos > gameContainer.trueposition.x) && (xPos < containerRight)) &&
						((yPos > gameContainer.trueposition.y) && (yPos < containerBottom))) {
						if (teeth.displayed[i] == false)
							showTooth(i);
					} else if (teeth.displayed[i] == true)
						hideTooth(i);
					moveTooth(i, deltaX, deltaY);
				}
			}
			lastMouse.x = movement.pageX;
			lastMouse.y = movement.pageY;
		}); */
	}

	function moveTooth(index, deltaX, deltaY) {
		var tooth = teeth.positions[index];
		tooth[0] += deltaX;
		tooth[1] += deltaY;
		if (teeth.displayed[index] == true)
			moveDOMTooth(index);
	}

	function showTooth(index) {
		var toothShown = teeth.displayed[index];
		if (toothShown == true)
			return;
		moveDOMTooth(index);
		var tooth = document.getElementById('tooth'+index);
		tooth.style.display = 'block';
		toothShown = true;
	}

	function moveDOMTooth(index) {
		var tooth = document.getElementById('tooth'+index);
		tooth.style.left = teeth.positions[index][0];
		tooth.style.top = teeth.positions[index][1];
	}

	function hideTooth(index) {
		var toothShown = teeth.displayed[index];
		if (toothShown == false)
			return;
		var tooth = document.getElementById('tooth'+index);
		tooth.style.display = 'none';
		toothShown = false;
	}



	/**
	 * Create 9 sections in game container that split it into different areas for "digging"
	 * Assign click functionality to display section and its elements.
	function setupSections(containerId, sectionClass) {
		var container = document.getElementById(containerId);
		var containerLocation = getPosition(container);
		for (var i = 0; i < 9; i++) {
			var div = document.createElement('div');
			div.style.width = sections.sectionSize.width + 'px';
			div.style.height = sections.sectionSize.height + 'px';
			var sectionPosition = {
				x: containerLocation.x + (sections.sectionSize.width * (i % 3)),
				y: containerLocation.y + (sections.sectionSize.height * Math.floor(i / 3))
			};
			div.style.left = sectionPosition.x;
			div.style.top = sectionPosition.y;
			div.className = sectionClass;
			div.originalLeft = sectionPosition.x;
			div.originalTop = sectionPosition.y;
			div.sectionIndex = i;
			div.onclick = function() {
				if (sectionDisplayed) {
					removeTeeth(this.sectionIndex);
					this.style.backgroundImage = 'none';
					this.style.zIndex = 0;
					this.style.left = this.originalLeft;
					this.style.top = this.originalTop;
					this.style.width = sections.sectionSize.width + 'px';
					this.style.height = sections.sectionSize.height + 'px';
					sectionDisplayed = false;
				} else {
					this.style.zIndex = 1;
					this.style.left = containerLocation.x;
					this.style.top = containerLocation.y;
					this.style.width = gameContainer.size.width + 'px';
					this.style.height = gameContainer.size.height + 'px';
					this.style.backgroundImage = 'url("'+gameContainer.bgfilename+'")';
					this.style.backgroundPosition= Math.floor((this.sectionIndex % 3) * 33) + '% ' + Math.floor(Math.floor((this.sectionIndex / 3)) * 33) + '%';
					this.style.backgroundSize = '33% 33%';
					showTeeth(this.sectionIndex);
					playSound();
					sectionDisplayed = true;
				}

			};
			container.appendChild(div);
		}
	} */

	function setupTeeth(containerId, numTeeth) {
		var teethStr = getCookie("teeth");
        console.log(teethStr);
        var teethData = JSON.parse(teethStr);
		var container = document.getElementById(containerId);
		var containerLocation = getPosition(container);
		gameContainer.trueposition.x = containerLocation.x;
		gameContainer.trueposition.y = containerLocation.y;
		var currTeeth =  0;
		// for (var i = 0; i < 9; i++)
			//teeth[i] = [];
		for (var j = 0; j < numTeeth; j++) {
			var tooth = document.createElement('div');
			var id = j.toString();
			tooth.style.display = 'block';
			tooth.className = 'tooth';
			tooth.id = "tooth" + id;
			//tooth.section = Math.floor(Math.random() * 9);
			tooth.style.backgroundImage = 'url("/static/img/ProcessedTeethPics/' + teethData[j].imgfilename + '")';
			tooth.style.height = teethData[j].measurement * 11;
			tooth.style.width = teethData[j].measurement * 11;
			//var originLeft = containerLocation.x + Math.abs(Math.floor((Math.random() * gameContainer.size.width) - 99));
			//var originTop = containerLocation.y + Math.abs(Math.floor((Math.random() * gameContainer.size.height) - 99));
			var originLeft = containerLocation.x + Math.abs(Math.floor(Math.random() * gameContainer.truesize.width));
			var originTop = containerLocation.y + Math.abs(Math.floor(Math.random() * gameContainer.truesize.height));
			teeth.positions[j] = [originLeft, originTop];
			teeth.displayed[j] = false;
			tooth.originLeft = originLeft;
			tooth.originTop = originTop;
			tooth.style.left = originLeft;
			tooth.style.top = originTop;
			var degrees = Math.floor(Math.random() * 360);
			tooth.style.webkitTransform = 'rotate('+ degrees +'deg)';
		    tooth.style.mozTransform    = 'rotate('+ degrees +'deg)';
		    tooth.style.msTransform     = 'rotate('+ degrees +'deg)';
		    tooth.style.oTransform      = 'rotate('+ degrees +'deg)';
			tooth.style.transform 		= 'rotate('+ degrees +'deg)';
			tooth.onclick = function() {
				//teeth[this.sectionIdx].splice(this.arrayIdx, 1);
				teeth.removeTooth(this.arrayIdx);
				this.style.left = null;
				this.style.top = null;
				this.style.position = 'relative';
				this.style.transform = 'rotate(0deg)';
				if($(this).parent()[0].id != 'digresults') {
					currTeeth++;
					if (currTeeth != numTeeth) {
						document.getElementById('digCounter').innerHTML = ('Teeth Found: ' + currTeeth + ' / ' + numTeeth);
					}
					else {
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
			//tooth.sectionIdx = Math.floor(Math.random() * 9);
			//tooth.arrayIdx = teeth[tooth.sectionIdx].push(tooth) - 1;
			tooth.arrayIdx = j;
			container.appendChild(tooth);
		}
	}

	function removeTeeth(sectionIndex) {
		for (var i = 0; i < teeth[sectionIndex].length; i++) {
			if($('#' + teeth[sectionIndex][i].id).parent()[0].id === 'game-container') {
				teeth[sectionIndex][i].style.display = 'none';
			}
		}
	}

	function showTeeth(sectionIndex) {
		for (var i = 0; i < teeth[sectionIndex].length; i++) {
			teeth[sectionIndex][i].style.display = 'block';
		}
	}

	// debug method, remove in production
	function displaySection(section) {
		alert("Section "+section+" clicked!");
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
