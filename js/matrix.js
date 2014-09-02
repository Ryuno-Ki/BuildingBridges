/**
 * Example call: 
 * var m = new Matrix([ [1,1,1,1],
 *                      [2,4,8,16],
 *                      [3,9,27,81],
 *                      [4,16,64,256],
 *                      [5,25,125,625] ]);
 * @constructor
 * @summary Represents a Matrix object.
 * @this {Matrix}
 * @param {Array} ary        - An Array of arrays containing the values of the instance
 * @property {Array} mtx     - Holds the param's value
 * @property {Number} height - The number of rows
 * @property {Number} width  - The number of columns
 * @returns {this}
 */
function Matrix(ary) {
    'use strict';
    this.mtx    = ary;
    this.height = ary.length;
    this.width  = Array.isArray(ary[0]) ? ary[0].length : 1;
    return this;
}
 
/**
 * For console.log()
 * @todo Wrap single values inside an Array of length 1
 * @memberOf Matrix
 * @this Matrix
 * @method toString
 * @instance
 * @returns {String} String representation of instance
 */
Matrix.prototype.toString = function() {
    'use strict';
    var s = [];
    for (var i = 0; i < this.mtx.length; i++) {
                if (Array.isArray(this.mtx[i])) {
                    s.push( this.mtx[i].join(",") );
                } else {
                    //console.log([].push(this.mtx[i]));
                    s.push( this.mtx[i] );
                }
        }
    return s.join("\n");
};

/**
 * New instance with same value
 * @memberOf Matrix
 * @this Matrix
 * @method copy
 * @instance
 * @returns {Matrix} - A copy of this
 */
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
};
 
/**
 * Transposed entries of Matrix instance
 * @memberOf Matrix
 * @this Matrix
 * @method transpose
 * @instance
 * @returns {Matrix} - Matrix with transposed entries
 */
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
};

/**
 * Multiply a matrix with a number, an array or another matrix
 * @todo Sanitizing
 * @memberOf Matrix
 * @this Matrix
 * @method mult
 * @instance
 * @param {Number|Array|Matrix} other - The other factor
 * @throws "Incompatible Sizes!" - if the dimensions does not match
 * @return {Matrix|Array} result - The calculated result
 */
Matrix.prototype.mult = function(other) {
    'use strict';
    var result;
    var i, j, sum;
    if (isNumber(other)) { // Matrix * Number
        result = new Array(this.height);
        for (i = 0; i < this.height; i++) {
            result[i] = new Array(this.width);
            for (j = 0; j < this.width; j++) {
                result[i][j] = trunc(this.mtx[i][j] * other);
            }
        }
        return new Matrix(result);

    } else if (Array.isArray(other)) { // Matrix * Array
        if (this.width != other.length) {
            throw new Error("Incompatible Sizes!");
        }
        result = new Array(this.height);
        for (i = 0; i < this.height; i++) {
                sum = 0;
                for (j = 0; j < other.length; j++) {
                        sum += this.mtx[i][j] * other[j];
                }
                result[i] = trunc(sum);
        }
        return result;

    } else { // Matrix * Matrix
        // width = #cols, height = #rows
        if (this.width != other.height) {
            throw new Error("Incompatible Sizes!");
        }
        result = new Array(this.height);
        //console.log(this.height + 'x' + this.width,'*',
        //           other.height + 'x' + other.width);
        for (i = 0; i < this.height; i++) {
            result[i] = new Array(other.width);
            for (j = 0; j < other.width; j++) {
                sum = 0;
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
};

/**
 * Adds another Matrix to this instance
 * @memberOf Matrix
 * @instance
 * @method add
 * @this Matrix
 * @param {Matrix} other
 * @throws "Incompatible sizes!" - if the height and width does not match
 * returns {Matrix} result       - The sum of this and other
 */
Matrix.prototype.add = function(other) {
    'use strict';
    if (this.width != other.width || this.height != other.height) {
        throw new Error("Incompatible sizes!");
    }
    var result = new Array(this.height);
    for (var i = 0; i < this.height; i++) {
        result[i] = new Array(other.width);
        for (var j = 0; j < other.width; j++) {
        result[i][j] = trunc(this.mtx[i][j] + other.mtx[i][j]);
        }
    }
    return new Matrix(result); 
};


/**
 * Subtracts a matrix from another
 * @memberOf Matrix
 * @instance
 * @method minus
 * @this Matrix
 * @param {Matrix} other
 * @throws "Incompatible sizes!" - if the height and width does not match
 * returns {Matrix} result       - The difference of this and other
 */
Matrix.prototype.minus = function(other) {
    'use strict';
    if (this.width != other.width || this.height != other.height) {
        throw new Error("Incompatible sizes!");
    }
    return new Matrix(this.add(other.mult(-1)));
};

/**
 * Builds a diagonal matrix with given entries.
 * @memberOf Matrix
 * @method diag
 * @this Matrix
 * @param {Array} diagEl  - The diagonal elements
 * @throws "Not an array" - if diagEl isn't an array.
 * @returns {Matrix}      - A diagonal Matrix
 */
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
};

/**
 * Builds a diagonal matrix with '1' on main axis.
 * @memberOf Matrix
 * @method eyes
 * @this Matrix
 * @param {Array} len     - The diagonal elements
 * @returns {Matrix}      - A diagonal Matrix with '1' on the main axis
 */
Matrix.eyes = function(len) {
    'use strict';
    var eyesEl = new Array(len);
    for (var i = 0; i < len; i++) {
        eyesEl[i] = 1;
    }
    return new Matrix.diag(eyesEl);
};

/**
 * Builds a matrix of given dimensions with given entries
 * @memberOf Matrix
 * @method eyes
 * @this Matrix
 * @param {Number} width  - The width of the matrix.
 * @param {Number} height - The height of the matrix.
 * @param {Number} value  - The values of the matrix.
 * @returns {Matrix}      - A filled Matrix
 */
Matrix.fill = function(width, height, value) {
    'use strict';
    var result = new Array(width);
    for (var i = 0; i < width; i++) {
        result[i] = new Array(height);
        for (var j = 0; j < height; j++) {
            result[i][j] = value;
        }
    }
    return new Matrix(result);
};

/**
 * When aiming to prompt a Matrix to console.log() it is often helpfully to
 * replace sparse entries with space.
 * @memberOf Matrix
 * @method replace
 * @instance
 * @this Matrix
 * @param {Number} origin - The original value which is about to be replaced
 * @param {String|Number} alternative - The replacement, often a string
 * @returns {Matrix} result - A new Matrix with replaced values
 */
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
};

/**
 * LR-decomposition for Matrix
 * @memberOf Matrix
 * @method lr
 * @instance
 * @this Matrix
 * @throws "Cannot divide through zero!"
 * @returns {object} - Holding two matrices, l and r, as keys
 */
Matrix.prototype.lr = function() {
    'use strict';
    var n = this.width;
    var l = new Matrix.eyes(n);
    var r = this.copy();

    for (var i = 0; i < n-1; i++) {
        for (var k = i+1; k < n; k++) {
            if (r.mtx[i][i] === 0) {
                throw new Error("Cannot divide through zero!");
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
    };
};

/**
 * Calculates the determinant of a matrix through LR decomposition
 * @todo Catch division by zero
 * @memberOf Matrix
 * @method det
 * @instance
 * @this Matrix
 * @returns {Number} det - The calculated Number
 */
Matrix.prototype.det = function() {
    'use strict';
    //try { this.lr(); } catch(e) { return 0;    }
    lr = this.lr();
    var r = lr.r;
    var det = 1;
    for (var i = 0; i < this.width; i++) {
        det *= r.mtx[i][i];
    }
    return det;
};
 
/**
 * Pursues forward substitution in order to solve a linear equation system
 * @memberOf Matrix
 * @method forwardSubstitution
 * @instance
 * @this Matrix
 * @throws "Incompatible sizes!" - If vector length does not match Matrix width
 * @returns {Array} result       - The first half of a solution
 */
Matrix.prototype.forwardSubstitution = function(vector) {
    'use strict';
    if (Array.isArray(vector) && this.width != vector.length) {
        throw new Error("Incompatible sizes!");
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
};
 
/**
 * Pursues backward substitution in order to solve a linear equation system
 * @memberOf Matrix
 * @method backwardSubstitution
 * @instance
 * @this Matrix
 * @throws "Incompatible sizes!" - If vector length does not match Matrix width
 * @returns {Array} result       - The first half of a solution
 */
Matrix.prototype.backwardSubstitution = function (vector) {
    'use strict';
    if (this.width != vector.length) {
        throw new Error("Incompatible sizes!");
    }

    var mh = this.height;
    var result = new Array(mh);
    result[mh-1] = trunc(vector[mh-1]/this.mtx[mh-1][mh-1]);

    for (var i = mh-2; i >= 0; i--) {
        var sum = 0;
        for (var j = i+1; j < mh; j++) {
            sum += this.mtx[i][j] * result[j];
        }
        result[i] = trunc((vector[i] - sum)/trunc(this.mtx[i][i]));
    }
    return result;
};
