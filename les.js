var m = new Matrix([ [1,2,3],
										 [1,1,1],
										 [3,3,1] ]);
var part = m.lr();
var r = part.r;
var l = part.l;
console.log(m.toString());
console.log(r.toString());
console.log(l.toString());

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
};

function solveLes() {
};
