/*
var m = new Matrix([ [1,2],
					 [3,3] ]);
var part = m.lr();
var r = part.r;
var l = part.l;
var a = [4,0];
var x = [1,0];
y = l.forwardSubstitution(x);
x = r.backwardSubstitution(y);
//console.log(m.mult(x).toString());
*/

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
	// matrix € IR^(2*#Gelenke x #stab)
	var matrix       = new Matrix.fill(18,16,0);
	var sortedStaebe = b.stab;//.sort(byLeftEnd);
	for (var s = 0; s < sortedStaebe.length; s++) {
		var current = sortedStaebe[s];
		matrix = insertIntoMatrix(s,current,matrix).copy();
//		console.log(mat.lr());
	}
	console.log(matrix.replace(0, '    ').toString());
	return matrix;
};
//	var a = [gelenk.getX(),gelenk.getY()];
//	var s = a.spherical();
function insertIntoMatrix(s,stab,matrix) {
	var result = matrix.copy();
	var left   = parseInt(stab.leftEnd);
	var right  = parseInt(stab.rightEnd);
	var leftG  = left > 1 ? b.gelenke[left-2] : undefined;
	var rightG = right > 1 ? b.gelenke[right-2] : undefined;
	if (leftG) {
		var sp = [leftG.getX(), leftG.getY()];
		sp = sp.spherical();
		result.mtx[2*(left-2)][s] = sp.x.toFixed(2);
		result.mtx[2*(left-2)+1][s] = sp.y.toFixed(2);
	}
	if (rightG) {
		var sp = [rightG.getX(), rightG.getY()];
		sp = sp.spherical();
		result.mtx[2*(right-2)][s] = sp.x.toFixed(2);
		result.mtx[2*(right-2)+1][s] = sp.y.toFixed(2);
	}
	return result;
}

function solveLes() {
};

function toArray(element) {
	return [element.getX(), element.getY()];
}
