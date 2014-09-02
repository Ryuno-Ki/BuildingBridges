describe("Main thread", function() {
	it("should call the other functions", function() {
		// Mock
		/*
		var specRunner = document.getElementsByTagName('body')[0];
		var elasticity = document.createElement('input');
		var gravity = document.createElement('input');

		elasticity.id = 'elasticity';
		elasticity.value = 20;
		specRunner.appendChild(elasticity);

		gravity.id = 'gravity';
		gravity.value = 9;
		specRunner.appendChild(gravity);
		*/
		loadFixtures('inputfields.html');
		mainLes();
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
