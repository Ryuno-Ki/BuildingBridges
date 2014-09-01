function mainLes() {
    'use strict';
    var prepare = buildLes();
    var elasticity = document.getElementById('elasticity').value;
    var matrix = prepare.matrix.mult(prepare.lengths).mult(prepare.matrix.transpose()).mult(elasticity);
    var shift = solveLes(matrix, prepare.rightHand);
    // TODO: Idea: adopt b.lager, b.staebe[n].leftEnd and .rightEnd
    //             and just adjust the values in solution[x],
    //             solution[y] to the values, the gelenke would have.
    //             Then paint another bridge over the first one, in
    //             red. This may yield to just another change in the
    //             callback chain to pass b as argument
    
    for (var g = 0; g < b.gelenke.length; g++) {
        var current = b.gelenke[g];
        current.setX(current.getX() + shift[2*g]);
        current.setY(current.getY() + shift[2*g+1]);
    }
    produceXml(b);
    updateCanvas('#FF0000');
}

function buildLes() {
	'use strict';

	var gravity   = document.getElementById('gravity').value;
	var matrix    = new Matrix.fill(18,16,0);
	var lengths   = new Array(b.stab.length);
	var rightHand = new Array(16);
	var stab      = b.stab;
	
	for (var s = 0; s < stab.length; s++) {
		var current = stab[s];
		matrix = insertIntoMatrix(s,current,matrix).copy();
	}
	
	for (var l = 0; l < b.stab.length; l++) {
		lengths[l] = trunc(1/b.stab[l].getDistance());
	}
	
	for (var r = 0; r < rightHand.length; r++) {
		var ind = (r-1)/2;
		if (b.gelenke[ind]) {
			rightHand[r] = b.gelenke[ind].getMass() * gravity;
		} else {
			rightHand[r] = 0;
		}
	}
	lengths = Matrix.diag(lengths);
	console.log(matrix.replace(0, '     ').toString());
	return {
		matrix: matrix,
		lengths: lengths,
		rightHand: rightHand
	};
};

function insertIntoMatrix(s,stab,matrix) {
	'use strict';
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

function solveLes(A, b) {
	'use strict';
    // Solving A*x = b for x
	var part = A.lr();
	var R = part.r;
	var L = part.l;
	var y = L.forwardSubstitution(b);
	var x = R.backwardSubstitution(y);
	return x;
};