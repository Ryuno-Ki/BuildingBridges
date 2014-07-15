// Example call: 
// var m = new Matrix([ [1,1,1,1],
//                      [2,4,8,16],
//                      [3,9,27,81],
//                      [4,16,64,256],
//                      [5,25,125,625] ]);
function Matrix(ary) {
    this.mtx    = ary
    this.height = ary.length;
    this.width  = Array.isArray(ary[0]) ? ary[0].length : 1;
}
 
Matrix.prototype.toString = function() {
    var s = []
    for (var i = 0; i < this.mtx.length; i++) {
				if (Array.isArray(this.mtx[i])) {
					s.push( this.mtx[i].join(",") );
				} else {
					// FIXME: Wrap the value inside an array of length 1
					//console.log([].push(this.mtx[i]));
					s.push( this.mtx[i] );
				}
		}
    return s.join("\n");
}

Matrix.prototype.copy = function() {
		var c = new Array(this.height);
		for (var i = 0; i < this.height; i++) {
			c[i] = new Array(this.width);
			for (var j = 0; j < this.width; j++) {
				c[i][j] = this.mtx[i][j];
			}
		}
		return new Matrix(c);
}
 
// returns a new matrix
Matrix.prototype.transpose = function() {
    var transposed = [];
    for (var i = 0; i < this.width; i++) {
        transposed[i] = [];
        for (var j = 0; j < this.height; j++) {
            transposed[i][j] = this.mtx[j][i];
        }
    }
    return new Matrix(transposed);
}

Matrix.prototype.mult = function(other) {
	// TODO: Sanitinzing
	if (isNumber(other)) { // Matrix * Number
		var result = new Array(this.height);
		for (var i = 0; i < this.height; i++) {
			result[i] = new Array(this.width);
			for (var j = 0; j < this.width; j++) {
				result[i][j] = this.mtx[i][j] * other;
			}
		}
	} else if (Array.isArray(other)) { // Matrix * Array
		var result = new Array(this.height);
		for (var i = 0; i < this.height; i++) {
				var sum = 0;
				for (var j = 0; j < other.length; j++) {
						sum += this.mtx[i][j] * other[j];
				}
				result[i] = sum;
		}
	} else { // Matrix * Matrix
		var result = new Array(this.height);
		for (var i = 0; i < this.height; i++) {
			result[i] = new Array(other.width);
			for (var j = 0; j < other.width; j++) {
				var sum = 0;
				for (var k = 0; k < this.width; k++) {
					sum += this.mtx[i][k] * other.mtx[k][j];
				}
			result[i][j] = sum;
			}
		}
	}
	return new Matrix(result); 
}

Matrix.diag = function(diagEl) {
		if (!Array.isArray(diagEl)) {
			throw new Error("Not an array");
		}

		var result = new Array(diagEl.length);
    for (var i = 0; i < diagEl.length; i++) {
        result[i] = new Array(diagEl.length);
        for (var j = 0; j < diagEl.length; j++) {
					result[i][j] = (i == j ? diagEl[i] : 0);
				}
		}
		return new Matrix(result);
}

Matrix.eyes = function(len) {
	var eyesEl = new Array(len);
	for (var i = 0; i < len; i++) {
		eyesEl[i] = 1;
	}
	return new Matrix.diag(eyesEl);
}

Matrix.fill = function(width, height, value) {
	var result = new Array(height);
	for (var i = 0; i < height; i++) {
		result[i] = new Array(width);
		for (var j = 0; j < width; j++) {
			result[i][j] = value;
		}
	}
	return new Matrix(result);
}

Matrix.prototype.replace = function(origin, alternative) {
	for (var i = 0; i < this.height; i++) {
		for (var j = 0; j < this.width; j++) {
			if (this.mtx[i][j] == origin) {
				this.mtx[i][j] = alternative;
			}
		}
	}
	return this;
}

Matrix.prototype.lr = function() {
	var n = this.width;
	var l = new Matrix.eyes(n);
	var r = this.copy();

	for (var i = 0; i < n-1; i++) {
		for (var k = i+1; k < n; k++) {
			if (r.mtx[i][i] == 0) {
				throw new Error("Cannot divide through zero at (" + i + ", " + i + ')!');
			}
			l.mtx[k][i] = r.mtx[k][i] / r.mtx[i][i];
			for (var j = i; j < n; j++) {
				r.mtx[k][j] = r.mtx[k][j] - l.mtx[k][i]*r.mtx[i][j];
			}
		}
	}
	return {
		l: l,
		r: r
	}
}

Matrix.prototype.det = function() {
	// FIXME: Division by zero isn't caught!
	try { this.lr(); } catch(e) { return 0;	}
	var r = lr.r;
	var det = 1;
	for (var i = 0; i < this.width; i++) {
		det *= r.mtx[i][i];
	}
	return det;
}
 
Matrix.prototype.forwardSubstitution = function(vector) {
	if (Array.isArray(vector) && this.width != vector.length) {
		throw new Error("incompatible sizes!");
	} else if (vector.height && this.width != vector.height) {
		throw new Error("incompatible sizes!");
	}
	var result = new Array(this.height);
	result[0] = vector.mtx[0]/this.mtx[0][0];

	for (var i = 1; i < vector.height; i++) {
			var sum = 0;
			for (var j = 0; j < i; j++) {
					sum += this.mtx[i][j] * result[j];
			}
			result[i] = (vector.mtx[i] - sum) / this.mtx[i][i];
	}
	return result;
}

Matrix.prototype.backwardSubstitution = function (vector) {
	if (this.width != vector.length) {
		throw new Error("incompatible sizes!");
	}

	var mh = this.height;
	var result = new Array(mh);
	result[mh-1] = vector[mh-1]/this.mtx[mh-1][mh-1];

	for (var i = mh-2; i >= 0; i--) {
		var sum = 0;
		for (var j = i+1; j < mh; j++) {
			sum += this.mtx[i][j] * result[j];
		}
		result[i] = (vector[i] - sum)/this.mtx[i][i];
	}
	return result;
}

Array.prototype.mult = function(other) {
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

Array.prototype.scalarProduct = function(other) {
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
	return Math.pow(this.scalarProduct(this), 1/2);
}

Array.prototype.normalise = function() {
	var result = new Array(this.length);
	var n      = this.norm();
	for (var i = 0; i < this.length; i++) {
		result[i] = this[i]/n;
	}
	return result;
}

Array.prototype.cosine = function(other) {
	if (!Array.isArray(other)) {
		throw new Error("Not an array!");
	}

	return (this.scalarProduct(other))/(this.norm() * other.norm());
}

function byLeftEnd(first, second) {
	var result = 0;
	if (parseInt(first.leftEnd) < parseInt(second.leftEnd)) { result = -1; }
	else if (parseInt(first.leftEnd) > parseInt(second.leftEnd)) { result = 1; }
	return result;
}

// Monkeypatch Math.min for accepting arrays
var standardMin = Math.min;
Math.min = function() {
	if(Array.isArray(arguments[0])) {
		return standardMin.apply(Math, arguments[0]);
	} else {
		return standardMin(arguments[0]);
	}
}

function parseTextAsXml(text) {
    var parser = new DOMParser(),
        xmlDom = parser.parseFromString(text, "text/xml");
    consumeXml(xmlDom);
}

function handleFileSelection() {
    var file = fileChooser.files[0],
        reader = new FileReader();

    waitForTextReadComplete(reader);
    reader.readAsText(file);
};

// kudos to https://stackoverflow.com/a/1830844
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};
// http://rosettacode.org/wiki/Matrix_multiplication#JavaScript
