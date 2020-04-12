

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
                    //drawLine(context, pointArr[0].x, pointArr[0].y, pointArr[1].x, pointArr[1].y);
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

function drawCircle(context, centerX, centerY, diameterX, diameterY){
    let tempX2, tempY2;
    radius = Math.pow((Math.pow(diameterX-centerX, 2)) + (Math.pow (diameterY-centerY, 2)), 0.5);
    
     
        let point = new Point(centerX, centerY);
        
        drawPixel(context, centerX, centerY, tempX2, tempY2);
        if (centerX === tempX2 && centerY === tempY2) break;   
    
}
