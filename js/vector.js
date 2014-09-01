Array.prototype.mult = function(other) {
	'use strict';
	if (!Array.isArray(other) && !isNumber(other)) {
		throw new Error("Not compatible!");
	}
	if(Array.isArray(other)) {
		return this.scalarProduct(other);
	}
	// isNumber(other)
	for (var i = 0; i < this.length; i++) {
		this[i] *= other;
	}
	return this;
}

Array.prototype.plus = function(other) {
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
}

Array.prototype.minus = function(other) {
	'use strict';
	if (!Array.isArray(other)) {
		throw new Error("Not compatible!");
	}
	for (var i = 0; i < this.length; i++) {
		this[i] -= other[i];
	}
	return this;
}

Array.prototype.scalarProduct = function(other) {
	'use strict';
  if (!Array.isArray(other)) {
		throw new Error("Not an array!");
	}

	if (this.length != other.length) {
		throw new Error("incompatible sizes!");
	}

	var result = 0;
	for (var i = 0; i < this.length; i++) {
		result += this[i] * other[i];
	}
	return result;
}

Array.prototype.norm = function() {
	'use strict';
	return Math.pow(this.scalarProduct(this), 1/2);
}

Array.prototype.normalise = function() {
	'use strict';
	var result = new Array(this.length);
	var n      = this.norm();
	for (var i = 0; i < this.length; i++) {
		result[i] = this[i]/n;
	}
	return result;
}

Array.prototype.cosine = function(other) {
	'use strict';
	if (!Array.isArray(other)) {
		throw new Error("Not an array!");
	}

	return (this.scalarProduct(other))/(this.norm() * other.norm());
}
// http://javascript.crockford.com/prototypal.html
