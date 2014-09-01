describe("Vector", function() {
	var x;
	var y;
	var z;
	var s;
	var xs;
	describe("multiplication", function() {
		it("should multiply vector with vector", function() {
			x = [2,0,0];
			y = [1,0,0];
			z = 2;
			expect(x.mult(y)).toEqual(z);
		});
		it("should not multiply not-fitting vectors", function() {
			x = [1,0,0];
			y = [1,0];
			expect(function() { x.mult(y) }).toThrowError();
		});

		it("should multiply vector with scalar", function() {
			x = [1,0,0];
			s = 2;
			xs = [2,0,0];
			expect(x.mult(s)).toEqual(xs);
		});
	});

	describe("addition", function() {
		it("should add vector to vector", function() {
			x = [1,0,0];
			y = [2,0,0];
			z = [3,0,0];
			expect(x.add(y)).toEqual(z);
		});
		it("should not add not-fitting vectors", function() {
			x = [1,0,0];
			y = [1,0];
			expect(function() { x.add(y) }).toThrowError("Not compatible!");
		});

		it("should not add vector to scalar", function() {
			x = [1,0,0];
			s = 2;
			expect(function() { x.add(s) }).toThrowError("Not compatible!");
		});
	}); 

	describe("subtraction", function() {
		it("should subtract a vector from another vector", function() {
			x = [3,0,0];
			y = [2,0,0];
			spyOn(x,'add').and.callThrough();
			spyOn(y,'mult').and.callThrough();
			z = x.minus(y);

			expect(x.add).toHaveBeenCalled();
			expect(y.mult).toHaveBeenCalledWith(-1);
			expect(z).toEqual([1,0,0]);
		});

		it("should not subtract a vector from a non-fitting vector", function() {
			x = [1,0,0];
			y = [1,0];
			expect(function() { x.minus(y) }).toThrowError("Not compatible!");
		});

		it("should not subtract a scalar from a vector", function() {
			x = [1,0,0];
			s = 2;
			expect(function() { x.minus(s) }).toThrowError("Not compatible!");
		});
	});

	describe("scalar product", function() {
		it("should be called for vector multiplication", function() {
			x = [2,0,0];
			y = [1,0,0];
			spyOn(x, '_scalarProduct').and.callThrough();
			z = x.mult(y);

			expect(x._scalarProduct).toHaveBeenCalledWith(y);
			expect(z).toEqual(2);
		});

		it("should be called for vector norm", function() {
			x = [2,0,0];
			spyOn(x, '_scalarProduct').and.callThrough();
			z = x.norm();

			expect(x._scalarProduct).toHaveBeenCalledWith(x);
			expect(z).toEqual(2);
		});
	});

	describe("norm", function() {
		it("should return Euclidean norm", function() {
			x = [3,4,0];
			expect(x.norm()).toEqual(5);
		});
	});

	describe("normalise", function() {
		it("should return a normalised vector", function() {
			x = [3,4,0];
			expect(x.normalise()).toEqual([0.6,0.8,0]);
		});
	});
});
