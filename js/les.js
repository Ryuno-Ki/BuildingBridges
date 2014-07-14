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

	var mass      = 1; // FIXME: Read from list
	var gravity   = 8.91; // FIXME: Read from site
	var matrix    = new Matrix.fill(18,16,0);
	var lengths   = new Array(b.stab.length);
	var rightHand = new Matrix.fill(2,16,0);
	var stab      = b.stab;
	for (var s = 0; s < stab.length; s++) {
		var current = stab[s];
		matrix = insertIntoMatrix(s,current,matrix).copy();
	}
	
	for (var l = 0; l < b.stab.length; l++) {
		lengths[l] = 1/b.stab[l].getDistance();
	}
	
	for (var r = 0; r < rightHand.height; r++) {
		rightHand.mtx[r][1] = mass * gravity;
	}
	console.log(matrix.replace(0, '     ').toString());
	lengths = Matrix.diag(lengths);
	return {
		matrix: matrix,
		lengths: lengths,
		rightHand: rightHand
	};
};

function insertIntoMatrix(s,stab,matrix) {
	var result = matrix.copy();
	var left   = parseInt(stab.leftEnd);
	var right  = parseInt(stab.rightEnd);
	var leftG  = left > 1 ? b.gelenke[left-2] : undefined;
	var rightG = right > 1 ? b.gelenke[right-2] : undefined;
	if (leftG && rightG) {
		var sp = [leftG.getX() - rightG.getX(), 
			  leftG.getY() - rightG.getY()];
		sp = sp.normalise();
		result.mtx[2*(left-2)][s] = sp[0].toFixed(2);
		result.mtx[2*(left-2)+1][s] = sp[1].toFixed(2);
		sp = sp.mult(-1);
		result.mtx[2*(right-2)][s] = sp[0].toFixed(2);
		result.mtx[2*(right-2)+1][s] = sp[1].toFixed(2);
	}
	return result;
}

function solveLes() {
	var preface = buildLes();
	var matrix = preface.matrix;
	var lengths   = preface.lengths;
	var rightHand = preface.rightHand;
	var result = matrix.mult(lengths).mult(matrix.transpose());
	var part = result.lr();
	var r = part.r;
	var l = part.l;
	y = l.forwardSubstitution(rightHand);
	x = r.backwardSubstitution(y);
	//console.log(result.mult(x).toString());
	//paint in red and write to file
	console.log(result.replace(0, '    ').toString());
	console.log(result.mult(x).toString());
	console.log(rightHand.toString());
	return result;
};

function toArray(element) {
	return [element.getX(), element.getY()];
}
