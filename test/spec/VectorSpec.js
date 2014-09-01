describe("Vector", function() {
	var x;
	var y;
	var z;
	var s;
	var xs;
	describe("multiplication", function() {
		it("should multiply vector with vector", function() {
			x = [1,0,0];
			y = [1,0,0];
			z = 1;
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
//		beforeEach(function() {
//			spyOn(Array, "plus").and.throwError("Not compatible!");
//		});
		it("should add vector to vector", function() {
			x = [1,0,0];
			y = [1,0,0];
			z = [2,0,0];
			expect(x.plus(y)).toEqual(z);
		});
		it("should not add not-fitting vectors", function() {
			x = [1,0,0];
			y = [1,0];
			expect(function() { x.plus(y) }).toThrowError("Not compatible!");
		});

		it("should not add vector to scalar", function() {
			x = [1,0,0];
			s = 2;
			expect(function() { x.plus(s) }).toThrowError("Not compatible!");
		});
	}); 
});
