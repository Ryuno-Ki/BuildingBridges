describe("Matrix", function() {
	var A, B, C; // Matrices
	var x, y, z; // Vectors
	var s, As, xs; // Scalars
	describe("string representation", function() {
		it("should put a String containing the values of matrix", function() {
			A = new Matrix.eyes(3);
			s = '1,0,0\n0,1,0\n0,0,1'
			
			expect(A.toString()).toEqual(s);
		});

		it("should replace zeros with ' '", function() {
			A = new Matrix.eyes(3);
			expect(A.replace(0,' ')).toEqual(new Matrix([ [1,' ',' '],[' ',1,' '],[' ',' ',1] ]));
		});
	});

	describe("copy", function() {
		it("should copy all values, but creates a new instance", function() {
			A = new Matrix([ [1,2,3],[4,5,6],[7,8,9] ]);
			B = A.copy();

			// TODO: Test for possible side effects!
			expect(B instanceof Matrix).toBeTrue;
			expect(A).toEqual(B);
		});
	});

	describe("transpose", function() {
		it("should transpose the entries", function() {
			A = new Matrix([ [1,2,3],[4,5,6],[7,8,9] ]);
			B = new Matrix([ [1,4,7],[2,5,8],[3,6,9] ]);
			expect(A.transpose()).toEqual(B);
		});
	});

	describe("LR-decomposition", function() {
		it("should compute the LR decomposition", function() {
			// A*x = b whereby A = L*R
			// 1.) forwardSubstitution with L and b yields y = R*x
			// 2.) backwardSubstitution with R and y yields x
			A = new Matrix([ [1,7,8],[2,15,25],[3,25,61] ]);
			L = new Matrix([ [1,0,0],[2,1,0],[3,4,1] ]);
			R = new Matrix([ [1,7,8],[0,1,9],[0,0,1] ]);
			expect(A.lr()).toEqual({l:L,r:R});
			expect(L.mult(R)).toEqual(A);
		});

		it("should compute a forward substitution", function() {
			L = new Matrix([ [1,0,0],[2,1,0],[3,4,1] ]);
			b = [0,0,1];
			expect(L.forwardSubstitution(b)).toEqual([0,0,1]);
		});

		it("should compute a backward substitution", function() {
			R = new Matrix([ [1,7,8],[0,1,9],[0,0,1] ]);
			y = [0,0,1];
			expect(R.backwardSubstitution(y)).toEqual([55,-9,1]);
		});

		it("should test the results", function() {
			A = new Matrix([ [1,7,8],[2,15,25],[3,25,61] ]);
			lr = A.lr();
			y = lr.l.forwardSubstitution([0,0,1]);
			x = lr.r.backwardSubstitution(y);

			expect(A.mult(x)).toEqual([0,0,1]);
		});	

		// TODO: Provoke the Errors
	});

	describe("multiplication", function() {
		it("should multiply matrix with matrix", function() {
			A = new Matrix.eyes(3);
			B = new Matrix.eyes(3);
			C = new Matrix.eyes(3);
			expect(A.mult(B)).toEqual(C);
		});
		it("should not multiply not-fitting matrices", function() {
			A = new Matrix.eyes(3);
			B = new Matrix.eyes(4);
			expect(function() { A.mult(B) }).toThrowError("Incompatible Sizes!");
		});

		it("should multiply matrix with vector", function() {
			A = new Matrix.eyes(3);
			x = [1, 2, 3];
			y = [1, 2, 3];
			expect(A.mult(x)).toEqual(y);
		});
		it("should not multiply matrix with not-fitting vector", function(){
			A = new Matrix.eyes(3);
			x = [1, 2];
			expect(function() { A.mult(x) }).toThrowError("Incompatible Sizes!");
		});

		it("should multiply matrix with scalar", function() {
			A = new Matrix.eyes(3);
			s = 2;
			As = new Matrix([ [2,0,0],
				          [0,2,0],
					  [0,0,2] ]);
			expect(A.mult(s)).toEqual(As);
		});
	});

	describe("determinant", function() {
		it("should calculate the determinant", function() {
			A = new Matrix([ [1,2,3],[0,4,5],[0,0,6] ]);
			expect(A.det()).toEqual(24);
		});

		it("should return zero for singular matrix", function() {
			A = new Matrix([ [0,2,3],[0,4,5],[0,0,6] ]);
			expect(A.det()).toEqual(0);
		});
	});

	describe("addition", function() {
		it("should add matrix to matrix", function() {
			A = new Matrix.eyes(3);
			B = new Matrix.eyes(3);
			C = new Matrix([ [2,0,0],
				         [0,2,0],
					 [0,0,2] ]);
			expect(A.add(B)).toEqual(C);
		});
		it("should not add matrix to not-fitting matrix", function() {
			A = new Matrix.eyes(3);
			B = new Matrix.eyes(2);
			expect(function() { A.add(B) }).toThrowError();
		});

		it("should not add matrix to vector", function() {
			A = new Matrix.eyes(3);
			x = [1,2,3];
			expect(function() { A.add(x) }).toThrowError();
		});
		it("should not add matrix to scalar", function() {
			A = new Matrix.eyes(3);
			s = 2;
			expect(function() { A.add(s) }).toThrowError();
		});
	}); 

	describe("subtraction", function() {
		it("should subtract a matrix from another", function() {
			A = new Matrix([ [1,2,3],[0,1,0],[0,0,1] ]);
			B = new Matrix([ [0,1,2],[0,0,0],[0,0,0] ]);
			spyOn(A, 'add').and.callThrough();
			spyOn(B, 'mult').and.callThrough();
			C = A.minus(B);

			expect(A.add).toHaveBeenCalled();
			expect(B.mult).toHaveBeenCalledWith(-1);
			expect(C.mtx).toEqual(new Matrix([ [1,1,1],[0,1,0],[0,0,1] ]));
		});

		it("should not subtract not-fitting matrices", function() {
			A = new Matrix.eyes(3);
			B = new Matrix.eyes(2);
			expect(function() { A.minus(B) }).toThrowError("Incompatible sizes!");
		});

		it("should not subtract a vector from a matrix", function() {
			A = new Matrix.eyes(3);
			B = [1,1,1];
			expect(function() { A.minus(B) }).toThrowError("Incompatible sizes!");
		});

		it("should not subtract a scalar from a matrix", function() {
			A = new Matrix.eyes(3);
			s = 2;
			expect(function() { A.minus(s) }).toThrowError("Incompatible sizes!");
		});
	});

	describe("class methods", function() {
		it("should provide a diagonal matrix", function() {
			A = new Matrix.diag([2,3,4]);
			expect(A).toEqual(new Matrix([ [2,0,0],[0,3,0],[0,0,4] ]));
		});

		it("should provide a diagonal matrix with '1' on main axis", function() {
			A = new Matrix.eyes(3);
			expect(A).toEqual(new Matrix([ [1,0,0],[0,1,0],[0,0,1] ]));
		});

		it("should provide a filled matrix", function() {
			A = new Matrix.fill(3,4,2);
			expect(A).toEqual(new Matrix([ [2,2,2,2],[2,2,2,2],[2,2,2,2] ]));
		});
	});
});
