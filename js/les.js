var m = new Matrix([ [1,2],
					 [3,3] ]);
var part = m.lr();
var r = part.r;
var l = part.l;
var a = [4,0];
var x = [1,0];
y = l.forwardSubstitution(x);
x = r.backwardSubstitution(y);
console.log(m.mult(x).toString());

function buildLes() {
	// E   … Equationmatrix, E € IR^(16x18)
	// f   … force, f € IR^18, f_k > 0 => Zugkraft, f_k < 0 => Druckkraft
	// p   … external powers, p € IR^16
	// x   … verschiebungsvektor
	// n   … Young'sches Elastizitätsmodul
	// d_k … deformation for k-th stab
	// l_k … length of k-th stab
	// L   … matrix (l_kk), k = 1…18
	// A   … Steifigkeitsmatrix
	// p = E*f
	// p = A*x with A = n*E*L^(-1)*E+
	// f_k = n*d_k/l_k

	// For every vector, multiply with -1 and determine cosine and sine
	// Append two rows two matrix with the computed values at the respective positions
	var matrix  = [];
	var row     = [];
	// TODO: Sort by leftEnd in b.stab
	// Walk through the sorted set and add two rows (x/y) to the matrix 
	// Then return the matrix
	console.log(b.stab);
	for (var g = 0; g < b.gelenke.length; g++) {
		var current = toArray(b.gelenke[g]);
		var spheric = current.spherical();
		row.push(spheric.x);
		row.push(spheric.y);
		matrix.push(row);
		var mat     = new Matrix(matrix);
		console.log(mat.mtx);
		console.log(mat instanceof Matrix);
		console.log(mat.lr());
	}
};

function solveLes() {
};

function toArray(element) {
	return [element.getX(), element.getY()];
}