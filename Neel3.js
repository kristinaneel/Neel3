//author: Kristina Neel
//date: September 13th, 2016
//description: This code takes a diamond and allows the user to change the 
//color, speed, roatation direction as well as start and stop the rotation.
//I believe that this is worth 15/15 because I used animation, used 3 buttons
//used a slider for speed, used 2 menues, used key controls
// d changes direction, f makes it faster, s makes it slower, and x makes it stop
//i also used a uniform variable in the fragment shader to change the color
"use strict";

var gl;

var theta = 0.0;
var thetaLoc;
var speed=0.0;
var greenLoc;
var green = 1.0;


var direction = true;
var timesPressed = 0;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

  

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

   

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    //colors that allow shading
    var colors = [
        vec3(0.9, 0.0, 0.0),
        vec3(0.9, 0.0, 0.0),
        vec3(0.9, 0.0, 0.0),

        vec3(1.0, 0.0, 0.0),
        vec3(0.8, 0.0, 0.0),
        vec3(0.6, 0.0, 0.0),

        vec3(0.9, 0.0, 0.0),
        vec3(0.9, 0.0, 0.0),
        vec3(0.9, 0.0, 0.0),

        vec3(0.8, 0.0, 0.0),
        vec3(0.8, 0.0, 0.0),
        vec3(0.8, 0.0, 0.0),

        vec3(0.8, 0.0, 0.0),
        vec3(0.8, 0.0, 0.0),
        vec3(0.8, 0.0, 0.0),

        vec3(0.8, 0.0, 0.0),
        vec3(0.8, 0.0, 0.0),
        vec3(0.8, 0.0, 0.0),

        vec3(1.0, 0.0, 0.0),
        vec3(0.9, 0.0, 0.0),
        vec3(0.8, 0.0, 0.0),

        vec3(1.0, 0.0, 0.0),
        vec3(0.9, 0.0, 0.0),
        vec3(0.8, 0.0, 0.0),
    ];

    //verticies of the diamond
    var vertices = [
        vec2(-.5,.3),
        vec2(0,-.5),        
        vec2(-.25,.3),

        vec2(0,-.5),
        vec2(-.25,.3),
        vec2(.25,.3),

        vec2(.25,.3),
        vec2(.5,.3),
        vec2(0,-.5),
        
        vec2(-.5,.3),
        vec2(-.35,.5),
        vec2(-.23,.3),

        vec2(.35,.5),
        vec2(.5,.3),
        vec2(.25,.3),

        vec2(0,.5),
        vec2(-.25,.3),
        vec2(.25,.3),

        vec2(0,.5),
        vec2(.35,.5),
        vec2(.25,.3),

        vec2(0,.5),
        vec2(-.35,.5),
        vec2(-.25,.3)


        
    ];

    

    // Load the data into the GPU

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);    

    thetaLoc = gl.getUniformLocation( program, "theta" );

    greenLoc = gl.getUniformLocation(program, "green");

    // Initialize event handler (button)
    //starts the diamond spinning
    document.getElementById("DirectionStart").onclick = function () {
      speed=0.1;
    };
    //stops the diamond spinning
    document.getElementById("DirectionStop").onclick = function () {
      speed=0.0;
    };
    //changes the direction of the spinning
    document.getElementById("DirectionChange").onclick = function () {
      direction =! direction;
    };

    //slider to change how fast it is spinning
    document.getElementById("slider").onchange = function(event) {
       speed = parseFloat(event.target.value);
    };
    //menu alternative to slider with speed options
    document.getElementById("Controls" ).onclick = function(event) {
        switch( event.target.index ) {
          case 0:
            speed = 0.1;
            break;
         case 1:
            speed = 0.3;
            break;
        case 2:
            speed = 0.8;
            break;

       }
    
    };
    //menu that allows the color to be chnaged
    document.getElementById("Color").onclick = function(event){
        switch( event.target.index){
            case 0:
                green = 1.0;
                break;
            case 1:
                green = 0.5;
                break;
            case 2:
                green= 0.0;
                break;
        }
    };
    //key strokes to change speed or direction
    window.onkeydown=function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch( key) {
          case 'D':
          case 'd':
            direction = !direction;
            break;
         case 'F':
         case 'f':
            speed += 0.1;
            break;
         case 'S':
         case 's':
            speed -=0.1;
            if(speed <=0.0){
                speed=0.0;
            }
            break;
         case 'X':
         case 'x':
            speed =0.0;
       }
    };


   

    render();
};

function render()
{
   gl.clear( gl.COLOR_BUFFER_BIT );

    if (direction == true)
    {
        theta += speed;
    }
    else 
    {
        theta -= speed;
    }
    gl.uniform1f(thetaLoc, theta);
    gl.uniform1f(greenLoc, green);

    gl.drawArrays(gl.TRIANGLES, 0, 24);
    window.requestAnimFrame(render);
}
