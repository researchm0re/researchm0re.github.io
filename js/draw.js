$ = jQuery;
// on load
$(window).load(function() {

    //initCanvasImageDraw();
    initCanvasImageDraw('#main #drawimgs');

});

function initCanvasImageDraw(canvasID) {
    if ( !$(canvasID).length > 0 ) return;
    if ( window.innerWidth <= 1024 ) return;

    var $canvas = $(canvasID);
    var context = $canvas[0].getContext("2d");
    var canvasWidth = $canvas.width(),
        canvasHeight = $canvas.height(),
        brushSizeDivisor = 1,
        drawing = false,
        startX = null,
        startY = null,
        lastX = null,
        lastY = null,
        gacount = 1;



    // set canvas size
    $canvas.attr('width', canvasWidth);
    $canvas.attr('height', canvasHeight);
    $(window).resize( function() {
    	canvasWidth = $canvas.width();
    	canvasHeight = $canvas.height();
        $canvas.attr('width', canvasWidth);
        $canvas.attr('height', canvasHeight);
        for (i = 0; i < dwiImages.length; i++) {
	        brush = new Image();
	        brush.src = dwiImages[i];
	        brushes[i] = brush;
	    }
    });

    // load brushes
    var brushes = [],
        brush = null,
        brushIndex = 0;
    for (i = 0; i < dwiImages.length; i++) {
        brush = new Image();
        brush.src = dwiImages[i];
        brushes[i] = brush;
    }
    brush = brushes[brushIndex];

    function switchBrush() {
        brushIndex++;
        if ( brushIndex >= dwiImages.length ) brushIndex = 0;
        brush = brushes[brushIndex];
    }

    function fadeCanvas() {
        context.save();
        context.globalAlpha = 0.01;
        context.globalCompositeOperation='destination-out';
        context.fillStyle= '#FFF';
        context.fillRect(0,0,canvasWidth, canvasHeight);
        context.restore();
    }

    var step = 0;
    function canvasDraw() {
        var x, y;
        var dx = lastX - startX,
            dy = lastY - startY;

        var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        var angle = Math.atan2(dx, dy);

        for (var i = 0; ( i <= distance || i === 0 ); i++)	{
            x = startX + (Math.sin(angle) * i) - (brush.width/brushSizeDivisor)/2;
            y = startY + (Math.cos(angle) * i) - (brush.height/brushSizeDivisor)/2;

            context.drawImage(brush,
                0,0,brush.width,brush.height,
                x,y, brush.width/brushSizeDivisor,brush.height/brushSizeDivisor
            );
        }
        startX = lastX, startY = lastY;
    }

    $canvas[0].onmousemove = function(e){
        var r = $canvas[0].getBoundingClientRect();
        lastX = e.clientX - r.left;
        lastY = e.clientY - r.top;
        if (brush.complete && drawing == true) {
            canvasDraw();
        }
    }
    $canvas[0].onmousedown = function(e) {
        drawing = true;
        var r = $canvas[0].getBoundingClientRect(),
            x = e.clientX - r.left,
            y = e.clientY - r.top;
        startX = x, startY = y;
        canvasDraw();
        $(canvasID).addClass('active');


    };
    $canvas[0].onmouseup = function() {
        drawing = false;
        switchBrush();
        $(canvasID).removeClass('active');
    };



}
