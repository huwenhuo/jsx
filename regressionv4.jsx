// Adobe Illustrator Script to Collect Selected Points' Positions and Export to a File with R and p-values

// Function to calculate the linear regression line
function linearRegression(points) {
    var n = points.length;
    var sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

    // Sum the values
    for (var i = 0; i < n; i++) {
        var x = points[i].x;
        var y = points[i].y;
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
        sumY2 += y * y;
    }

    // Calculate slope (m) and intercept (b) for the regression line
    var m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    var b = (sumY - m * sumX) / n;

    // Calculate R value (correlation coefficient)
    var r = (n * sumXY - sumX * sumY) / Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    // Calculate standard error of the estimate (for p-value)
    var ssTotal = sumY2 - (sumY * sumY) / n;
    var ssResidual = sumY2 - m * sumXY - b * sumY;
    var standardError = Math.sqrt(ssResidual / (n - 2));

    // Calculate the t-statistic for the slope
    var tStatistic = m / (standardError / Math.sqrt(n * sumX2 - sumX * sumX));

    // Calculate p-value (based on t-statistic)
    var pValue = 1 - studentTDistribution(tStatistic, n - 2); // Approximate p-value using the t-distribution

    return { slope: m, intercept: b, r: r, p: pValue };
}

// Function to approximate the cumulative distribution function of the t-distribution
// For simplicity, we use an approximation here
function studentTDistribution(t, df) {
    var x = df / (df + t * t);
    return Math.exp(-0.5 * x * df);
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

    // Create a new RGB color (Black for example)
    var regLineColor = new RGBColor();
    regLineColor.red = 0;
    regLineColor.green = 0;
    regLineColor.blue = 0;

    // Draw a line between the two points
    var line = layer.pathItems.add();
    line.setEntirePath([[startX, startY], [endX, endY]]);
    line.stroked = true;
    line.strokeWidth = 1;
    line.strokeColor = regLineColor;
}

// Function to export the collected points to a text file
function exportPointsToFile(points) {
    // Ask the user for a file location to save
    var file = File.saveDialog("Save Points As", "*.txt");

    if (file) {
        file.open("w"); // Open file in write mode
        
        // Write header
        file.writeln("Point Number, X Coordinate, Y Coordinate");
        
        // Write each point
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            file.writeln((i + 1) + ", " + point.x + ", " + point.y);
        }
        
        file.close(); // Close the file
        alert("Points exported to " + file.fsName);
    } else {
        alert("Export canceled.");
    }
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

        // Export points to file
        exportPointsToFile(pointPositions);

        // Display R and p-values
        alert("Linear regression line plotted!\nR-value: " + regression.r + "\np-value: " + regression.p);
    } else {
        alert("No anchor points found in the selected items.");
    }
}

