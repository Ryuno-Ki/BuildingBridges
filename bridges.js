// FIXME:
// - check boundaries of canvas before pushing new gelenk to bridge
// - cleanup properties and methods (namespace!)
// - only fire DOM-related elements when ready
// - separate logic from presentation (= DOM)
// - calculate stange automatically (?, looking in neighborhood)
// - handle relationships
//
// Gelenk = Kinematic pair
// Lager = bearing
// Stab = rod

Object.prototype.extend = function(newProperties) {
  for (var propertyName in newProperties) {
    this[propertyName] = newProperties[propertyName];
  }
  return this;
};

var Bridge = {
  gelenke: new Array(),
  stab:    new Array(),
  lager:   new Array(),
  addGelenk: function(g) {
    console.log('Adding ' + g.name + '(' + g.x() + ', ' + g.y() + ') as '
      + (this.gelenke.length+1) + '. element.');
    this.gelenke.push(g);
  }
};

var Gelenk = {
  name: 'Gelenk',
  _x:   null,
  _y:   null,
  init: function(name, x,y) {
    console.log('Create new ' + name + ' with (' + x + ', ' + y + ').');
    this.name = name;
    this._x = x;
    this._y = y;
  },
  x:       function()     { return this._x; },
  y:       function()     { return this._y; },
  setX:    function(x)    { this._x = x; },
  setY:    function(y)    { this._y = y; },
};

var Stab = {
  name:      'Stab',
  leftEnd:   undefined,
  rightEnd:  undefined,
  _length:   null,
  length:    function()       { return this._length; },
  setLength: function(length) { this._length = length; }
};

var Lager = Object.create(Gelenk).extend( {
  name:    'Lager',
  _mass:   null,
  mass:    function()    { return this._mass; },
  setMass: function(mass){ this._mass = mass; } 
});

document.addEventListener('DOMContentLoaded', init, false);
function init() {
  var gelenkBtn = document.getElementById('add-gelenk');
  var bridgeEl  = document.getElementById('bridge');
  var gelenkeEl = document.getElementById('gelenke');
  gelenkBtn.addEventListener('click', addCoordinates, false);
  bridgeEl.addEventListener('mousedown', getPosition, false);
  gelenkeEl.addEventListener('click', buildBridge, false);
};

function addCoordinates() {
  gX = document.getElementById('gelenk-x').value;
  gY = document.getElementById('gelenk-y').value;
  b = Object.create(Bridge);
  g = Object.create(Gelenk);
  g.setX(gX);
  g.setY(gY);
  b.addGelenk(g);
  printCoordinates(b, gX,gY);
};

function printCoordinates(b, x,y) {
  gelenke = document.getElementById('gelenke');
  var gItem = document.createElement('li');
  var gPair = b.gelenke[b.gelenke.length-1].name +
        '(' + b.gelenke[b.gelenke.length-1].x() + ', '
            + b.gelenke[b.gelenke.length-1].y() + ')';
  gItem.appendChild(document.createTextNode(gPair));
  gelenke.appendChild(gItem);

  buildBridge();
  staebe  = document.getElementById('staebe');
  var sItem = document.createElement('li');
  console.log(b.stab[b.stab-length-1]);
  var sPair = b.stab[b.stab.length-1].name +
        '(' + b.stab[b.stab.length-1].leftEnd + ', '
	    + b.stab[b.stab.length-1].rightEnd + ') = '
	    + b.stab[b.stab.length-1].length();
  sItem.appendChild(document.createTextNode(sPair));
  staebe.appendChild(sItem);
};

function getPosition(event) {
  var bridge = document.getElementById('bridge');
  var gelenkX = document.getElementById('gelenk-x');
  var gelenkY = document.getElementById('gelenk-y');
  var x = new Number();
  var y = new Number();
  var b = Object.create(Bridge);
  var g = Object.create(Gelenk);

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
  g.setX(x); g.setY(y);
  b.addGelenk(g);
  printCoordinates(b, x,y);
  drawCircle(x,y,2);
  gelenkX.value = x;
  gelenkY.value = y;
  console.log('x: ' + x + ', y: ' + y);
};

function buildBridge() {
  var gelenke = document.getElementById('gelenke');
  if (Bridge.gelenke.length > 1) {
    for (var i = 0; i < Bridge.gelenke.length-1; ++i) {
      d = getDistance(Bridge.gelenke[i], Bridge.gelenke[i+1]);
      console.log('Distance between item #' + i + ' and #' + (i+1) + ' is '
		  + d + '.');
      var stab = Object.create(Stab);
      stab.leftEnd = i;
      stab.rightEnd = i+1;
      stab.setLength(d);
      Bridge.stab.push(stab);
    };
    x1 = Bridge.gelenke[Bridge.stab[Bridge.stab.length-1].leftEnd].x();
    y1 = Bridge.gelenke[Bridge.stab[Bridge.stab.length-1].leftEnd].y();
    x2 = Bridge.gelenke[Bridge.stab[Bridge.stab.length-1].rightEnd].x();
    y2 = Bridge.gelenke[Bridge.stab[Bridge.stab.length-1].rightEnd].y();
    console.log(x1);
    console.log(y1);
    console.log(x2);
    console.log(y2);
    drawLine(x1, y1, x2, y2);
  };
};

function getDistance(g1, g2) {
  var x1 = g1.x(), y1 = g1.y();
  var x2 = g2.x(), y2 = g2.y();
  return Math.pow(Math.pow(x1-x2,2) + Math.pow(y1-y2,2) ,1/2);
};

function drawCircle(x,y,r){
  var bridge = document.getElementById('bridge');
  var drawingContext = bridge.getContext('2d');
  drawingContext.beginPath();
  drawingContext.arc(x, y, r, Math.PI*2, 0, true);
  drawingContext.fillStyle = '#444444';
  drawingContext.fill();
  drawingContext.closePath();
  
  drawingContext.stroke();
};

function drawLine(x1, y1, x2, y2) {
  var bridge = document.getElementById('bridge');
  var drawingContext = bridge.getContext('2d');
  drawingContext.beginPath();
  drawingContext.moveTo(x1, y1);
  drawingContext.lineTo(x2, y2);
  drawingContext.closePath();
  drawingContext.stroke();
};
