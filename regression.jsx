// Adobe Illustrator Script to Collect Selected Points' Positions and Plot Regression Line

// Function to calculate the linear regression line
function linearRegression(points) {
    var n = points.length;
    var sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    // Sum the values
    for (var i = 0; i < n; i++) {
        var x = points[i].x;
        var y = points[i].y;
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
    }

    // Calculate slope (m) and intercept (b) for the regression line
    var m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    var b = (sumY - m * sumX) / n;

    return { slope: m, intercept: b };
}

// Function to draw the regression line in Illustrator
function drawRegressionLine(slope, intercept, doc) {
    // Create a new layer for the regression line
    var layer = doc.layers.add();
    layer.name = 'Linear Regression Line';

    // Create two points based on the regression line equation
    var startX = 0;
    var startY = slope * startX + intercept;
    var endX = 500;
    var endY = slope * endX + intercept;

    // Draw a line between the two points
    var line = layer.pathItems.add();
    line.setEntirePath([[startX, startY], [endX, endY]]);
    line.stroked = true;
    line.strokeWidth = 1;
    line.strokeColor = doc.swatches['[Registration]'].color;
}

// Check if there are any selected items
var selectedItems = app.activeDocument.selection;

if (selectedItems.length == 0) {
    alert("No items selected.");
} else {
    var pointPositions = [];

    // Iterate through selected items
    for (var i = 0; i < selectedItems.length; i++) {
        var selectedItem = selectedItems[i];

        // Check if the selected item is a path (or a compound path)
        if (selectedItem.typename == "PathItem" || selectedItem.typename == "CompoundPathItem") {

            // Iterate through the path's anchor points
            for (var j = 0; j < selectedItem.pathPoints.length; j++) {
                var point = selectedItem.pathPoints[j];

                // Collect the position of each anchor point
                var position = {
                    x: point.anchor[0],
                    y: point.anchor[1]
                };

                pointPositions.push(position);
            }
        }
    }

    // Check if any points were collected
    if (pointPositions.length > 0) {
        // Perform linear regression on the collected points
        var regression = linearRegression(pointPositions);

        // Draw the regression line
        drawRegressionLine(regression.slope, regression.intercept, app.activeDocument);

        alert("Linear regression line plotted!");
    } else {
        alert("No anchor points found in the selected items.");
    }
}

