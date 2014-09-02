describe("Main thread", function() {
	it("should call the other functions", function() {
		var specRunner = document.getElementsByTagName('body')[0];
		var elasticity = document.createElement('input');
		elasticity.id = 'elasticity';
		elasticity.value = 9;
		specRunner.appendChild(elasticity);
		console.log(elasticity);
		mainLes();

		expect(buildLes).toHaveBeenCalled();
	});
});

describe("Linear Equation System", function() {
	it("should accept only fitting sizes", function() {
		pending();
	});

	it("should refuse not-fitting sizes", function() {
		pending();
	});

	it("should throw an error for singular matrices", function() {
		pending();
	});

	it("should compute a result within a certain tolerance", function() {
		pending();
	});
});
