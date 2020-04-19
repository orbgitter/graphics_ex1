// Graphics Homework 1
// Authors: Or, Mark

class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
}

function drawPixel(context, point) {
    context.beginPath();
    context.rect(point.x, point.y, 1, 1);
    context.stroke();
    context.closePath();
}

// When page is loaded, get the marked updated radio button value
$(document).ready(function() {
    var lastCanvasState, lastCurveArr;
    let pointArr = [];
    let canvas = $("canvas");
    let context = canvas[0].getContext('2d');
    let shapeSelected = $( 'input[name=shapeRadioBtn]:checked' ).val();
    context.strokeStyle = $( 'input[name=colorpicker]' ).val();

    // Choose type of line
    $('input[name=shapeRadioBtn]').change(function(){
        shapeSelected = $( 'input[name=shapeRadioBtn]:checked' ).val();
        pointArr = [];
    });

    // Choose color
    $('input[name=colorpicker]').change(function(){
        console.log($( 'input[name=colorpicker]' ).val())
        context.strokeStyle = $( 'input[name=colorpicker]' ).val();
    });

    // Change number of lines of last bezier curve
    $('input[name=bezierLines]').change(function(){
        if(lastCurveArr !== [])
        {
            context.putImageData(lastCanvasState, 0, 0);
            drawBezierCurve(context, lastCurveArr[0].x, lastCurveArr[0].y, lastCurveArr[1].x, lastCurveArr[1].y, 
                lastCurveArr[2].x, lastCurveArr[2].y, lastCurveArr[3].x, lastCurveArr[3].y, $('input[name=bezierLines]').val());
        }
    });
        
    /*  Each click on the pink canvas board is saved and pushed into an array as a point with its x,y coordinates,
        then switching according to the current radio value. There, each case checks if it got the relevant amount 
        of points for its task, as line and circles require 2 points, and the Bezier curve requires 4 points. 
    */
    canvas.click(function(e){
        let elem = $(this);
        let xPos = e.pageX - elem.offset().left;
        let yPos = e.pageY - elem.offset().top;
        pointArr.push(new Point(xPos, yPos));
        lastCurveArr = [];
       
        switch(shapeSelected) {
            case "Line":
                if(pointArr.length === 2) {
                    console.log("drawing line");
                    drawLine(context, pointArr[0].x, pointArr[0].y, pointArr[1].x, pointArr[1].y);
                    pointArr = [];
                }
                break;

            case "Circle":
                if(pointArr.length === 2) {
                    console.log("drawing circle");
                    drawCircle(context, pointArr[0].x, pointArr[0].y, pointArr[1].x, pointArr[1].y);
                    pointArr = [];
                }
                break;
            
            case  "BezierCurve":
                if(pointArr.length === 4) {
                    console.log("drawing bezier curve");
                    lastCanvasState = context.getImageData(0,0,canvas.width(),canvas.height());
                    drawBezierCurve(context, pointArr[0].x, pointArr[0].y, pointArr[1].x, pointArr[1].y, 
                                    pointArr[2].x, pointArr[2].y, pointArr[3].x, pointArr[3].y, $('input[name=bezierLines]').val());
                    lastCurveArr = pointArr;
                    pointArr = [];
                }
                break;

            default:
        }
    });
});

/*  drawLine function receives the following arguments: the context board to draw on, and two points by their x, y coordinates
    Then comparing between the 2 points' x values, and also between the 2 points' y values,
    in order to know how to advance the drawing of a pixel (represented by the start point) the right way,
    towards the end point, stopping down the "starting point" equals to the end point
*/
function drawLine(context, startX, startY, endX, endY) {
    let dx = Math.abs(endX - startX),
        sx = startX < endX ? 1 : -1;
    let dy = Math.abs(endY - startY),
        sy = startY < endY ? 1 : -1;
    let err = (dx > dy ? dx : -dy) / 2;
    while (true) {
        let point = new Point(startX, startY);
        drawPixel(context, point);
        if (startX === endX && startY === endY) break;
        let e2 = err;
        if (e2 > -dx) {
            err -= dy;
            startX += sx;
        }
        if (e2 < dy) {
            err += dx;
            startY += sy;
        }
    }
}

/*  drawCircle function receives the following arguments: the context board, the center point of the circle,
    and a point on the circle. from which the radius is calculated (distance between center and point).
    drawCircle implements the "Closed Corners Bresenheim circle" algorithm to draw a circle on the canvas.
*/
function drawCircle(context, centerX, centerY, pointX, pointY) {
    let x = 0, y, p;
    radius = Math.pow((Math.pow(pointX-centerX, 2)) + (Math.pow (pointY-centerY, 2)), 0.5);
    y = radius;
    p = 3 - 2 * radius;
    
    while(y >= x) {
        plotCirclePoints(context, centerX, centerY, x, y)
        if(p >= 0)
        {
            plotCirclePoints(context, centerX, centerY, x + 1, y)
            y--;
            p = p + 4 * (x - y) + 10;
        }
        else
            p = p + 4 * x + 6;
        x++;
    }
}

// plotCirclepoints is used to draw all 8 symmetric positions of a pixel within the circle
function plotCirclePoints(context, xc, yc, x, y) { 
    drawPixel(context, new Point(xc+x, yc+y)); 
    drawPixel(context, new Point(xc-x, yc+y)); 
    drawPixel(context, new Point(xc+x, yc-y)); 
    drawPixel(context, new Point(xc-x, yc-y)); 
    drawPixel(context, new Point(xc+y, yc+x)); 
    drawPixel(context, new Point(xc-y, yc+x)); 
    drawPixel(context, new Point(xc+y, yc-x)); 
    drawPixel(context, new Point(xc-y, yc-x)); 
}

/*
    drawBezierCurve receives the following arguments: the context board, four points that represent the BezierCurve
    p1 is the starting point, p2 is a control point for p1, p3 is a control point for p4, and p4 is an ending point,
    the lines parameter determines how many lines will be used to draw the curve.
    drawBezierCurve calculates the x and y coefficients by multiplying the bezier matrix by a vector of the 4 points.
    The coefficients are then used in the polinomial to determine the points used to the draw the curve.
*/
function drawBezierCurve(context, p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y, lines) {
    const bezierMatrix = [[-1, 3, -3, 1], [3, -6, 3, 0], [-3, 3, 0, 0], [1, 0, 0, 0]];
    const pointVectorX = [p1x, p2x, p3x, p4x];
    const pointVectorY = [p1y, p2y, p3y, p4y];

    const cx = multiplyMatrixByVector(bezierMatrix, pointVectorX);
    const cy = multiplyMatrixByVector(bezierMatrix, pointVectorY);

    step = 1/lines;
    for(let t = 0; Math.floor((t+step)*100)/100 <= 1; t+=step) {
        let startX = calculateCurvePoint(cx, 1-t);
        let startY = calculateCurvePoint(cy, 1-t);
        let endX = calculateCurvePoint(cx, 1-(t+step));
        let endY = calculateCurvePoint(cy, 1-(t+step));

        drawLine(context, startX, startY, endX, endY);
    }
}

// calculateCurvePoint returns the value (rounded down) of a 3rd degree polinomial with the given coefficients and x value
function calculateCurvePoint(coeffs, x) {
    return Math.floor(Math.pow(x, 3) * coeffs[0] + Math.pow(x, 2) * coeffs[1] + x * coeffs[2] + coeffs[3])
}

// multiplyMatrixByVector returns an array representing the vector that results from multiplying matrix m by vector v
function multiplyMatrixByVector(m, v) {
    result = new Array(m.length);
    for (let i = 0; i < m.length; i++) {
        result[i] = 0;
        for (let j = 0; j < v.length; j++) {
            result[i] += m[i][j] * v[j];
        }
    }
    return result;
}
  