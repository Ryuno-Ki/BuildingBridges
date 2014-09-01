/**
 * The built-in Array object
 * @external Array
 * @see {@link https://developer.mozilla.org/de/docs/JavaScript/Reference/Global_Objects/Array Array}
 */

/**
 * Multiply an Array with another object
 * @todo Use {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error documentation} to throw a proper Error
 * @todo Update the tests after it
 * @this Array
 * @function external:Array#mult
 * @param {Array|Number} other - The other factor
 * @throws "Not Compatible!"   - If other is neither Array nor Number
 * @returns {this}             - The product of this and param
 */
Array.prototype.mult = function(other) {
    'use strict';
    if (!Array.isArray(other) && !isNumber(other)) {
        throw new Error("Not compatible!");
    }

    if(Array.isArray(other)) {
        return this._scalarProduct(other);
    }
    // isNumber(other)
    for (var i = 0; i < this.length; i++) {
        this[i] *= other;
    }
    return this;
};

/**
 * Adds an Array to another array
 * @todo Use {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error documentation} to throw a proper Error
 * @todo Update the tests after it
 * @this Array
 * @function external:Array#plus
 * @param {Array} other      - The other summand
 * @throws "Not compatible!" - If either other is not an array or does not have a compatible length
 * @returns {this}           - The sum of this and param
 */
Array.prototype.add = function(other) {
    'use strict';
    if (!Array.isArray(other)) {
        throw new Error("Not compatible!");
    }
    if (this.length != other.length) {
        throw new Error("Not compatible!");
    }

    for (var i = 0; i < this.length; i++) {
        this[i] += other[i];
    }
    return this;
};


/**
 * Subtracts an Array from another array
 * @todo Use {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error documentation} to throw a proper Error
 * @todo Update the tests after it
 * @this Array
 * @function external:Array#minus
 * @param {Array} other      - The other subtrahend
 * @throws "Not compatible!" - If either other is not an array or does not have a compatible length
 * @returns {this}           - The difference of this and param
 */
Array.prototype.minus = function(other) {
    'use strict';
    if (!Array.isArray(other)) {
        throw new Error("Not compatible!");
    }
    if (this.length != other.length) {
        throw new Error("Not compatible!");
    }

    return this.add(other.mult(-1));
};

/**
 * Computes the scalar product of an Array with another array
 * @todo Use {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error documentation} to throw a proper Error
 * @todo Update the tests after it
 * @this Array
 * @function external:Array#_scalarProduct
 * @private
 * @param {Array} other      - The other factor
 * @throws "Not compatible!" - If either other is not an array or does not have a compatible length
 * @returns {this}           - The scalar product of this and param
 */
Array.prototype._scalarProduct = function(other) {
    'use strict';
    if (!Array.isArray(other)) {
        throw new Error("Not an array!");
    }

    if (this.length != other.length) {
        throw new Error("Incompatible sizes!");
    }

    var result = 0;
    for (var i = 0; i < this.length; i++) {
        result += this[i] * other[i];
    }
    return result;
};


/**
 * Computes the vector norm of an Array
 * @this Array
 * @function external:Array#norm
 * @returns {Number}           - The vector norm of this
 */
Array.prototype.norm = function() {
    'use strict';
    return Math.pow(this._scalarProduct(this), 1/2);
};


/**
 * Computes the normalised vector of an Array
 * @this Array
 * @function external:Array#normalise
 * @returns {Array}           - The normalised vector
 */
Array.prototype.normalise = function() {
    'use strict';
    var result = new Array(this.length);
    var n      = this.norm();
    for (var i = 0; i < this.length; i++) {
        result[i] = this[i]/n;
    }
    return result;
};

/*
Array.prototype.cosine = function(other) {
    'use strict';
    if (!Array.isArray(other)) {
        throw new Error("Not an array!");
    }

    return (this._scalarProduct(other))/(this.norm() * other.norm());
};
*/
// http://javascript.crockford.com/prototypal.html
