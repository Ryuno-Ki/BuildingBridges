// FIXME:
// - cleanup properties and methods (namespace!)
// - only fire DOM-related elements when ready
// - separate logic from presentation (= DOM)
// - calculate stange automatically (?, looking in neighborhood)
// - move getPosition out of the binding to gElX/gElY in order for drawing Lager
// - http://jsfiddle.net/ajTkP/13/
//
// Flow:
//  1. Ask for Lager position and fill rects to the nearest border
//  2. Ask for Gelenk position and add the circles
//  3. Ask for Stab ends by clicking the respective elements in list
//  Make all of above steps editable

var b = new Bridge();
document.addEventListener('DOMContentLoaded', init, false);

// FIXME: Put into Bridge namespace
function init() {
	//var gelenkBtn = document.getElementById('add-gelenk');
	var canvas         = document.getElementById('bridge');
	var fileChooser    = document.getElementById('fileChooser');
	var coords         = document.getElementById('coords');
	var coordsBtn      = document.getElementById('submit-coords');
	var gelenkeEl      = document.getElementById('gelenke');
	var isMobileDevice = navigator.userAgent.match(/ipad|iphone|ipod|android/i);
	if (isMobileDevice) {
		gelenkBtn.addEventListener('mousedown', addCoordinates, false);
		canvas.addEventListener('mousedown', getPosition, false);
	} else {
		canvas.addEventListener('click', function(e) {
			pnt = getPosition(e);
			updateCanvas(pnt.x, pnt.y);
		}, false);
		coords.addEventListener('keyup', function() {
			x = document.getElementById('x-coord').value;
			y = document.getElementById('y-coord').value;
			updateCanvas(x, y);
		}, false);
	};
	// Both
	fileChooser.addEventListener('change', handleFileSelection, false);
	coordsBtn.addEventListener('click', function() {
		x    = document.getElementById('x-coord').value;
		y    = document.getElementById('y-coord').value;
		type = document.getElementById('type').value;
		if (type == 'lager') {
			l = new Lager();
			if (b.lager.length >= 0 && b.lager.length < 2) {
				l.setX(x);
				l.setY(y);
				b.addToList(l);
				printCoordinates();
			}
		} else {
			g = new Gelenk();
			if (b.gelenke.length >= 0) {
				g.setX(x);
				g.setY(y);
				b.addToList(g);
				printCoordinates();
			}
		}
		updateCanvas();
	}, false);
	//gelenkBtn.addEventListener('submit',    addCoordinates, false);
	//gelenkeEl.addEventListener('click', buildBridge, false);
};

function updateCanvas(x,y) {
	clearCanvas();
	var canvas       = document.getElementById('bridge');
	var xCoord       = document.getElementById('x-coord');
	var yCoord       = document.getElementById('y-coord');
	if (x != "" && y != "") {
		showCircle(x,y);
		xCoord.value = x;
		yCoord.value = y;
	}
	if (b.lager.length) {
		for (var l = 0; l < b.lager.length; ++l) {
			var current      = b.lager[l];
			var currentX     = current.getX();
			var currentY     = current.getY();
			var distToLeft   = currentX - 0;
			var distToRight  = canvas.width - currentX;
			var distToBottom = canvas.height - currentY;
			if (current.getPos() == 'left') {
				drawRect(0, currentY, distToLeft, distToBottom);
			} else {
				drawRect(currentX, currentY, distToRight, distToBottom);
			}
			annotate('Lager ' + l, current);
			/*
			// Adjustment lines to keep values inside the box
			drawLine(0, currentY, canvas.width, currentY, true);
			drawLine(currentX, 0, currentX, canvas.height, true);
			*/
		}
		if (b.lager.length == 2) {
			updateInputField();
		}
	}
	if (b.gelenke.length) {
		for (var g = 0; g < b.gelenke.length; ++g) {
			var current = b.gelenke[g];
			drawCircle(current.getX(), current.getY());
		}
	}
	if (b.stab.length) {
		for (var s = 0; s < b.stab.length; ++s) {
			var current = b.stab[s];
			var left    = current.leftEnd < 2 ? b.lager[current.leftEnd] : b.gelenke[current.leftEnd-2];
			var right   = current.rightEnd < 2 ? b.lager[current.rightEnd] : b.gelenke[current.rightEnd-2];
			drawLine(left.getX(), left.getY(), right.getX(), right.getY());
		}
	}
}

function updateInputField() {
	var step   = document.getElementById('step');
	var type   = document.getElementById('type');
	var coords = document.getElementById('coords');
	var staebe = document.getElementById('staebe-input');
	var prnt   = coords.parentNode;
	step.innerHTML = 'Schritt 2: Gelenke und Stäbe festlegen';
	if (type.value == 'lager') {
		type.value    = 'gelenk';
		var lLabel    = document.createElement('label');
		lLabel.for    = 'left';
		lLabel.appendChild(document.createTextNode('left:'));
		var l         = document.createElement('input');
		l.id          = 'left';
		l.placeholder = '0';
		l.type        = 'number';
		l.min         = '0';
		l.step        = '1';
		var rLabel    = document.createElement('label');
		rLabel.for    = 'right'
		rLabel.appendChild(document.createTextNode('right:'));
		var r         = document.createElement('input');
		r.id          = 'right';
		r.placeholder = '0';
		r.type        = 'number';
		r.min         = '0';
		r.step        = '1';
		var saveBtn   = document.createElement('button');
		saveBtn.id    = 'save-stab';
		saveBtn.type  = 'button';
		saveBtn.appendChild(document.createTextNode('Speichern'));
		var calcBtn   = document.createElement('button');
		calcBtn.type  = 'button';
		calcBtn.appendChild(document.createTextNode('Berechnen'));
		staebe.appendChild(lLabel);
		staebe.appendChild(l);
		staebe.appendChild(rLabel);
		staebe.appendChild(r);
		staebe.appendChild(saveBtn);
		prnt.appendChild(calcBtn);
		/*
		stabBtn.addEventListener('click', buildDistanceMatrix, false);
		stabBtn.addEventListener('click', buildBridge, false);
		*/
	}
}

function clearList(list) {
	// TODO: removeEventListener first!
	while (list.firstChild) { list.removeChild(list.firstChild) };
};

function printCoordinates() {
	var lager   = document.getElementById('lager');
	var gelenke = document.getElementById('gelenke');
	clearList(lager);
	clearList(gelenke);
	for (var l = 0; l < b.lager.length; ++l) {
		var current = b.lager[l];
		var li      = document.createElement('li');
		var liText  = current.name + ' at (' + current.getX() + ', ' + current.getY() + ')';
		li.appendChild(document.createTextNode(liText));
		lager.appendChild(li);
	};
	for (var g = 0; g < b.gelenke.length; ++g) {
		var current = b.gelenke[g];
		var li      = document.createElement('li');
		var liText  = current.name + ' at (' + current.getX() + ', ' + current.getY() + ')';
		li.appendChild(document.createTextNode(liText));
		gelenke.appendChild(li);
		var leftSelector = document.getElementById('left');
		var rightSelector = document.getElementById('right');
		if (leftSelector) { leftSelector.max  = b.gelenke.length-1;}
		if (rightSelector) { rightSelector.max = b.gelenke.length-1; }
	}
};

function getPosition(event) {
	var canvas = document.getElementById('bridge');
	var x      = new Number();
	var y      = new Number();

	if (event.x != undefined && event.y != undefined) {
		x = event.x;
		y = event.y;
	} else { // Firefox hack?
		x = event.clientX + document.body.scrollLeft
		                  + document.documentElement.scrollLeft;
		y = event.clientY + document.body.scrollTop
		                  + document.documentElement.scrollTop;
	}
	x -= bridge.offsetLeft;
	y -= bridge.offsetTop;
	return {
		x: x,
		y: y
	}
};

function getDistance(g1, g2) {
  var x1 = g1.getX(), y1 = g1.getY();
  var x2 = g2.getX(), y2 = g2.getY();
  return Math.pow(Math.pow(x1-x2,2) + Math.pow(y1-y2,2) ,1/2);
};

function showCircle(x,y) {
	var r = 3;
  var bridge = document.getElementById('bridge');
  var drawingContext = bridge.getContext('2d');
  drawingContext.beginPath();
  drawingContext.arc(x, y, r, Math.PI*2, 0, true);
  drawingContext.fillStyle = '#8C8C8C';
  drawingContext.closePath();
  
  drawingContext.stroke();
}

function drawCircle(x,y) {
	var r = 3;
  var bridge = document.getElementById('bridge');
  var drawingContext = bridge.getContext('2d');
  drawingContext.beginPath();
  drawingContext.arc(x, y, r, Math.PI*2, 0, true);
  drawingContext.fillStyle = '#444444';
  drawingContext.fill();
  drawingContext.closePath();
  
  drawingContext.stroke();
};

function annotate(text, el) {
	var bridge = document.getElementById('bridge');
	var drawingContext = bridge.getContext('2d');
	drawingContext.font = "bold 12px sans-serif";
	drawingContext.fillText(text, el.getX()+5, el.getY()-5);
}

function drawLine(x1, y1, x2, y2, dashed) {
  console.log('Drawing: (' + x1 + ', ' + y1 + ') to (' + x2 + ', ' + y2 + ')');
  var bridge = document.getElementById('bridge');
  var drawingContext = bridge.getContext('2d');
	if (!drawingContext.setLineDash) {
		drawingContext.setLineDash = function () {}
	}
  drawingContext.beginPath();
	if (dashed) {
		drawingContext.setLineDash([10]);
	}
  drawingContext.moveTo(x1, y1);
  drawingContext.lineTo(x2, y2);
  drawingContext.stroke();
	if (dashed) {
		drawingContext.setLineDash([]);
	}
};

function drawRect(x,y,w,h) {
	var bridge = document.getElementById('bridge');
	var drawingContext = bridge.getContext('2d');
	drawingContext.beginPath();
	drawingContext.rect(x,y,w,h);
	drawingContext.closePath();
	drawingContext.fill();
	drawingContext.stroke();
}

function clearCanvas() {
	var bridge = document.getElementById('bridge');
	var drawingContext = bridge.getContext('2d');
	drawingContext.clearRect(0, 0, bridge.width, bridge.height);
}

function buildDistanceMatrix() {
	for (var i = 0; i < b.lager.length; ++i) {
		// As per definition, the first two stab are computed with respect to lager
		// The leftEnd hereby is the index of lager, the rightEnd the index of gelenk
		var d = computeDistanceRow(b.lager[i]);
		var s = new Stab();
		s.leftEnd = i;
		s.rightEnd = d.ind;
		s.setDistance(d.min);
	}
}

function computeDistanceRow(arr) {
	var distRow = [];
	for (var j = 0; j < b.gelenke.length; ++j) {
		var d = getDistance(arr, b.gelenke[j]);
		distRow.push(d);
	}
	var arrMin = Math.min(distRow);
	return {
		min: arrMin,
		ind: distRow.indexOf(arrMin),
		row: distRow
	}
}

function waitForTextReadComplete(reader) {
	reader.onloadend = function(event) {
		var text   = event.target.result;
		var step   = document.getElementById('step');
		var coords = document.getElementById('coords');
		
		parseTextAsXml(text);
		// Dismiss the manually input.
		step.style.display   = 'none';
		coords.style.display = 'none';
	}
}

function consumeXml(xml) {
    var bridgeDom = xml.childNodes[0];
    var lagerDom = bridgeDom.childNodes[0];
    for (var l = 0; l < bridgeDom.childNodes.length; ++l) {
	    var liX = bridgeDom.childNodes[l].childNodes[0].getAttribute('x');
	    var liY = bridgeDom.childNodes[l].childNodes[0].getAttribute('y');
	    var leftEnd = bridgeDom.childNodes[l].childNodes[0].getAttribute('leftEnd');
	    var rightEnd = bridgeDom.childNodes[l].childNodes[0].getAttribute('rightEnd');
			if (bridgeDom.childNodes[l].nodeName == 'lager') {
	    	var lager = new Lager();
		    lager.setX(liX);
		    lager.setY(liY);
	  	  b.addToList(lager);
			} else if (bridgeDom.childNodes[l].nodeName == 'gelenk') {
	    	var gelenk = new Gelenk();
		    gelenk.setX(liX);
		    gelenk.setY(liY);
	  	  b.addToList(gelenk);
			} else if (bridgeDom.childNodes[l].nodeName == 'stange') {
		var stange = new Stab();
		    stange.leftEnd = leftEnd;
		    stange.rightEnd = rightEnd;
		    b.addToList(stange);
			}
    }
    updateCanvas();
    printCoordinates();
}
