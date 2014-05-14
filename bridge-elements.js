// FIXME:
// - cleanup properties and methods (namespace!)
// - only fire DOM-related elements when ready
// - separate logic from presentation (= DOM)
// - calculate stange automatically (?, looking in neighborhood)
//
// Gelenk = Kinematic pair
// Lager = bearing
// Stab = rod
//
// Flow:
//  1. Ask for Lager position and fill rects to the nearest border
//  2. Ask for Gelenk position and add the circles
//  3. Ask for Stab ends by clicking the respective elements in list
//  Make all of above steps editable

// Uncomment if needed
//Object.prototype.extend = function(newProperties) {
//  for (var propertyName in newProperties) {
//    this[propertyName] = newProperties[propertyName];
//  }
//  return this;
//};

var Bridge = function() {
  this.gelenke = [];
  this.stab    = [];
  this.lager   = [];
};

Bridge.prototype.addToList = function(g) {
	var canvas       = document.getElementById('bridge');
	var x            = g.getX();
	var y            = g.getY();
	// TODO: isWithinBounds for canvas.width and gelenke with respect to lager
	if (x > 0 && x < canvas.width && y > 0 && y < canvas.height) {
		if(this.isDuplicate(g)) {return false} ;
		switch (g.name) {
			case "Lager":
				console.log((this.lager.length+1) + '. ' + g.name
												                  + ' at (' + x + ',' + y + ').');
				var distToLeft   = x - 0;
				var distToRight  = canvas.width - x;
				console.log('Distance to left boundary: ' + distToLeft);
				console.log('Distance to right boundary: ' + distToRight);
				if (distToLeft < distToRight) {
					if (b.lager[1] && b.lager[1].getPos() == 'left') {
						return false;
					} else {
						g.setPos('left');
					}
				} else {
					if (b.lager[1] && b.lager[1].getPos() == 'right') {
						return false;
					} else {
						g.setPos('right');
					}
				};
				if (b.lager.length) { // Adjust the y-coord of the 2nd lager
					g.setY((b.lager[0].getY()));
				}
				this.lager.push(g);
				break;
			case "Gelenk":
				for (var l = 0; l < b.lager.length; ++l) {
					if (y > b.lager[l].getY()) { // measured from top-left corner
						console.log(g.name + ' below the treshold.');
						return false;
					}
					if (b.lager[l].getPos() == 'left' && x < b.lager[l].getX()) {
						console.log(g.name + ' left out of the treshold.');
						return false;
					}
					if (b.lager[l].getPos() == 'right' && x > b.lager[l].getX()) {
						console.log(g.name + ' right out of the treshold.');
						return false;
					}
				}
				console.log((this.gelenke.length+1) + '. ' + g.name
													                  + ' at (' + x + ',' + y + ').');
				this.gelenke.push(g);
				break;
			default:
				console.log("I don't know, where to add.");
				break;
		}
	// TODO: Draw circle and add to list
	} else {
		console.log('Element exceeds boundaries: (' + x + ';' + y + ') '
						  + 'does not fit into '
							+ ']0;' + canvas.width + '[x]0;' + canvas.height + '[.');
		return false;
	};
}

Bridge.prototype.isDuplicate = function(g) {
	for (var gNew = 0; gNew < this.gelenke.length; ++gNew) {
		if (g.getX() == this.gelenke[gNew].getX() && g.getY() == this.gelenke[gNew].getY()) {
			console.log('Already saved: ' + g.name + '(' + g.getX() + ',' + g.getY() + ').');
			return true;
		}
		return false;
	}
}
Bridge.prototype.isPosSet = function(bItem, pos) {
	return (bItem && bItem.getPos() == pos)
}

var Gelenk = function() {
  this.name = 'Gelenk';
  this._x =   null;
  this._y =   null;
};

Gelenk.prototype.getX = function()  { return this._x; };
Gelenk.prototype.getY = function()  { return this._y; };
Gelenk.prototype.setX = function(x) { this._x = parseInt(x); };
Gelenk.prototype.setY = function(y) { this._y = parseInt(y); };

var Stab = function() {
  this.name      = 'Stab';
  this.leftEnd   = undefined;
  this.rightEnd  = undefined;
  this._distance = null;
};

Stab.prototype.getDistance = function()         { return this._distance; };
Stab.prototype.setDistance = function(distance) { this._distance = distance; }

var Lager = function(name) {
  this.name  = 'Lager';
	this._mass = null;
	this._pos  = null;
};
Lager.prototype = new Gelenk();
Lager.prototype.constructor = Lager;
Lager.prototype.getMass  = function() { return this._mass; };
Lager.prototype.setMass  = function(mass){ this._mass = mass; };
Lager.prototype.getPos  = function() { return this._pos; };
Lager.prototype.setPos  = function(pos){ this._pos = pos; };
