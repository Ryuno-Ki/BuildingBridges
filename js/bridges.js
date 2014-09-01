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

/**
 * @todo Wrap this function into Bridge namespace
 */
function init() {
	var canvas         = document.getElementById('bridge');
	var fileChooser    = document.getElementById('fileChooser');
	var coords         = document.getElementById('coords');
	var coordsBtn      = document.getElementById('submit-coords');
	var gelenkeEl      = document.getElementById('gelenke');
	var elasticity     = document.getElementById('elastic');
	var gravity        = document.getElementById('gravis');
	var isMobileDevice = navigator.userAgent.match(/ipad|iphone|ipod|android/i);

	if (isMobileDevice) {
		gelenkBtn.addEventListener('mousedown', addCoordinates, false);
		canvas.addEventListener('mousedown', getPosition, false);
	} else {
		canvas.addEventListener('click', function(e) {
			pnt = getPosition(e);
	    		clearCanvas();
			updateCanvas(undefined, pnt.x, pnt.y);
		}, false);
		coords.addEventListener('keyup', function() {
			x = document.getElementById('x-coord').value;
			y = document.getElementById('y-coord').value;
	    		clearCanvas();
			updateCanvas(undefined, x, y);
		}, false);
	};
	// Both
	fileChooser.addEventListener('change', handleFileSelection, false);
	coordsBtn.addEventListener('click', function() {
		x    = document.getElementById('x-coord').value;
		y    = document.getElementById('y-coord').value;
		m    = document.getElementById('gravity').value;
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
				g.setMass(m);
				b.addToList(g);
				printCoordinates();
			}
		}
		clearCanvas();
		updateCanvas();
	}, false);
	elasticity.addEventListener('change', function(e) {
		// Keep range in sync with numeric input
		switch(e.target.id) {
			case 'elasticity':
				document.getElementById('elasticity-range').value = e.target.value;
				break;
			case 'elasticity-range':
				document.getElementById('elasticity').value = e.target.value;
				break;
		}
	}, false);
	gravity.addEventListener('change', function(e) {
		// Keep range in sync with numeric input
		switch(e.target.id) {
			case 'gravity':
				document.getElementById('gravity-range').value = e.target.value;
				break;
			case 'gravity-range':
				document.getElementById('gravity').value = e.target.value;
				break;
		}
	}, false);
};

function updateCanvas(colour,x,y) {
	var canvas       = document.getElementById('bridge');
	var xCoord       = document.getElementById('x-coord');
	var yCoord       = document.getElementById('y-coord');
    console.log('CHECKING',colour,x,y);
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
			//annotate('Lager ' + l, current);
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
			drawCircle(current.getX(), current.getY(), colour);
		}
	}
	if (b.stab.length) {
		for (var s = 0; s < b.stab.length; ++s) {
			var current = b.stab[s];
			var left    = current.leftEnd < 2 ? b.lager[current.leftEnd] : b.gelenke[current.leftEnd-2];
			var right   = current.rightEnd < 2 ? b.lager[current.rightEnd] : b.gelenke[current.rightEnd-2];
			drawLine(left.getX(), left.getY(), right.getX(), right.getY(), colour);
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
		l.value       = '0';
		l.type        = 'number';
		l.min         = '0';
		l.step        = '1';
		var rLabel    = document.createElement('label');
		rLabel.for    = 'right'
		rLabel.appendChild(document.createTextNode('right:'));
		var r         = document.createElement('input');
		r.id          = 'right';
		r.value       = '0';
		r.type        = 'number';
		r.min         = '0';
		r.step        = '1';
		var saveBtn   = document.createElement('button');
		saveBtn.id    = 'save-stab';
		saveBtn.type  = 'button';
		saveBtn.appendChild(document.createTextNode('Speichern'));
		var calcBtn   = document.createElement('button');
		calcBtn.id    = 'calculate';
		calcBtn.type  = 'button';
		calcBtn.appendChild(document.createTextNode('Berechnen'));
		staebe.appendChild(lLabel);
		staebe.appendChild(l);
		staebe.appendChild(rLabel);
		staebe.appendChild(r);
		staebe.appendChild(saveBtn);
		prnt.appendChild(calcBtn);
		
		calcBtn.addEventListener('click', mainLes, false);
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
	var staebe  = document.getElementById('staebe');
	clearList(lager);
	clearList(gelenke);
	clearList(staebe);
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
	for (var s = 0; s < b.stab.length; s++) {
		var current = b.stab[s];
		var li      = document.createElement('li');
		var liText  = current.name + ' between ' + current.leftEnd + ' and ' + current.rightEnd;
		li.appendChild(document.createTextNode(liText));
		staebe.appendChild(li);
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

function drawCircle(x,y, colour) {
	var r = 3;
  var bridge = document.getElementById('bridge');
  var drawingContext = bridge.getContext('2d');
  drawingContext.beginPath();
  drawingContext.arc(x, y, r, Math.PI*2, 0, true);
  drawingContext.fillStyle = colour || '#444444';
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

function drawLine(x1, y1, x2, y2, dashed, colour) {
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
  drawingContext.fillStyle = colour || 'black';
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
    // TODO: Alternatively set context.width to itself
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
		var staebe = document.getElementById('staebe-input');
		
		parseTextAsXml(text);
		// Dismiss the manually input.
		step.style.display   = 'none';
		coords.style.display = 'none';
		staebe.style.display = 'none';
	}
}

function consumeXml(xml) {
    var bridgeDom = xml.childNodes[0];
    var lagerDom = bridgeDom.childNodes[0];
    for (var l = 0; l < bridgeDom.childNodes.length; ++l) {
	    var liX = bridgeDom.childNodes[l].childNodes[0].getAttribute('x');
	    var liY = bridgeDom.childNodes[l].childNodes[0].getAttribute('y');
	    var liMass = bridgeDom.childNodes[l].childNodes[0].getAttribute('mass');
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
		    gelenk.setMass(liMass);
            b.addToList(gelenk);
		} else if (bridgeDom.childNodes[l].nodeName == 'stange') {
            var stange = new Stab();
		    stange.leftEnd = leftEnd;
		    stange.rightEnd = rightEnd;
            stange.setMass(liMass);
		    b.addToList(stange);
		}
    }
    updateCanvas();
    printCoordinates();
}

function produceXml(bridge) {
    'use strict';
    var children = '';
    for (var l = 0; l < bridge.lager.length; l++) {
        var details = createClosedXmlTag('details', {
            'mass': 0,
            'x': bridge.lager[l].getX(),
            'y': bridge.lager[l].getY()
        });
        var lager = createXmlTag('lager', details);
        children += lager;
    }
    for (var g = 0; g < bridge.gelenke.length; g++) {
        var details = createClosedXmlTag('details', {
            'mass': bridge.gelenke[g].getMass(),
            'x': bridge.gelenke[g].getX(),
            'y': bridge.gelenke[g].getY()
        });
        var gelenk = createXmlTag('gelenk', details);
        children += gelenk;
    }
    for (var s = 0; s < bridge.stab.length; s++) {
        var details = createClosedXmlTag('details', {
            'mass': bridge.stab[s].getMass(),
            'leftEnd': bridge.stab[s].leftEnd,
            'rightEnd': bridge.stab[s].rightEnd
        });
        var stab = createXmlTag('stange', details);
        children += stab;
    }
    var bridgeXml = createXmlTag('bridge', children);
   
    var output = document.getElementById('output');
    var textarea = document.createElement('textarea');
    textarea.cols = "35";
    textarea.rows = "58";
    textarea.readOnly = 'readonly';
    textarea.style.overflow = 'hidden';
    textarea.value = bridgeXml;
    output.appendChild(textarea);
    return bridgeXml;
}

function createXmlTag(name, children, attributes) {
    'use strict';
    var tag = '<' + name;
    if (attributes) {
        for (var attrKey in attributes) {
            tag += ' ' + attrKey + '="' + attributes[attrKey] + '"';
        }
    }
    tag += '>';
    
    if (children) {
        tag += children;
    }
    
    tag += '</' + name + '>';
    return tag;
}

function createClosedXmlTag(name, attributes) {
    'use strict';
    var tag = '<' + name;
    if (attributes) {
        for (var attrKey in attributes) {
            tag += ' ' + attrKey + '="' + attributes[attrKey] + '"';
        }
    }
    tag += ' />';
    return tag;
}
