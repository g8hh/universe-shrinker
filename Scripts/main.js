
Decimal.set({precision: 50});

var isReady = false;

var loadedImages = 0;

var aspectRatio = 0;

var mainCamera = new Camera(new Vec2(new Decimal(0), new Decimal(0)), new Decimal(1));

var shapes = [], temporaryShape;

var currentLine, currentText;

var currentImageIndex;

var username;

var userData = {}, userNames = [];

var exited = false;

var mouseDelta =
{
	start: new p5.Vector(0, 0),
	total: new p5.Vector(0, 0)
};

function getAspectRatio()
{
	return width / height;
}

var imageShapes = [];

function preload()
{
	let storage = firebase.storage();

	let links = ["earth.png", "moon.png", "sun.png", "space.png", "galaxy.png", "texture_grass.png", "texture_sand.png", "texture_stone.png", "mandelbrot.png", "fractal1.png", "fractal2.png"] ;


	let ref = storage.ref().child("ImageShapes");

	let imagePromises = [];
	
	for(let i=0;i<links.length;i++) 
	{
		(function(link)
		{
			let imgRef = ref.child(link);
			imagePromises.push(imgRef.getDownloadURL());
		})(links[i]);
	}

	Promise.all(imagePromises).then(function(images)
	{
		for(let image of images) 
		{
			imageShapes.push(loadImage(image, function(){
				loadedImages++;
				if(loadedImages === images.length) {
					//after images have been loaded
					nodes.slider.image.index.max = imageShapes.length - 1;		
					nodes.slider.image.index.value = settings.image.index;
					
					database.ref().once("value", function(snapshot)
					{
						if(snapshot.hasChild("users"))
						{
							database.ref("users").once("value", function(users)
							{
								userNames = Object.getOwnPropertyNames(users.val());
							}).then(function(value)
							{
								isReady = true;
								onReady();
							});
						}
						else
						{
							isReady = true;
							onReady();
						}
					});
					
				}
			}));
		}
		
		
	});



}

function onReady()
{
	syncDatabase();
	
	do
	{
		username = prompt("What is your name?");
		
		valid = checkUserName(username);
		
		if(!valid)
		{
			alert("Username might be taken. Usernames must only contain letters and 0-9 and be at least 5 characters in length.");
		}
	}
	while(username === null || !valid)
	username = validateUsername(username);
	
	
}

function setup()
{


	let canvas = createCanvas(windowWidth, windowHeight, P2D);
	canvas.parent("canvas_container");

	colorMode(HSL, 1, 1, 1, 1);
	rectMode(CENTER);

	background(color(1, 1, 1));

	noSmooth();

	aspectRatio = getAspectRatio();

	currentImageIndex = 0;
	
	loadCamera();
	
	
	let validUserName = false;
	
	

	
}

function draw()
{
	background(color(1, 1, 1));
	
	if(!isReady) 
	{
		textSize(100);
		textAlign(CENTER, CENTER);
		fill(0);
		
		text("Loading...", width / 2, height / 2);
		
		textSize(36);
		if(loadedImages >= 1)
		{
			text("Loaded Image " + loadedImages + " of " + imageShapes.length, width / 2, height / 2 + 100);
		}
		else
		{
			text("Initializing", width / 2, height / 2 + 100);
		}

		return;
	}

	let deltatime = 1 / frameRate();

	mouseDelta.total = mouseDelta.start.sub(new p5.Vector(mouseX, mouseY));
	mouseDelta.start = createVector(mouseX, mouseY);

	mainCamera.tick(deltatime);
	saveCamera();

	if(mousePressed)
	{
		if(currentLine !== undefined)
		{
			currentLine.endPosition = mainCamera.screenToWorldPoint(new p5.Vector(mouseX, mouseY));
			if(currentLine.minLengthReached())
			{
				addShapeToDatabase(currentLine);
				placeLine();
			}
		}
		
		
		if(settings.tool === "view" && mouseIsPressed && !cursorOnContainer)
		{
			let factor = mouseButton === LEFT ? 1 : mouseButton === RIGHT ? -1 : 0;
			mainCamera.zoomIn(Decimal.pow(5, deltatime * factor));
		}
	}
	
	let userAmount = Object.getOwnPropertyNames(userData).length;
	nodes.text.usersOnline.innerHTML = userAmount <= 0 ? "" : userAmount == 1 ? "Only you are drawing" : userAmount + " People drawing";

	noStroke();

	shapes.forEach(function(s)
	{
		s.render();
	});
	if(temporaryShape)
	{
		temporaryShape.render();
	}
	
	if(!exited)
	{
		pushUserData();
	}
	
	for(prop of Object.getOwnPropertyNames(userData))
	{
		if(prop !== username)
		{
			drawUser(userData[prop], username !== prop);
		}
	}

	//idea: turn this into a loop for all users
	
	let col = colorFromCSSString(settings.color);
	let finalCol = color(hue(col), saturation(col), lightness(col), 0.5);
	fill(finalCol);
	let brushSize = [Number.parseFloat(settings.brushSize.x), Number.parseFloat(settings.brushSize.y)];
	let brushRadius = Number.parseFloat(settings.brushSize.radius);

	let displayPreview = cursorOnContainer && currentLine === undefined && settings.tool !== "view";
	let x = displayPreview ? width / 2 : mouseX;
	let y = displayPreview ? height / 2 : mouseY;

	switch(settings.tool)
	{
		case "ellipse":
			noStroke();
			ellipse(x, y, width * brushSize[0], width * brushSize[1]);
			break;
		case "rectangle":
			noStroke();
			rectMode(CENTER);
			rect(x, y, width * brushSize[0], width * brushSize[1]);
			break;
		case "line":
			noStroke();
			ellipse(x, y, width * brushRadius, width * brushRadius);
			break;
		case "text":
			noStroke();
			textAlign(CENTER, CENTER);
			textSize(brushRadius * width);
			text("A", x, y);
			break;
		case "image":
			noStroke();
			Utils.imageExt(imageShapes[Number.parseFloat(settings.image.index)], x, y, brushSize[0] * width, brushSize[1] * width, finalCol, radians(settings.image.rotation));
			break;
		case "view":
			break;
		default:
			break;
	}
	

	if(mouseIsPressed && mouseButton === CENTER && settings.tool == "view")
	{
		let factor = Decimal.pow(2, (mouseY / height - 0.5) * 5 * deltatime * -1);
		mainCamera.zoomIn(factor);
	}

	stroke(0);
	strokeWeight(2);
	rectMode(CORNER);
	for(let x = 0, i = 0; x < width; x += width / 10, i++)
	{
		fill(i % 2 == 0 ? 0 : color(0, 0, 1, 1));
			rect(x, height * 0.98, width / 10, 30);
	}
	rectMode(CENTER);

	textAlign(CENTER, BOTTOM);
	fill(0);
	textSize(40);
	textStyle(BOLD);
	Utils.textOutlined("<- " + DistanceFormatter.format(mainCamera.getRange()) + " ->", width / 2, height - 40, color(0, 0, 0), color(1, 1, 1), 2);
	if(displayPreview)
	{
		Utils.textOutlined("Preview", width / 2, 128, color(0, 0, 0), color(1, 1, 1), 2);
	}


	textAlign(LEFT, TOP);


}

function drawUser(userData, displayName)
{
	let cursorPosition = Vec2.fromString(userData.cursorPosition);

	let tool = userData.tool;
	
	fill(userData.color[0], userData.color[1], userData.color[2], 0.5);
	let brushSize = 
	{
		x: userData.brushSize.x, 
		y: userData.brushSize.y,
		radius: userData.brushSize.radius
	};
	
	let imageSettings =
	{
		rotation: userData.image.rotation,
		index: userData.image.index,
		displayColor: color(userData.color[0], userData.color[1], userData.color[2], 0.5),
	};
	
	let zoomScaleFactor = Utils.clampDecimal(mainCamera.zoom.div(new Decimal(userData.cameraZoom)), new Decimal(0.001), new Decimal(10)).toNumber();
	
	let screenX = mainCamera.worldToScreenPoint(cursorPosition).x;
	let screenY = mainCamera.worldToScreenPoint(cursorPosition).y;
	
	let scaleFactor = zoomScaleFactor * width;

	switch(tool)
	{
		case "ellipse":
			noStroke();
			ellipse(screenX, screenY, scaleFactor * brushSize.x, scaleFactor * brushSize.y);
			break;
		case "rectangle":
			noStroke();
			rectMode(CENTER);
			rect(screenX, screenY, scaleFactor * brushSize.x, scaleFactor * brushSize.y);
			break;
		case "line":
			noStroke();
			ellipse(screenX, screenY, scaleFactor * brushSize.radius, scaleFactor * brushSize.radius);
			break;
		case "text":
			noStroke();
			textAlign(CENTER, CENTER);
			textSize(brushSize.radius * scaleFactor);
			text("A", screenX, screenY);
			break;
		case "image":
			noStroke();
			Utils.imageExt(imageShapes[userData.image.index], screenX, screenY, brushSize.x * scaleFactor, brushSize.y * scaleFactor, imageSettings.displayColor, radians(userData.image.rotation));
			break;
		case "view":
			break;
		default:
			break;
	}
	
	if(displayName)
	{
		let yOff = 0;
		if(userData.tool === "line" || userData.tool === "text")
		{
			yOff -= userData.brushSize.radius * width * Math.min(5, zoomScaleFactor) * 0.6;
		}
		else if(userData.tool === "view")
		{
			yOff = 0;
		}
		else
		{
			yOff -= userData.brushSize.y * width * Math.min(5, zoomScaleFactor) * 0.6;
		}
		textSize(20 * Utils.clamp(zoomScaleFactor * 2, 0.33, 2));
		textAlign(CENTER, CENTER);
		Utils.textOutlined(userData.displayName, screenX, screenY + yOff, color(0, 0, 0), color(0, 0, 1), 2);
	}
}

function windowResized()
{
	resizeCanvas(windowWidth, windowHeight);

	aspectRatio = getAspectRatio();
}

function keyTyped()
{
	if(currentText !== undefined)
	{
		currentText.text += key;
	}
}

function mousePressed(event)
{
	if(event.buttons === 1 && !cursorOnContainer)
	{
		if(settings.tool === "line")
		{
			placeLine();
		}
		else
		{
			placeShape();
		}
	}
}

function mouseReleased()
{
	if(currentLine !== undefined && settings.tool === "line")
	{
		addShapeToDatabase(currentLine);
	}
	currentLine = undefined;
}

function mouseDragged(event)
{
	if(event.buttons === 2 || (event.buttons === 1 && settings.tool === "view") && !cursorOnContainer)
	{
		let delta = new p5.Vector(mouseDelta.total.x * -1, mouseDelta.total.y).div(width);
		mainCamera.moveRelative(new p5.Vector(delta.x, delta.y));
	}
}

function mouseWheel(event)
{
	if(!cursorOnContainer)
	{
		mainCamera.zoomIn(Decimal.pow(0.8, new Decimal(event.delta / 100)));
	}
}

function placeShape()
{
	let color = colorFromCSSString(settings.color);
	let position = mainCamera.screenToWorldPoint(createVector(mouseX, mouseY));
	let size = new Vec2(mainCamera.getRange().mul(Number.parseFloat(settings.brushSize.x)),
						mainCamera.getRange().mul(Number.parseFloat(settings.brushSize.y)));
	let radius = mainCamera.getRange().mul(Number.parseFloat(settings.brushSize.radius));

	switch(settings.tool)
	{
		case "ellipse":
			addShape(new EllipseShape(position, size, color), true);
			break;
		case "rectangle":
			addShape(new RectangleShape(position, size, color), true);
			break;
		case "text":
			if(currentText !== undefined && currentText.text.length === 0)
			{
				currentText = undefined;
			}
			if(currentText !== undefined) //if edited text exists
			{
				addShapeToDatabase(currentText, true);
			}
			currentText = addShape(new TextShape("", position, radius, color), false);
			break;
		case "image":
			addShape(new ImageShape(position, size, Number.parseFloat(settings.image.index), color, radians(settings.image.rotation)), true);
			break;
		case "view":
			break;
		default:
			break;
	}
}

function placeLine()
{
	let color = colorFromCSSString(settings.color);
	let startPos = mainCamera.screenToWorldPoint(new p5.Vector(mouseX, mouseY));
	let width = mainCamera.getRange().mul(Number.parseFloat(settings.brushSize.radius));
	currentLine = addShape(new LineShape(startPos, startPos, width, color), false);
}

function addShape(shape, addToDatabase)
{
	if(addToDatabase && shapes.length < 4096)
	{
		addShapeToDatabase(shape);
	}
	else
	{
		temporaryShape = shape;
	}
	return shape;
}

function loadShape(shape)
{
	shapes.push(shape);
	return shape;
}

function checkUserName(username)
{
	return /^[a-z|A-Z|0-9]{5,}$/g.test(username) && !userNames.includes(username);
}

function validateUsername(username)
{
	return username.match(/[a-zA-Z0-9]/g).join("");
}

function pushUserData()
{
	validateUsername(username);
	let brushColor = colorFromCSSString(settings.color);
	database.ref("users").child(username).set(
	{
		displayName: username,
		cameraZoom: mainCamera.zoom.toString(),
		cursorPosition: mainCamera.screenToWorldPoint(new p5.Vector(mouseX, mouseY)).toString(),
		tool: settings.tool,
		color: [hue(brushColor), saturation(brushColor), lightness(brushColor)],
		brushSize: 
		{
			x: Number.parseFloat(settings.brushSize.x), 
			y: Number.parseFloat(settings.brushSize.y), 
			radius: Number.parseFloat(settings.brushSize.radius)
		},
		image: 
		{
			rotation: Number.parseFloat(settings.image.rotation), 
			index: Number.parseFloat(settings.image.index)
		},
		timeStamp: Date.now()
	});
}

window.onbeforeunload = function(e)
{
	exited = true;
	database.ref("users/"+username).remove();
}
