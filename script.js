// Graphics Homework 1
// Authors: Or, Mark

class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
}

function drawPixel(context, point) {
    context.rect(point.x, point.y, 1, 1);
    context.stroke();
}

$(document).ready(function() {
    let pointArr = [];
    let canvas = $("canvas");
    let context = canvas[0].getContext('2d');
    let shapeSelected = $( 'input[name=shapeRadioBtn]:checked' ).val();

    $('input[name=shapeRadioBtn]').change(function(){
        shapeSelected = $( 'input[name=shapeRadioBtn]:checked' ).val();
        pointArr = [];
    });
        
    canvas.click(function(e){
        let elem = $(this);
        let xPos = e.pageX - elem.offset().left;
        let yPos = e.pageY - elem.offset().top;
        pointArr.push(new Point(xPos, yPos));
       
        switch(shapeSelected) {
            case "Line":
                if(pointArr.length === 2) {
                    console.log("drawing m line");
                    drawLine(context, pointArr[0].x, pointArr[0].y, pointArr[1].x, pointArr[1].y);
                    pointArr = [];
                }
                break;

            case "Circle":
                if(pointArr.length === 2) {
                    console.log("drawing m circle");
                    drawCircle(context, pointArr[0].x, pointArr[0].y, pointArr[1].x, pointArr[1].y);
                    pointArr = [];
                }
                break;
            
            case  "BezierCurve":
                if(pointArr.length === 4) {
                    console.log("drawing m bezier curve");
                    drawBezierCurve(context, pointArr[0].x, pointArr[0].y, pointArr[1].x, pointArr[1].y, 
                                    pointArr[2].x, pointArr[2].y, pointArr[3].x, pointArr[3].y, $('input[name=bezierLines]').val());
                    pointArr = [];
                }
                break;

            default:
        }
    });
});

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

function drawCircle(context, centerX, centerY, radiusX, radiusY) {
    let x = 0, y, p;
    radius = Math.pow((Math.pow(radiusX-centerX, 2)) + (Math.pow (radiusY-centerY, 2)), 0.5);
    y = radius;
    p = 3 - 2 * radius;
    
    while(y >= x) {
        plotCirclePoints(context, centerX, centerY, x, y)
        x++;
        if(p >= 0)
        {
            y--;
            p = p + 4 * (x - y) + 10;
        }
        else
            p = p + 4 * x + 6;
    }
}

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

function drawBezierCurve(context, p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y, lines) {
    const bezierMatrix = [[-1, 3, -3, 1], [3, -6, 3, 0], [-3, 3, 0, 0], [1, 0, 0, 0]];
    const pointVectorX = [p1x, p2x, p3x, p4x];
    const pointVectorY = [p1y, p2y, p3y, p4y];

    const cx = multiplyMatrixByVector(bezierMatrix, pointVectorX);
    const cy = multiplyMatrixByVector(bezierMatrix, pointVectorY);

    step = 1/lines;
    for(let t = 0; t+step <= 1; t+=step) {
        let startX = calculateCurvePoint(cx, 1-t);
        let startY = calculateCurvePoint(cy, 1-t);
        let endX = calculateCurvePoint(cx, 1-(t+step));
        let endY = calculateCurvePoint(cy, 1-(t+step));

        drawLine(context, startX, startY, endX, endY);
    }
}

function calculateCurvePoint(coeffs, x) {
    return Math.floor(Math.pow(x, 3) * coeffs[0] + Math.pow(x, 2) * coeffs[1] + x * coeffs[2] + coeffs[3])
}

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
  