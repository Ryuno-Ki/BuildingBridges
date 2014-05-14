// Monkeypatch Math.min for accepting arrays
var standardMin = Math.min;
Math.min = function() {
	if(Array.isArray(arguments[0])) {
		return standardMin.apply(Math, arguments[0]);
	} else {
		return standardMin(arguments[0]);
	}
}

function parseTextAsXml(text) {
    var parser = new DOMParser(),
        xmlDom = parser.parseFromString(text, "text/xml");
    consumeXml(xmlDom);
}

function handleFileSelection() {
    var file = fileChooser.files[0],
        reader = new FileReader();

    waitForTextReadComplete(reader);
    reader.readAsText(file);
};
