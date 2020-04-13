

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


$(document).ready(function(){
//    let choice =  $("input[name='shapeRadioBtn']:checked").val();
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
        //drawLine(context, point1.x, point1.y, point2.x, point2.y);   
         //drawCircle(context, point1.x, point1.y, point2.x, point2.y); 
       
        switch(shapeSelected) {
            case "Line":
                if(pointArr.length === 2) {
                    console.log("drawing a line");
                    drawLine(context, pointArr[0].x, pointArr[0].y, pointArr[1].x, pointArr[1].y);
                    pointArr = [];
                }
                break;

            case "Circle":
                if(pointArr.length === 2) {
                    console.log("drawing a circle");
                    drawCircle(context, pointArr[0].x, pointArr[0].y, pointArr[1].x, pointArr[1].y);
                    pointArr = [];
                }
                break;
            
            case  "BezierCurve":
                if(pointArr.length === 4) {
                    console.log("drawing a bezier curve");
                    drawBezierCurve(context, pointArr[0].x, pointArr[0].y, pointArr[1].x, pointArr[1].y, pointArr[2].x, pointArr[2].y, pointArr[3].x, pointArr[3].y);
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

function drawCircle(context, centerX, centerY, diameterX, diameterY) {
    let tempX2, tempY2;
    radius = Math.pow((Math.pow(diameterX-centerX, 2)) + (Math.pow (diameterY-centerY, 2)), 0.5);
    
     
        let point = new Point(centerX, centerY);
        
        drawPixel(context, centerX, centerY, tempX2, tempY2);
        //if (centerX === tempX2 && centerY === tempY2) break;   
    
}

function drawBezierCurve(context, p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y) {
    const bezierMatrix = [[-1, 3, -3, 1], [3, -6, 3, 0], [-3, 3, 0, 0], [1, 0, 0, 0]];
    const pointVectorX = [[p1x], [p2x], [p3x], [p4x]];
    const pointVectorY = [[p1y], [p2y], [p3y], [p4y]];

    const cx = multiplyMatrix(bezierMatrix, pointVectorX)
    const cy = multiplyMatrix(bezierMatrix, pointVectorY)

    for(let t = 0; t <= 1; t+=0.001) {
        let point = new Point(
            Math.pow(1 - t, 3) * cx[0][0] + Math.pow(1 - t, 2) * cx[1][0] + (1 - t) * cx[2][0] + cx[3][0],
            Math.pow(1 - t, 3) * cy[0][0] + Math.pow(1 - t, 2) * cy[1][0] + (1 - t) * cy[2][0] + cy[3][0]
        );

        drawPixel(context, point);
    }
}

function multiplyMatrix(a, b) {
    var aNumRows = a.length, aNumCols = a[0].length,
        bNumRows = b.length, bNumCols = b[0].length,
        m = new Array(aNumRows);
    for (var r = 0; r < aNumRows; r++) {
        m[r] = new Array(bNumCols);
        for (var c = 0; c < bNumCols; c++) {
            m[r][c] = 0;
            for (var i = 0; i < aNumCols; i++) {
                m[r][c] += a[r][i] * b[i][c];
            }
        }
    }
    return m;
}
  