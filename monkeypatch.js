// Example call: 
// var m = new Matrix([ [1,1,1,1],
//                      [2,4,8,16],
//                      [3,9,27,81],
//                      [4,16,64,256],
//                      [5,25,125,625] ]);
function Matrix(ary) {
    this.mtx    = ary
    this.height = ary.length;
    this.width  = ary[0].length;
}
 
Matrix.prototype.toString = function() {
    var s = []
    for (var i = 0; i < this.mtx.length; i++) 
        s.push( this.mtx[i].join(",") );
    return s.join("\n");
}

Matrix.prototype.copy = function() {
		var c = [];
		for (var i = 0; i < this.width; i++) {
			c[i] = [];
			for (var j = 0; j < this.height; j++) {
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
    if (this.width != other.height) {
        throw "error: incompatible sizes";
    }
 
    var result = [];
    for (var i = 0; i < this.height; i++) {
        result[i] = [];
        for (var j = 0; j < other.width; j++) {
            var sum = 0;
            for (var k = 0; k < this.width; k++) {
                sum += this.mtx[i][k] * other.mtx[k][j];
            }
            result[i][j] = sum;
        }
    }
    return new Matrix(result); 
}

Matrix.diag = function(diagEl) {
		if (!Array.isArray(diagEl)) {
			throw "error: Not an array";
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

Matrix.prototype.lr = function() {
	var n = this.width;
	var l = new Matrix.eyes(n);
	var r = this.copy();

	for (var i = 0; i < n-1; i++) {
		for (var k = i+1; k < n; k++) {
			if (r.mtx[i][i] == 0) {
				throw "error: Cannot divide through zero at " + i + ", " + i;
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
	var r   = this.lr().r;
	var det = 1;
	for (var i = 0; i < this.width; i++) {
		det *= r.mtx[i][i];
	}
	return det;
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

// http://rosettacode.org/wiki/Matrix_multiplication#JavaScript
