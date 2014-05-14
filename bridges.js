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
	gelenkeEl.addEventListener('click', buildBridge, false);
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
			var left    = b.lager[current.left];
			var right   = b.gelenke[current.right];
			drawLine(left.getX(), left.getY(), right.getX(), right.getX());
		}
	}
}

function updateInputField() {
	var step   = document.getElementById('step');
	var type   = document.getElementById('type');
	var coords = document.getElementById('coords');
	step.innerHTML = 'Schritt 2: Gelenke festlegen';
	if (type.value == 'lager') {
		type.value     = 'gelenk';
		var stabBtn = document.createElement("button");
		stabBtn.appendChild(document.createTextNode('Stab erstellen'));
		stabBtn.type  = 'button';
		stabBtn.id    = 'save-lager';
		coords.appendChild(stabBtn);
		stabBtn.addEventListener('click', buildDistanceMatrix, false);
	}
}

function printCoordinates() {
	var lager   = document.getElementById('lager');
	var gelenke = document.getElementById('gelenke');
	if (b.lager.length) {
		for (var l = 0; l < b.lager.length; ++l) {
			// FIXME: First entry twice
			var option  = document.createElement('option');
			option.text = b.lager[l].getPos();
			option.value = b.lager[l].getPos();
			lager.appendChild(option);
		};
	}
	if (b.gelenke.length) {
		for (var g = 0; g < b.gelenke.length; ++g) {
			var current = b.gelenke[g];
			var li      = document.createElement('li');
			var liText  = current.name + ' x: ' + current.getX() + ', y: ' + current.getY();
			li.appendChild(document.createTextNode(liText));
			console.log(li);
			gelenke.appendChild(li);
		}
	}

	/*
  buildBridge(b);
  var sEl    = document.getElementById('staebe');
  var sItem  = document.createElement('li');
	console.log(b.stab);
  var sPair  = b.stab[b.stab.length-1].name + ', '
        +'(' + b.stab[b.stab.length-1].leftEnd + ', '
             + b.stab[b.stab.length-1].rightEnd + ') = '
						 + b.stab[b.stab.length-1].getDistance().toFixed(3);
  sItem.appendChild(document.createTextNode(sPair));
  sEl.appendChild(sItem);
	*/
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

function buildBridge(bridge) {
  var gEl = document.getElementById('gelenke');
  if (bridge.gelenke.length > 1) {
    for (var i = 0; i < bridge.gelenke.length-1; ++i) {
      d = getDistance(bridge.gelenke[i], bridge.gelenke[i+1]);
      console.log('Distance between item #' + i + ' and #' + (i+1) + ' is '
		  + d + '.');
      var stab = new Stab;
      stab.leftEnd = i;
      stab.rightEnd = i+1;
      stab.setDistance(d);
			console.log(stab);
      bridge.stab.push(stab);
    };

    x1 = bridge.gelenke[bridge.stab[bridge.stab.length-1].leftEnd].getX();
    y1 = bridge.gelenke[bridge.stab[bridge.stab.length-1].leftEnd].getY();
    x2 = bridge.gelenke[bridge.stab[bridge.stab.length-1].rightEnd].getX();
    y2 = bridge.gelenke[bridge.stab[bridge.stab.length-1].rightEnd].getY();
    drawLine(x1, y1, x2, y2);
  };
};

function getDistance(g1, g2) {
  var x1 = g1.getX(), y1 = g1.getY();
  var x2 = g2.getX(), y2 = g2.getY();
  return Math.pow(Math.pow(x1-x2,2) + Math.pow(y1-y2,2) ,1/2);
};

// Monkeypatch Math.min for accepting arrays
var standardMin = Math.min;
Math.min = function() {
	if(Array.isArray(arguments[0])) {
		return standardMin.apply(Math, arguments[0]);
	} else {
		return standardMin(arguments[0]);
	}
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

function parseTextAsXml(text) {
    var parser = new DOMParser(),
        xmlDom = parser.parseFromString(text, "text/xml");
    consumeXml(xmlDom);
}

function waitForTextReadComplete(reader) {
    reader.onloadend = function(event) {
        var text   = event.target.result;
	var step   = document.getElementById('step');
	var coords = document.getElementById('coords');

        parseTextAsXml(text);
	step.style.display   = 'none';
	coords.style.display = 'none';
    }
}

function handleFileSelection() {
    var file = fileChooser.files[0],
        reader = new FileReader();

    waitForTextReadComplete(reader);
    reader.readAsText(file);
}

function consumeXml(xml) {
    var bridgeDom = xml.childNodes[0];
    var lagerDom = bridgeDom.childNodes[0];
    for (var l = 0; l < bridgeDom.childNodes.length; ++l) {
	    var liX = bridgeDom.childNodes[l].childNodes[0].getAttribute('x');
	    var liY = bridgeDom.childNodes[l].childNodes[0].getAttribute('y');
	    var lager = new Lager();
	    lager.setX(liX);
	    lager.setY(liY);
	    b.addToList(lager);
    }
    updateCanvas();
    printCoordinates();
}
