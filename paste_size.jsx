if (app.documents.length > 0) {
    var doc = app.activeDocument;
    var selection = doc.selection;

    if (selection.length > 0) {
        try {
            // Get the object from the clipboard
            app.paste();
            var clipboardObject = doc.selection[0]; // The pasted object
            var sourceWidth = clipboardObject.width;
            var sourceHeight = clipboardObject.height;

            // Remove the pasted object from the document
            clipboardObject.remove();

            // Apply the size to each selected object
            for (var i = 0; i < selection.length; i++) {
                var target = selection[i];
                target.width = sourceWidth;
                target.height = sourceHeight;
            }

            alert("Size applied to all selected objects.");
        } catch (e) {
            alert("Error: Unable to paste from the clipboard. Make sure a valid object is copied.");
        }
    } else {
        alert("Please select at least one object to apply the size.");
    }
} else {
    alert("No document open. Please open a document and select objects.");
}

