var canvas;
var gl;
var length = 0.5;
var time = 0.0;
var timer = new Timer();
var omega = 200;
var counter = 0.0;
var i = 0.0;

var UNIFORM_mvpMatrix;
var UNIFORM_ambientProduct;
var UNIFORM_diffuseProduct;
var UNIFORM_specularProduct;
var UNIFORM_lightPosition;
var UNIFORM_shininess;
var ATTRIBUTE_position;
var ATTRIBUTE_normal;
var UNIFORM_useTexture;

var positionBuffer; 
var normalBuffer;

var viewMatrix;
var projectionMatrix;
var orthoMatrix;
var mvpMatrix;

var lightAmbient = vec4(Math.random(), Math.random(), Math.random(), 1.0);
var materialAmbient = vec4(Math.random(), Math.random(), Math.random(), 1.0);
var ambientProduct = mult(lightAmbient, materialAmbient);

var lightDiffuse = vec4(0.6, 0.6, 0.6, 1.0);
var materialDiffuse = vec4(1.0, 0.0, 0.0, 1.0);
var diffuseProduct = mult(lightDiffuse, materialDiffuse);

var lightSpecular = vec4(0.4, 0.4, 0.4, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var specularProduct = mult(lightSpecular, materialSpecular);

var shininess = 50;
var lightPosition = vec3(0.0, 0.0, 0.0);

var eye = vec3(0, 1.0, 1.8);
var at = vec3(0, 0, 0);
var up = vec3(0, 1, 0);

var scale_enemies = vec3(0.2, 0.2, 0.2);
var scale_skybox = vec3(10, 10, 10);
var translate_gun = vec3(0.0, 0.0, 1.7);
var translate_enemies = [];
var translate_camera = [];
var direction_enemies = [];
var health_enemies = [];
var speed_enemies = vec3(0.05, 0.05, 0.05);
/*var translate_enemies = [vec3(0, 0, -5),
						 vec3(0.5, 0, -5),
						 vec3(-0.5, 0, -5),
						 vec3(0.8, 0, -5),
						 vec3(-0.8, 0, -5),
						 vec3(-1, 0, -5)
						];
var translate_camera = [vec3(0, 0, 0),
					    vec3(0, 0, 0),
					    vec3(0, 0, 0),
					    vec3(0, 0, 0),
					    vec3(0, 0, 0),
					    vec3(0, 0, 0)
					   ];
var direction_enemies = [vec3(0.0, 0.0, 0.5),
						 vec3(0.0, 0.0, 0.3),
						 vec3(-0.0, 0.0, 0.25),
						 vec3(0.0, 0.0, 0.4),
						 vec3(-0.0, 0.0, 0.35),
						 vec3(0.0, 0.0, 0.2)
						];*/
var enemy_damage = 5;
var enemy_value = 5;
var enemy_health = 2;
						
var translate_bullets = [];
var direction_bullets = [];
var speed_bullets = vec3(.5, .5, .5);
var scale_bullets = vec3(.05, .05, .05);
var num_bullets = 0;
var bullet_damage = 2;
var material_bullet = vec4(1.0, 1.0, 1.0, 1.0);
var light_bullet = vec4(1.0, 1.0, 1.0, 1.0);

var scale_gun = vec3(0.1, 0.1, .8); 
var material_gun = vec4(1.0, 1.0, 1.0, 1.0);
var light_gun = vec4(.0, .0, .0, .0);

var myTexture;
var startTexture;
var optionTexture;
var HUDTexture;
var rulesTexture;
var jokeTexture;
var canvasTexture;
var grenTexture;
var deadTexture;

var x_test = 1.0;
var y_test = 1.0;
var deg = 0.0;

var num_enemies = 0;
var prev_dir = 0;
var degree = 0;
var axis = vec3(0, 1, 0);
var rotation = 0;
var player_health = 100;
var player_score = 0;
var level = 1;

var selectColor = 1;
var gameMode = 0;

var healthAmount = 100;
var grenAmount = 0;

window.onload = function init()
{
	drawText();  
	drawText2();
	
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    vertices = [
        vec3(  length,   length, length ), //vertex 0
        vec3(  length,  -length, length ), //vertex 1
        vec3( -length,   length, length ), //vertex 2
        vec3( -length,  -length, length ),  //vertex 3 
        vec3(  length,   length, -length ), //vertex 4
        vec3(  length,  -length, -length ), //vertex 5
        vec3( -length,   length, -length ), //vertex 6
        vec3( -length,  -length, -length )  //vertex 7   
    ];

    var points = [];
    var normals = [];
	var uv = [];
    Cube(vertices, points, normals, uv);
	
	var va = vec4(0.0, 0.0, -1.0,1);
	var vb = vec4(0.0, 0.942809, 0.333333, 1);
	var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
	var vd = vec4(0.816497, -0.471405, 0.333333,1);

	tetrahedron(va, vb, vc, vd, points, normals, 4);
	
	// var path = './fadeaway/';
	// var sides = [path + 'fadeaway_right.jpg', path + 'fadeaway_left.jpg',
	// path + 'fadeaway_top.jpg',path + 'fadeaway_front.jpg',path + 'fadeaway_back.jpg'];
	//myTexture = sides;
	
	//SKYBOX
	myTexture = gl.createTexture();
    myTexture.image = new Image();
	
    // myTexture.image.onload = function(){
		// gl.bindTexture(gl.TEXTURE_CUBE_MAP, myTexture);
		// gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTexture.image);
		// gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTexture.image);

		// gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTexture.image);
		// gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTexture.image);

	    // gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTexture.image);
		// gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTexture.image);

		// gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		// gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		// gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		// gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		// glTexParameteri( gl.TEXTURE.CUBE.MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE );
		// gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
		// gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
	// }
	
	myTexture.image.onload = function(){
		gl.bindTexture(gl.TEXTURE_2D, myTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTexture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
   
   myTexture.image.src = "./Images/fadeaway_front.jpg";
	//myTexture.image.src = "./Images/chrome.jpg";
	
	//skybox_texture(myTexture);
	
	startTexture = gl.createTexture();
    startTexture.image = new Image();
    startTexture.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, startTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, startTexture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
    }
	
    startTexture.image.src = "./Images/start.jpg";

	optionTexture = gl.createTexture();
    optionTexture.image = new Image();
    optionTexture.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, optionTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, optionTexture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
    }

	optionTexture.image.src = "./Images/options.jpg";

	jokeTexture = gl.createTexture();
    jokeTexture.image = new Image();
    jokeTexture.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, jokeTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, jokeTexture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
    }

	jokeTexture.image.src = "./Images/totallyavailableoptions.jpg";

	HUDTexture = gl.createTexture();
    HUDTexture.image = new Image();
    HUDTexture.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, HUDTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, HUDTexture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
    }

	HUDTexture.image.src = "./Images/health.jpg";

	rulesTexture = gl.createTexture();
    rulesTexture.image = new Image();
    rulesTexture.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, rulesTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rulesTexture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
    }

	rulesTexture.image.src = "./Images/rules.jpg";

	deadTexture = gl.createTexture();
    deadTexture.image = new Image();
    deadTexture.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, deadTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, deadTexture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
    }

	deadTexture.image.src = "./Images/dead.jpg";

	canvasTexture = gl.createTexture();
	gl.pixelStorei(gl.UNPACK_FLIP_X_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, canvasTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('textureCanvas')); // This is the important line!
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);

	grenTexture = gl.createTexture();
	gl.pixelStorei(gl.UNPACK_FLIP_X_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, grenTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('textureCanvas2')); // This is the important line!
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
	
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    positionBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    normalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );
	
	uvBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(uv), gl.STATIC_DRAW );

    ATTRIBUTE_position = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( ATTRIBUTE_position );

    ATTRIBUTE_normal = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray( ATTRIBUTE_normal );
	
	ATTRIBUTE_uv = gl.getAttribLocation( program, "vUV" );
    gl.enableVertexAttribArray( ATTRIBUTE_uv);
	
    gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
    gl.vertexAttribPointer( ATTRIBUTE_position, 3, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
    gl.vertexAttribPointer( ATTRIBUTE_normal, 3, gl.FLOAT, false, 0, 0 );
	
	gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );
	
    UNIFORM_mvMatrix = gl.getUniformLocation(program, "mvMatrix");
    UNIFORM_pMatrix = gl.getUniformLocation(program, "pMatrix");
    UNIFORM_ambientProduct = gl.getUniformLocation(program, "ambientProduct");
    UNIFORM_diffuseProduct = gl.getUniformLocation(program, "diffuseProduct");
    UNIFORM_specularProduct = gl.getUniformLocation(program, "specularProduct");
    UNIFORM_lightPosition = gl.getUniformLocation(program, "lightPosition");
    UNIFORM_shininess = gl.getUniformLocation(program, "shininess");
	UNIFORM_sampler = gl.getUniformLocation(program, "uSampler");
	UNIFORM_useTexture = gl.getUniformLocation(program, "useTexture");

    viewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(90, 1, 0.001, 1000);
	orthoMatrix = ortho(-2, 2, -2, 2, -2, 2);

    timer.reset();
    gl.enable(gl.DEPTH_TEST);
	
	for(var i = 0; i < 5; i++) //spawn the initial 5 enemies
	{
		spawn_enemy();
	}
	
	canvas.onmousemove = function(e){ //mouse controls - ignore - under construction
		var x = e.clientX;
		var y = e.clientY;
		//degree = (x - canvas.width / 2)
		degree =2*(x - canvas.width/2)/canvas.width;
		for(var i = 0; i < num_enemies; i++)
		{
			//turn(translate_camera[i], translate_enemies[i], degree);
		}
		rotation += degree - prev_dir;
		prev_dir = degree;
		translate_gun[0] = degree;
    };
	
	canvas.onmousedown = function(e){ //shoot on click - can also be used as a debug tool
		//temp = vec3(0, 0, 0);
		//spawn_enemy();
		//alert(counter);
		shoot();
	};
	// document.onkeydown = function(e){
	// if(e.keyCode == 82){
						
		// shoot();
		// }						
	// }
					
    render();
}

function skybox_texture(myTexture)
{
	myTexture = gl.createTexture();
    myTexture.image = new Image();
	
    myTexture.image.onload = function(){
		gl.bindTexture(gl.TEXTURE_2D, myTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTexture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
    //myTexture.image.src = "./fadeaway/fadeaway_front.jpg";
	myTexture.image.src = "./Images/uclaBruin.jpg";
}

//ignore all the turn functions - under construction
//---------//
function turn(camera, translate, direction)
{
	var angle = Math.atan2(camera[2] + translate[2] , camera[0] + translate[0]); 
	var r = Math.sqrt(Math.pow(camera[0] + translate[0], 2) + Math.pow(camera[2] + translate[2], 2)); 
	angle -= Math.PI / 180 * (direction - prev_dir); //add 1 degree to the angle

	camera[0] = Math.cos(angle) * r - translate[0];
	camera[2] = Math.sin(angle) * r - translate[2];
}

function init_turn(camera, translate, direction)
{
	var angle = Math.atan2(camera[2] + translate[2] - 1.8 , camera[0] + translate[0]); 
	var r = Math.sqrt(Math.pow(camera[0] + translate[0], 2) + Math.pow(camera[2] + translate[2] - 1.8, 2)); 
	angle -= Math.PI / 180 * direction; //add 1 degree to the angle

	camera[0] = Math.cos(angle) * r - translate[0];
}

function turn2(translate, direction) 
{
	var angle = Math.atan2(translate[2] - 1.8 , translate[0]);
	var r = Math.sqrt(Math.pow(translate[0], 2) + Math.pow(translate[2] - 1.8, 2));
	angle += Math.PI / 180 * (direction - prev_dir); //add 1 degree to the angle

	translate[0] = Math.cos(angle) * r;
	translate[2] = Math.sin(angle) * r + 1.8;
}
//---------//

function shoot()//generate a bullet to be shot
{
	translate_bullets[num_bullets] = vec3(degree, 0, 1.8);//starting location
	direction_bullets[num_bullets] = vec3(0, 0, -.5);//bullet direction
	num_bullets++;
}
function kill_bullet(i)//remove bullet actor
{
	translate_bullets.splice(i, 1); //remove data from the arrays
	direction_bullets.splice(i, 1);
	num_bullets--;
}

function spawn_enemy()//spawn an enemy with random movement
{
	var curr = translate_enemies.length;
	translate_enemies[curr] = vec3(Math.random() * 3 - 1.5, 0, -5);//starting location with a random x position
	translate_camera[curr] = vec3(0,0,0);//ignore
	init_turn(translate_camera[curr], translate_enemies[curr], degree);//ignore
	direction_enemies[curr] = vec3(Math.random() / 2 + .2, 0, Math.random() / 4 + .1);//enemy direction with a random x and y direction
	if(Math.random() >= .5)//make the initial x direction 50/50
	{
		direction_enemies[curr][0] *= -1;
	}
	health_enemies[curr] = enemy_health; //set health to the predetermined value
	num_enemies++;
}
function kill_enemy(i)//remove enemy actor
{
	translate_enemies.splice(i, 1);//remove data from the arrays
	translate_camera.splice(i, 1);
	direction_enemies.splice(i, 1);
	health_enemies.splice(i, 1);
	num_enemies--;
}
function damage_enemy(i, damage)//damage enemy actor
{
	health_enemies[i] -= damage;//deduct the damage from the enemy's health
	if(health_enemies[i] <= 0)//if the enemy is dead
	{
		kill_enemy(i);//kill it
		player_score += enemy_value;//increment score based on the enemy's value
	}
}

function check_collision(bullet, enemy)
{
	var xd = translate_enemies[enemy][0] - translate_bullets[bullet][0];
	var zd = translate_enemies[enemy][2] - translate_bullets[bullet][2];
	var distance = Math.sqrt(xd * xd + zd * zd);//calculate distance between bullet and enemy
	if(distance <=  length * scale_enemies[0] * 2)//if within distance
	{
		kill_bullet(bullet);//remove bullet
		damage_enemy(enemy, bullet_damage);//damage enemy
		return true;
	}
}

function measureText(ctx, textToMeasure) {
	return ctx.measureText(textToMeasure).width;
}

function getPowerOfTwo(value, pow) {
      var pow = pow || 1;
      while(pow<value){
		      pow *= "2";
	      }
	      return pow;
}

function createMultilineText(ctx, textToWrite, maxWidth, text) {
    textToWrite = textToWrite.replace("\n"," ");
	var currentText = textToWrite;
	var futureText;
    var subWidth = 0;
    var maxLineWidth = 0;

        var wordArray = textToWrite.split(" ");
        var wordsInCurrent, wordArrayLength;
        wordsInCurrent = wordArrayLength = wordArray.length;

        while (measureText(ctx, currentText) > maxWidth && wordsInCurrent > 1) {
          wordsInCurrent--;
          var linebreak = false;

          currentText = futureText = "";
          for(var i = 0; i < wordArrayLength; i++) {
			      if (i < wordsInCurrent) {
				      currentText += wordArray[i];
				      if (i+1 < wordsInCurrent) { currentText += " "; }
			      }   
			      else {
				      futureText += wordArray[i];
				      if( i+1 < wordArrayLength) { futureText += " "; }
			      }
		      }
	      }
	      text.push(currentText);
	      maxLineWidth = measureText(ctx, currentText);
	
	      if(futureText) {
		      subWidth = createMultilineText(ctx, futureText, maxWidth, text);
		      if (subWidth > maxLineWidth) { 
			      maxLineWidth = subWidth;
		      }
	      }
	
	      return maxLineWidth;
}

function drawText() {
	      var canvasX, canvasY;
	      var textX, textY;

	      var text = [];
	      var textToWrite = "Health: " + healthAmount;
	
	      var maxWidth = 256;
	
	      var squareTexture = 1;
	
	      var textHeight = 256;
	      var textAlignment = "center";
	      var textColour = "white"
	      var fontFamily = "monospace";
	
	      var backgroundColour = "black";
	
	      var canvas = document.getElementById('textureCanvas');
	      var ctx = canvas.getContext('2d');
	
	      ctx.font = textHeight+"px "+fontFamily;
	      if (maxWidth && measureText(ctx, textToWrite) > maxWidth ) {
		      maxWidth = createMultilineText(ctx, textToWrite, maxWidth, text);
		      canvasX = getPowerOfTwo(maxWidth);
	      } else {
		      text.push(textToWrite);
		      canvasX = getPowerOfTwo(ctx.measureText(textToWrite).width);
	      }
	      canvasY = getPowerOfTwo(textHeight*(text.length+1)); 
	      if(squareTexture) {
		      (canvasX > canvasY) ? canvasY = canvasX : canvasX = canvasY;
	      }

	      canvas.width = canvasX;
	      canvas.height = canvasY;
	
	      switch(textAlignment) {
		      case "left":
			      textX = 0;
			      break;
		      case "center":
			      textX = canvasX/2;
			      break;
		      case "right":
			      textX = canvasX;
			      break;
	      }
	      textY = canvasY/2;
	
	      ctx.fillStyle = backgroundColour;
	      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	
	      ctx.fillStyle = textColour;
	      ctx.textAlign = textAlignment;
	
	      ctx.textBaseline = 'middle'; // top, middle, bottom
	      ctx.font = textHeight+"px "+fontFamily;
	
	      var offset = (canvasY - textHeight*(text.length+1)) * 0.5;
	
	      for(var i = 0; i < text.length; i++) {
		      if(text.length > 1) {
			      textY = (i+1)*textHeight + offset;
		      }
		      ctx.fillText(text[i], textX,  textY);
	      }
      }

function drawText2(){
		var canvasX, canvasY;
	      var textX, textY;

	      var text = [];
	      var textToWrite = "Grenades: " + grenAmount;
	
	      var maxWidth = 256;
	
	      var squareTexture = 1;
	
	      var textHeight = 256;
	      var textAlignment = "center";
	      var textColour = "white"
	      var fontFamily = "monospace";
	
	      var backgroundColour = "black";
	
	      var canvas = document.getElementById('textureCanvas2');
	      var ctx = canvas.getContext('2d');
	
	      ctx.font = textHeight+"px "+fontFamily;
	      if (maxWidth && measureText(ctx, textToWrite) > maxWidth ) {
		      maxWidth = createMultilineText(ctx, textToWrite, maxWidth, text);
		      canvasX = getPowerOfTwo(maxWidth);
	      } else {
		      text.push(textToWrite);
		      canvasX = getPowerOfTwo(ctx.measureText(textToWrite).width);
	      }
	      canvasY = getPowerOfTwo(textHeight*(text.length+1)); 
	      if(squareTexture) {
		      (canvasX > canvasY) ? canvasY = canvasX : canvasX = canvasY;
	      }

	      canvas.width = canvasX;
	      canvas.height = canvasY;
	
	      switch(textAlignment) {
		      case "left":
			      textX = 0;
			      break;
		      case "center":
			      textX = canvasX/2;
			      break;
		      case "right":
			      textX = canvasX;
			      break;
	      }
	      textY = canvasY/2;
	
	      ctx.fillStyle = backgroundColour;
	      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	
	      ctx.fillStyle = textColour;
	      ctx.textAlign = textAlignment;
	
	      ctx.textBaseline = 'middle'; // top, middle, bottom
	      ctx.font = textHeight+"px "+fontFamily;
	
	      var offset = (canvasY - textHeight*(text.length+1)) * 0.5;
	
	      for(var i = 0; i < text.length; i++) {
		      if(text.length > 1) {
			      textY = (i+1)*textHeight + offset;
		      }
		      ctx.fillText(text[i], textX,  textY);
	      }
}

window.addEventListener('keydown', function(event){
	if(event.keyCode == 73){		//i, move in
		myTexture.image.src = "./Images/test2.jpg";
		window.requestAnimFrame( render );
	}
	if (event.keyCode == 38){		//up arrow
		if (selectColor == 3){
			selectColor = 2;
		}
		else if (selectColor == 2){
			selectColor = 1;
		}
	}
	if (event.keyCode == 40){		//down arrow
		if (selectColor == 1){
			selectColor = 2;
		}
		else if (selectColor == 2){
			selectColor = 3;
		}
	}
	if (event.keyCode == 13){		//enter
		gameMode = selectColor;
	}
	if (event.keyCode == 8){		//backspace
		if (gameMode != 0 && gameMode != 1){
			gameMode = 0;			//if we are on the options or rules page, backspace will return us to main menu
		}
	}
	if (event.keyCode == 72){		//'h' for testing
		healthAmount -= 5;
		if (healthAmount == 0){
			gameMode = 4;
		}
		grenAmount += 1;
		drawText();
		drawText2();
		canvasTexture = gl.createTexture();
		gl.pixelStorei(gl.UNPACK_FLIP_X_WEBGL, true);
		gl.bindTexture(gl.TEXTURE_2D, canvasTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('textureCanvas')); // This is the important line!
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
		grenTexture = gl.createTexture();
		gl.pixelStorei(gl.UNPACK_FLIP_X_WEBGL, true);
		gl.bindTexture(gl.TEXTURE_2D, grenTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('textureCanvas2')); // This is the important line!
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
});

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//if (gameMode == 0){
	var delta = timer.getElapsedTime() / 1000;
	time += delta;
	counter += delta;
	
	useTexture = 1.0;
	
	//MENUS
	
		// var mvMatrix = viewMatrix;
		// mvMatrix = mult(translate(0, 1.0, 0), mvMatrix);

		// //mvMatrix = mult(viewMatrix, rotate(time * omega, [0, 1, 0]));

		// if (selectColor == 1){
			// startTexture.image.src = "./Images/startSelected.jpg";
		// }
		// else{
			// startTexture.image.src = "./Images/start.jpg";
		// }

		// gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
		// gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(orthoMatrix));

		// gl.activeTexture(gl.TEXTURE0);
		// gl.bindTexture(gl.TEXTURE_2D, startTexture);

		// gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		// gl.uniform1f(UNIFORM_shininess,  shininess);
		// gl.uniform1i(UNIFORM_sampler, 0);
		// gl.uniform1f(UNIFORM_useTexture,  useTexture);

		// gl.drawArrays( gl.TRIANGLES, 0, 36);

		// mvMatrix = viewMatrix;
		// mvMatrix = mult(translate(0, 0, 0), mvMatrix);

		// if (selectColor == 2){
			// optionTexture.image.src = "./Images/optionsSelected.jpg";
		// }
		// else{
			// optionTexture.image.src = "./Images/options.jpg";
		// }

		// gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
		// gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(orthoMatrix));

		// gl.activeTexture(gl.TEXTURE0);
		// gl.bindTexture(gl.TEXTURE_2D, optionTexture);

		// gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		// gl.uniform1f(UNIFORM_shininess,  shininess);
		// gl.uniform1i(UNIFORM_sampler, 0);
		// gl.uniform1f(UNIFORM_useTexture,  useTexture);

		// gl.drawArrays( gl.TRIANGLES, 0, 36);

		// mvMatrix = viewMatrix;
		// mvMatrix = mult(translate(0, -1, 0), mvMatrix);

		// if (selectColor == 3){
			// rulesTexture.image.src = "./Images/rulesSelected.jpg";
		// }
		// else{
			// rulesTexture.image.src = "./Images/rules.jpg";
		// }

		// gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
		// gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(orthoMatrix));

		// gl.activeTexture(gl.TEXTURE0);
		// gl.bindTexture(gl.TEXTURE_2D, rulesTexture);

		// gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		// gl.uniform1f(UNIFORM_shininess,  shininess);
		// gl.uniform1i(UNIFORM_sampler, 0);
		// gl.uniform1f(UNIFORM_useTexture,  useTexture);

		// gl.drawArrays( gl.TRIANGLES, 0, 36);
	// }
	// else if (gameMode == 1){		//start
		// mvMatrix = viewMatrix;
		// mvMatrix = mult(mvMatrix, scale(-1, 1, 1));
		// mvMatrix = mult(translate(-1.5, -1.5, 0), mvMatrix);

		// gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
		// gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(orthoMatrix));

		// gl.activeTexture(gl.TEXTURE0);
		// gl.bindTexture(gl.TEXTURE_2D, canvasTexture);

		// gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		// gl.uniform1f(UNIFORM_shininess,  shininess);
		// gl.uniform1i(UNIFORM_sampler, 0);
		// gl.uniform1f(UNIFORM_useTexture,  useTexture);

		// gl.drawArrays( gl.TRIANGLES, 0, 36);

		// mvMatrix = viewMatrix;
		// mvMatrix = mult(mvMatrix, scale(-1, 1, 1));
		// mvMatrix = mult(translate(-0.5, -1.5, 0), mvMatrix);

		// gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
		// gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(orthoMatrix));

		// gl.activeTexture(gl.TEXTURE0);
		// gl.bindTexture(gl.TEXTURE_2D, grenTexture);

		// gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		// gl.uniform1f(UNIFORM_shininess,  shininess);
		// gl.uniform1i(UNIFORM_sampler, 0);
		// gl.uniform1f(UNIFORM_useTexture,  useTexture);

		// gl.drawArrays( gl.TRIANGLES, 0, 36);

	// }
	// else if (gameMode == 2){		//options
		// mvMatrix = viewMatrix;
		// mvMatrix = mult(mvMatrix, scale(3.5, 3.5, 1));

		// gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
		// gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(orthoMatrix));

		// gl.activeTexture(gl.TEXTURE0);
		// gl.bindTexture(gl.TEXTURE_2D, jokeTexture);

		// gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		// gl.uniform1f(UNIFORM_shininess,  shininess);
		// gl.uniform1i(UNIFORM_sampler, 0);
		// gl.uniform1f(UNIFORM_useTexture,  useTexture);

		// gl.drawArrays( gl.TRIANGLES, 0, 36);
	// }
	// else if (gameMode == 3){		//rules
	// }
	// else if (gameMode == 4){		//ded
		// mvMatrix = viewMatrix;

		// gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
		// gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(orthoMatrix));

		// gl.activeTexture(gl.TEXTURE0);
		// gl.bindTexture(gl.TEXTURE_2D, deadTexture);

		// gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		// gl.uniform1f(UNIFORM_shininess,  shininess);
		// gl.uniform1i(UNIFORM_sampler, 0);
		// gl.uniform1f(UNIFORM_useTexture,  useTexture);

		// gl.drawArrays( gl.TRIANGLES, 0, 36);
	// }
	
	var ctm = mat4();
		
		ctm = mult(ctm, viewMatrix);
		// ctm = mult(ctm, translate(translate_camera[i]));
		// ctm = mult(ctm, translate(translate_enemies[i]));
		ctm = mult(ctm, scale(scale_skybox));
		
		//ctm = mult(ctm, rotate(time*omega, [2, 3, 1]));

		gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(ctm));
		gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));
		
		gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, myTexture);
	
		gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
		gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
		gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
		gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		gl.uniform1f(UNIFORM_shininess,  shininess);
		gl.uniform1i(UNIFORM_sampler, 0);
		gl.uniform1f(UNIFORM_useTexture,  useTexture);

		gl.drawArrays( gl.TRIANGLES, 0, 36);
		
		// gl.activeTexture(gl.TEXTURE0);
        // gl.bindTexture(gl.TEXTURE_2D, myTexture[1]);
	
		// gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
		// gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
		// gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
		// gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		// gl.uniform1f(UNIFORM_shininess,  shininess);
		// gl.uniform1f(UNIFORM_useTexture,  useTexture);

		// gl.drawArrays( gl.TRIANGLES, 0, 36);
	
	useTexture = 0.0;
	ambientProduct = mult(lightAmbient, materialAmbient);
	//var ctm = mat4()
	for(var i = 0; i < num_enemies; i++)//loop through all the enemies and do the proper transformations and frame checks
	{
		//x-axis canvas boundaries
		if(translate_enemies[i][0] >= 2 || translate_enemies[i][0] <= -2 ){
        direction_enemies[i][0] = -(direction_enemies[i][0] + 0.01);//have enemy bounce when they hit x boundaries
		//direction_enemies[i][2] += 0.05;
		}
		
		//y-axis canvas boundaries(if the enemies move in the y-axis
/*		if(translate_enemies[i][1] + length * scale_enemies[1] >= 2 || translate_enemies[i][1] - length * scale_enemies[1] <= -0.5){
        direction_enemies[i][1] = -direction_enemies[i][1];
		//direction_enemies[i][2] = 0.5;
		}*/
		
		translate_enemies[i] = add(translate_enemies[i], vec3(speed_enemies[0]*direction_enemies[i][0], speed_enemies[1]*direction_enemies[i][1], speed_enemies[2]*direction_enemies[i][2]));
		
		ctm = mat4();
		
		ctm = mult(ctm, viewMatrix);
		ctm = mult(ctm, translate(translate_camera[i]));
		ctm = mult(ctm, translate(translate_enemies[i]));
		ctm = mult(ctm, scale(scale_enemies));
		
		ctm = mult(ctm, rotate(time*omega, [2, 3, 1]));

		gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(ctm));
		gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));
		
		gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, myTexture);
	
		gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
		gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
		gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
		gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		gl.uniform1f(UNIFORM_shininess,  shininess);
		//gl.uniform1i(UNIFORM_sampler, 0);
		gl.uniform1f(UNIFORM_useTexture,  useTexture);

		gl.drawArrays( gl.TRIANGLES, 0, 36);
		
		//z-axis canvas boundaries
		if(translate_enemies[i][2] + length * scale_enemies[2] >= 1.8 || translate_enemies[i][2] - length * scale_enemies[2] <= -10){
      		kill_enemy(i);//remove enemy when they hit the player
			player_health -= enemy_damage;//have the player take damage based on enemy damage
			i--;//reloop
		}
	}
	//useTexture = 0.0;
	ambientProduct = mult(light_bullet, material_bullet);
	for(var i = 0; i < num_bullets; i++)//loop through all the bullets and do the proper transformations and frame checks
	{
		translate_bullets[i] = add(translate_bullets[i], vec3(speed_bullets[0]*direction_bullets[i][0], speed_bullets[1]*direction_bullets[i][1], speed_bullets[2]*direction_bullets[i][2]));
		ctm = mat4();
		
		ctm = mult(ctm, viewMatrix);
		ctm = mult(ctm, translate(translate_bullets[i]));
		ctm = mult(ctm, scale(scale_bullets));
		ctm = mult(ctm, rotate(time*omega, [2, 3, 1]));

		gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(ctm));
		gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));
		
		gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
		gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
		gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
		gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		gl.uniform1f(UNIFORM_shininess,  shininess);
		gl.uniform1f(UNIFORM_useTexture,  useTexture);

		gl.drawArrays( gl.TRIANGLES, 0, 36);
		if(translate_bullets[i][2] <= -8)//if bullet reaches edge of map
		{
			kill_bullet(i);//remove it
			i--;//reloop
		}
		else
		{
			for(var j = 0; j < num_enemies; j++)
			{
				if(check_collision(i, j))//otherwise check the bullet with every enemy for a collision
				{
					i--;
					break;//if we get a successful collision then stop checking enemies because the bullet is dead and reloop
					
				}
			}
		}
	}
/*	ctm = mat4();
		ctm = mult(ctm, viewMatrix);
		ctm = mult(ctm, translate(vec3(0, 0, 0)));
		ctm = mult(ctm, translate(temp));
		ctm = mult(ctm, scale(scale_enemies));
		ctm = mult(ctm, rotate(time*omega, [2, 3, 1]));

		gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(ctm));
		gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));

		gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
		gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
		gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
		gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
		gl.uniform1f(UNIFORM_shininess,  shininess);

		gl.drawArrays( gl.TRIANGLES, 36, 3072);	
	*/
	var hours = Math.floor(time.toFixed(1)/3600);
	var minutes = Math.floor((time.toFixed(1)/60) % 60);
	var seconds = Math.floor(time.toFixed(1) % 60);
	
	//generate enemies
	if(counter >= 1)
	{
		spawn_enemy();
		counter = 0;
	}
	//calculate all the values that scale with the level
	//ALL VALUES ARE SUBJECT TO CHANGE AND ARE CURRENTLY FOR TESTING PURPOSES
	enemy_damage = 4 + level;
	enemy_value = 4 + level;
	enemy_health = 1 + level;
	
	if(time >= 15.0 * level)
	{
		level++;
		lightAmbient = vec4(Math.random(), Math.random(), Math.random(), 1.0);
      	materialAmbient = vec4(Math.random(), Math.random(), Math.random(), 1.0);
	}
	
	//GUN
	
	// var rotategun = rotate(40*time, vec3(0, 1, 0));
	// var makeTranslation = translate(vec3(0.5, 0, 0.5));
	// var moveToRotationPoint  = rotate(deg, vec3(x_test, y_test, 0));
	//lightAmbient = vec4(0.0, 0.7, 0.0, 1.0);
	//materialAmbient = vec4(0.0, 1.0, 0.0, 1.0);
	ambientProduct = mult(light_gun, material_gun);
		
	ctm = mat4();
    ctm = mult(ctm, viewMatrix);
	ctm = mult(ctm, translate(translate_gun));
    ctm = mult(ctm, scale(scale_gun));
    ctm = mult(ctm, rotate(deg, [1, 0, 0]));
	
    gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(ctm));
	gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix) );
   
    gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
    gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
    gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
    gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
    gl.uniform1f(UNIFORM_shininess,  shininess);
	gl.uniform1f(UNIFORM_useTexture,  useTexture);
	
    gl.drawArrays( gl.TRIANGLES, 0, 36);
	
	document.getElementById('time').innerHTML = hours + ":" + minutes + ":" + seconds;
    document.getElementById('player_score').innerHTML = player_score;
	document.getElementById('player_health').innerHTML = player_health;
	document.getElementById('level').innerHTML = level;

	
    window.requestAnimFrame( render );
}

function Cube(vertices, points, normals, uv){
    Quad(vertices, points, normals, 0, 1, 2, 3, vec3(0, 0, 1), uv);
    Quad(vertices, points, normals, 4, 0, 6, 2, vec3(0, 1, 0), uv);
    Quad(vertices, points, normals, 4, 5, 0, 1, vec3(1, 0, 0), uv);
    Quad(vertices, points, normals, 2, 3, 6, 7, vec3(1, 0, 1), uv);
    Quad(vertices, points, normals, 6, 7, 4, 5, vec3(0, 1, 1), uv);
    Quad(vertices, points, normals, 1, 5, 3, 7, vec3(1, 1, 0 ), uv);
}

function Quad( vertices, points, normals, v1, v2, v3, v4, normal, uv){

    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
	
	uv.push(vec2(0,0));
    uv.push(vec2(1,0));
    uv.push(vec2(1,1));
    uv.push(vec2(0,0));
    uv.push(vec2(1,1));
    uv.push(vec2(0,1));
	
    points.push(vertices[v1]);
    points.push(vertices[v3]);
    points.push(vertices[v4]);
    points.push(vertices[v1]);
    points.push(vertices[v4]);
    points.push(vertices[v2]);
}

function tetrahedron(a, b, c, d, points, normals, n)
{
	divideTriangle(a, b, c, points, normals, n);
	divideTriangle(d, c, b, points, normals, n);
	divideTriangle(a, d, b, points, normals, n);
	divideTriangle(a, c, d, points, normals, n);
}

function divideTriangle(a, b, c, points, normals, count)
{
	if(count > 0)
	{
		var ab = mix(a, b, 0.5);
		var ac = mix(a, c, 0.5);
		var bc = mix(b, c, 0.5);
		ab = normalize (ab, true);
		ac = normalize (ac, true);
		bc = normalize (bc, true);
		divideTriangle(a, ab, ac, points, normals, count - 1);
		divideTriangle(ab, b, bc, points, normals, count - 1);
		divideTriangle(bc, c, ac, points, normals, count - 1);
		divideTriangle(ab, bc, ac, points, normals, count - 1);
	}
	else
	{
		triangle(a, b, c, points, normals);
	}
}

function triangle(a, b, c, points, normals)
{
	var t1 = subtract(b, a);
	var t2 = subtract(c, a);
	var normal;
	normals.push(negate(a));
	normals.push(negate(b));
	normals.push(negate(c));

	
	points.push(a);
	points.push(b);
	points.push(c);
}
