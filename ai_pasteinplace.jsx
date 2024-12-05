#target illustrator

// Function to get the current cursor position
function getCursorPosition() {
	var cursorX = app.activeDocument.artboards[app.activeDocument.artboards.getActiveArtboardIndex()].artboardRect[0];
	var cursorY = app.activeDocument.artboards[app.activeDocument.artboards.getActiveArtboardIndex()].artboardRect[1];
	return [cursorX, cursorY];
}

// Copy the selected object and paste it under the cursor
function pasteUnderCursor() {
	var doc = app.activeDocument;

	// Check if something is selected
	if (doc.selection.length > 0) {
		var selectedItem = doc.selection[0];  // Get the first selected object

		// Duplicate the selected item
		var duplicatedItem = selectedItem.duplicate();

		// Get the current cursor position (artboard origin point)
		var cursorPosition = getCursorPosition();

		// Move the duplicated object to the cursor position
		duplicatedItem.position = [cursorPosition[0], cursorPosition[1]];

		// Optional: You can change this line to adjust the placement of the object
		// For example, you can add an offset to the cursor position
		// duplicatedItem.position = [cursorPosition[0] + 10, cursorPosition[1] + 10];
	} else {
		alert("No object selected to duplicate.");
	}
}

// Call the function to paste the object under the cursor
pasteUnderCursor();

