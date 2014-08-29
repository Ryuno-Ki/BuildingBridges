// Example call: 
// var m = new Matrix([ [1,1,1,1],
//                      [2,4,8,16],
//                      [3,9,27,81],
//                      [4,16,64,256],
//                      [5,25,125,625] ]);
function Matrix(ary) {
	'use strict';
    this.mtx    = ary
    this.height = ary.length;
    this.width  = Array.isArray(ary[0]) ? ary[0].length : 1;
}
 
Matrix.prototype.toString = function() {
	'use strict';
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
	'use strict';
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
	'use strict';
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
	'use strict';
	// TODO: Sanitinzing
	if (isNumber(other)) { // Matrix * Number
		var result = new Array(this.height);
		for (var i = 0; i < this.height; i++) {
			result[i] = new Array(this.width);
			for (var j = 0; j < this.width; j++) {
				result[i][j] = trunc(this.mtx[i][j] * other);
			}
		}
		return new Matrix(result);
	} else if (Array.isArray(other)) { // Matrix * Array
		var result = new Array(this.height);
		for (var i = 0; i < this.height; i++) {
				var sum = 0;
				for (var j = 0; j < other.length; j++) {
						sum += this.mtx[i][j] * other[j];
				}
				result[i] = trunc(sum);
		}
		return result;
	} else { // Matrix * Matrix
		// width = #cols, height = #rows
		var result = new Array(this.height);
		console.log(this.height + 'x' + this.width,'*',
				   other.height + 'x' + other.width);
		for (var i = 0; i < this.height; i++) {
			result[i] = new Array(other.width);
			for (var j = 0; j < other.width; j++) {
				var sum = 0;
				//console.log('Multiplying ' + (i+1) + 'th row with ' +
				//(j+1) + 'th col');
				for (var k = 0; k < this.width; k++) {				
					/*
				console.log('this ',i+1,k+1,'->',this.mtx[i][k]);
				console.log('other',k+1,j+1,'->',other.mtx[k][j]);
				*/
					sum += this.mtx[i][k] * other.mtx[k][j];
				}
				//console.log('\n');
			result[i][j] = trunc(sum);
			}
		}
		return new Matrix(result); 
	}	
}

Matrix.prototype.minus = function(other) {
	'use strict';
	if (this.width != other.width || this.height != other.height) {
		throw new Error("Incompatible sizes!");
	}
	var result = new Array(this.height);
	for (var i = 0; i < this.height; i++) {
		result[i] = new Array(other.width);
		for (var j = 0; j < other.width; j++) {
		result[i][j] = trunc(this.mtx[i][j] - other.mtx[i][j]);
		}
	}
	return new Matrix(result); 
}

Matrix.diag = function(diagEl) {
	'use strict';
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
	'use strict';
	var eyesEl = new Array(len);
	for (var i = 0; i < len; i++) {
		eyesEl[i] = 1;
	}
	return new Matrix.diag(eyesEl);
}

Matrix.fill = function(width, height, value) {
	'use strict';
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
	'use strict';
	var result = this.copy();
	for (var i = 0; i < result.height; i++) {
		for (var j = 0; j < result.width; j++) {
			if (result.mtx[i][j] == origin) {
				result.mtx[i][j] = alternative;
			}
		}
	}
	return result;
}

Matrix.prototype.lr = function() {
	'use strict';
	var n = this.width;
	var l = new Matrix.eyes(n);
	var r = this.copy();

	// FIXME: Truncat das not work, that is, divident still near zero
	for (var i = 0; i < n-1; i++) {
		for (var k = i+1; k < n; k++) {
			if (r.mtx[i][i] == 0) {
				//console.log(r.replace(0,'     ').toString());
				throw new Error("Cannot divide through zero at (" + i + ", " + i + ')!');
			}
			l.mtx[k][i] = r.mtx[k][i] / r.mtx[i][i];
			for (var j = i; j < n; j++) {
				r.mtx[k][j] = r.mtx[k][j] - l.mtx[k][i]*r.mtx[i][j];
				//console.log('Rechts füllen: ',k,j);
			}
			//console.log('Links füllen: ',k,i);
			//console.log(l.mtx[k][i],trunc(l.mtx[k][i]),l.mtx[k][i]-trunc(l.mtx[k][i]));
		}
	}
	return {
		l: l,
		r: r
	}
}

Matrix.prototype.det = function() {
	'use strict';
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
	'use strict';
	if (Array.isArray(vector) && this.width != vector.length) {
		throw new Error("incompatible sizes!");
	}
	var result = new Array(this.height);
	result[0] = vector[0]/this.mtx[0][0];

	for (var i = 1; i < vector.length; i++) {
			var sum = 0;
			for (var j = 0; j < i; j++) {
					sum += this.mtx[i][j] * result[j];
			}
			result[i] = trunc((vector[i] - sum) / this.mtx[i][i]);
	}
	return result;
}

Matrix.prototype.backwardSubstitution = function (vector) {
	'use strict';
	if (this.width != vector.length) {
		throw new Error("incompatible sizes!");
	}

	var mh = this.height;
	var result = new Array(mh);
	result[mh-1] = trunc(vector[mh-1]/this.mtx[mh-1][mh-1]);
	console.log(this.replace(0,'                  ').toString());
	//console.log(mh,mh-1,result[mh-1],vector[mh-1],this.mtx[mh-1][mh-1]);

	for (var i = mh-2; i >= 0; i--) {
		//console.log(result);
		var sum = 0;
		for (var j = i+1; j < mh; j++) {
			sum += this.mtx[i][j] * result[j];
		}
		result[i] = trunc((vector[i] - sum)/trunc(this.mtx[i][i]));
		//console.log(result[i],'=',this.mtx[i][i],'->',vector[i],'-',sum,'/',
		//	    trunc(this.mtx[i][i]));
	}
	return result;
};
