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

/** 
 * Global object representating the model
 * @constructor
 * @this {Bridge}
 * @property {array} gelenke - Households associated gelenke
 * @property {array} stab    - Households associated stab
 * @property {array} lager   - Households associated lager
 * @return {Bridge}
 */
var Bridge = function() {
  this.gelenke = [];
  this.stab    = [];
  this.lager   = [];
  return this;
};

/** 
 * Sanitizes input and adds it to the respective list if valid
 * @todo Break this method up into smaller private chunks
 * @todo Move the if-check into a separate function(g,canvas)
 * @memberOf Bridge
 * @instance
 * @method addToList
 * @this {Bridge}
 * @param {object} g - The thing asking for being added to a list
 * @return {boolean} false - g was rejected
 * @return {boolean} true  - g was added successfully
 */
Bridge.prototype.addToList = function(g) {
	/***
	 * Reference to the canvas element in DOM
	 * @external Canvas
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas Canvas}
	 */
	var canvas       = document.getElementById('bridge');
	var x            = g.getX ? g.getX() : undefined;
	var y            = g.getY ? g.getY() : undefined;
	if (x && x > 0 && x < canvas.width && y && y > 0 && y < canvas.height) {
		if(this.isDuplicate(g)) {return false;}
		switch (g.name) {
			case "Lager":
				console.log((this.lager.length+1) + '. ' + g.name + ' at (' + x + ',' + y + ').');
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
				}
				if (b.lager.length) { // Adjust the y-coord of the 2nd lager
					g.setY((b.lager[0].getY()));
				}
				this.lager.push(g);
				return true;
			case "Gelenk":
				console.log((this.gelenke.length+1) + '. ' + g.name + ' at (' + x + ',' + y + ').');
				this.gelenke.push(g);
				return true;
			default:
				console.log("I don't know, where to add.");
				return false;
		}
	// TODO: Draw circle and add to list
	} else if (g.name == 'Stab') {
        if (this.isDuplicate(g)) { return false; }
		this.stab.push(g);
		return true;
	} else {
		console.log('Element exceeds boundaries: (' + x + ';' + y + ') ' + 'does not fit into ' + ']0;' + canvas.width + '[x]0;' + canvas.height + '[.');
		return false;
	}	
	return false;
};

/**
 * Checks, whether the param is already in the respective list
 * @memberOf Bridge
 * @instance
 * @method isDuplicate
 * @param {object} g - either a Lager or a Gelenk or a Stab instance
 * @returns {boolean} true  - Param is already present
 * @returns {boolean} false - Param isn't there yet
 */
Bridge.prototype.isDuplicate = function(g) {
    switch (g.name) {
        case "Lager":
            for (var lNew = 0; lNew < this.lager.length; ++lNew) {
                if (g.getX() == this.lager[lNew].getX() && g.getY() == this.lager[lNew].getY()) {
                    console.log('Already saved: ' + g.name + '(' + g.getX() + ',' + g.getY() + ').');
                    return true;
                }
            }
            break;
        case "Gelenk":
            for (var gNew = 0; gNew < this.gelenke.length; ++gNew) {
                if (g.getX() == this.gelenke[gNew].getX() && g.getY() == this.gelenke[gNew].getY()) {
                    console.log('Already saved: ' + g.name + '(' + g.getX() + ',' + g.getY() + ').');
                    return true;
                }
            }
            break;
        case "Stab":
            for (var sNew = 0; sNew < this.stab.length; ++sNew) {
                if (g.leftEnd == this.stab[sNew].leftEnd && g.rightEnd == this.stab[sNew].rightEnd) {
                    console.log('Already saved: ' + g.name + '(' + g.leftEnd + ',' + g.rightEnd + ').');
                    return true;
                }
            }
            break;
        default:
            return false;
	}
};

/**
 * Checks, whether the position matches pos
 * @todo Where is this used? Sanitize the types!
 * @memberOf Bridge
 * @instance
 * @method isPosSet
 * @param {object} bItem - a bridge Item
 * @param {string} pos   - either 'left' or 'right'
 * @returns {boolean} true|false - Depends on the check
 */
Bridge.prototype.isPosSet = function(bItem, pos) {
	return (bItem && bItem.getPos() == pos);
};

/**
 * Represents a Gelenk within the bridge
 * @constructor
 * @this Gelenk
 * @property {string} name
 * @returns this
 */
var Gelenk = function() {
  /** 
   * Used in some {@link Bridge}.prototype functions for determination
   * @default Gelenk
   * @readonly
   */
  this.name  = 'Gelenk';

  /**
   * x value of the instance 
   * @private
   * @default null
   */
   this._x    = null;

  /**
   * y value of the instance 
   * @private
   * @default null
   */
   this._y    = null;

  /**
   * Used for calculus under gravity
   * @private
   * @default null
   */
   this._mass = null;
   return this;
};

/**
 * Getter for private x value
 * @memberOf Gelenk
 * @instance
 * @method getX
 * @this Gelenk
 * @returns Gelenk.x
 */
Gelenk.prototype.getX = function()  { return this._x; };

/**
 * Getter for private y value
 * @memberOf Gelenk
 * @instance
 * @method getY
 * @this Gelenk
 * @returns Gelenk.y
 */
Gelenk.prototype.getY = function()  { return this._y; };

/**
 * Getter for private mass value
 * @memberOf Gelenk
 * @instance
 * @method getMass
 * @this Gelenk
 * @returns Gelenk.mass
 */
Gelenk.prototype.getMass = function()  { return this._mass; };

/**
 * Setter for private x value
 * @memberOf Gelenk
 * @instance
 * @method setX
 * @param {number} x - The new x value.
 * @this Gelenk
 * @returns undefined
 */
Gelenk.prototype.setX = function(x) { this._x = parseInt(x); };

/**
 * Setter for private y value
 * @memberOf Gelenk
 * @instance
 * @method setY
 * @param {number} y - The new y value.
 * @this Gelenk
 * @returns undefined
 */
Gelenk.prototype.setY = function(y) { this._y = parseInt(y); };

/**
 * Setter for private mass value
 * @memberOf Gelenk
 * @instance
 * @method setMass
 * @param {number} mass - The new mass value.
 * @this Gelenk
 * @returns undefined
 */
Gelenk.prototype.setMass = function(mass) { this._mass = parseFloat(mass); };

/**
 * Represents a Stab in the Bridge.
 * @constructor
 * @this Stab
 * @property {string} name
 * @property {number} leftEnd
 * @property {number} rightEnd
 * @returns this
 */
var Stab = function() {
  /**
   * Used for determination in some {@link Bridge}.prototype functions
   * @default Stab
   * @readonly
   */	
  this.name      = 'Stab';

  /**
   *  Holds a reference to the left Gelenk or Lager
   *  @default undefined
   */
  this.leftEnd   = undefined;

  /**
   *  Holds a reference to the right Gelenk or Lager
   *  @default undefined
   */
  this.rightEnd  = undefined;

  /**
   * A virtual for the distance between leftEnd and rightEnd  
   * @private
   * @virtual
   * @default null
   */
  this._distance = null;

  /** 
   * Used for calculus under gravity
   * @private
   * @default null
   */
  this._mass = null;
  return this;
};

/**
 * Calculates the distance between Stab.leftEnd and Stab.rightEnd
 * @memberOf Stab
 * @instance
 * @this Stab
 * @method getDistance
 * @returns this._distance
 */
Stab.prototype.getDistance = function()         { 
    if (!this._distance) {
        var left = this.leftEnd < 2 ? b.lager[parseInt(this.leftEnd)] : b.gelenke[parseInt(this.leftEnd)-2];
        var right = this.rightEnd < 2 ? b.lager[parseInt(this.rightEnd)] :  b.gelenke[parseInt(this.rightEnd)-2];
        this._distance = Math.pow(Math.pow(left.getX() - right.getX(), 2) + Math.pow(left.getY() - right.getY(), 2), 1/2);
    }
    return this._distance;
};

/**
 * Overwrites the private property distance with param
 * @todo Check, whether this function is ever called resp. throw an error
 * @memberOf Stab
 * @instance
 * @this Stab
 * @method setDistance
 * @param {number} distance - the new distance
 * @returns undefined
 */
Stab.prototype.setDistance = function(distance) { this._distance = distance; };

/**
 * Returns the private property mass
 * @memberOf Stab
 * @instance
 * @this Stab
 * @method getMass
 * @returns this._mass
 */
Stab.prototype.getMass  = function() { return this._mass; };

/**
 * Overwrites the private property mass with param
 * @todo Check, whether this function is ever called resp. throw an error
 * @memberOf Stab
 * @instance
 * @this Stab
 * @method setMass
 * @param {number} mass - the new mass
 * @returns undefined
 */
Stab.prototype.setMass  = function(mass){ this._mass = mass; };

/**
 * Represents a Lager in the Bridge.
 * @constructor
 * @augments Gelenk
 * @property {string} name
 * @returns this
 */
var Lager = function() {
  /**
   * Used for determination in some {@link Bridge}.prototype functions
   * @default Lager
   * @readonly
   */	
  this.name  = 'Lager';

  /**
   * Used for calculus under gravity
   * @private
   * @default null
   */
  this._mass = null;

  /**
   * Indicates, whether the instance is placed left or right in canvas
   * @private
   * @default null
   */
  this._pos  = null;
  return this;
};
Lager.prototype = new Gelenk();

/**
 * @todo Check, whether this is really necessary
 */
Lager.prototype.constructor = Lager;
//Lager.prototype.getMass  = function() { return this._mass; };
//Lager.prototype.setMass  = function(mass){ this._mass = mass; };
//Lager.prototype.getPos  = function() { return this._pos; };
//Lager.prototype.setPos  = function(pos){ this._pos = pos; };
