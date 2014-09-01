// Monkeypatch Math.min for accepting arrays
var standardMin = Math.min;
Math.min = function() {
	'use strict';
	if(Array.isArray(arguments[0])) {
		return standardMin.apply(Math, arguments[0]);
	} else {
		return standardMin(arguments[0]);
	}
};

// credits: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
//					Global_Objects/Math/round#Example:_Decimal_rounding
function decimalAdjust(type, value, exp) {
	'use strict';
	// If the exp is undefined or zero...
	if (typeof exp === 'undefined' || +exp === 0) {
		return Math[type](value);
	}
	value = +value;
	exp = +exp;
	
	// If the value is not a number or the exp is not an integer...
	if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
		return NaN;
	}
	// Shift
	value = value.toString().split('e');
	value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
	// Shift back
	value = value.toString().split('e');
	return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

// Decimal round
if (!Math.round10) {
	Math.round10 = function(value, exp) {
		'use strict';
		return decimalAdjust('round', value, exp);
	};
}

// Decimal floor
if (!Math.floor10) {
	Math.floor10 = function(value, exp) {
		'use strict';
		return decimalAdjust('floor', value, exp);
	};
}

// Decimal ceil
if (!Math.ceil10) {
	Math.ceil10 = function(value, exp) {
		'use strict';
		return decimalAdjust('ceil', value, exp);
	};
}

function parseTextAsXml(text) {
	'use strict';
    	var parser = new DOMParser(),
        xmlDom = parser.parseFromString(text, "text/xml");
    	consumeXml(xmlDom);
}

function handleFileSelection() {
	'use strict';
    	var file = fileChooser.files[0],
        reader = new FileReader();

	waitForTextReadComplete(reader);
    	reader.readAsText(file);
}

// kudos to https://stackoverflow.com/a/1830844
function isNumber(n) {
	'use strict';
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function trunc(n) {
	'use strict';
	var p = 7;
	return Math.round10(n, -1*p);
}

// http://mspr0.de/?feed=rss2
// http://feeds.feedburner.com/Ctrlverlust
