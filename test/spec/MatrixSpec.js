describe("Matrix", function() {
	var A;
	var B;
	var C;
	var x;
	var y;
	var s;
	var As;
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

	describe("addition", function() {
		var A;
		var B;
		var C;
		var x;
		var y;
		var s;
		var As;
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
});
