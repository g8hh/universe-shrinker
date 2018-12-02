
Decimal.set({precision: 50});

var aspectRatio = 0;

var mainCamera = new Camera(new Vec2(new Decimal(0), new Decimal(0)), new Decimal(1));

var shapes = [];

var currentLine, currentText;

var currentImageIndex;

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
	let baseLink = "https://raw.githubusercontent.com/cook1ee/cook1ee.github.io/master/Assets/ImageShapes/";

	let links = ["earth.png", "moon.png", "sun.png", "space.png", "galaxy.png", "texture_grass.png", "texture_sand.png", "texture_stone.png", "mandelbrot.png", "fractal1.png", "fractal2.png"] ;

	links.forEach(function(link)
	{
		imageShapes.push(loadImage(baseLink + link));
	});


}

function setup()
{
	//after images have been loaded
	nodes.slider.image.index.max = imageShapes.length - 1;
	nodes.slider.image.index.value = settings.image.index;

	let canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent("canvas_container");

	canvas.onclick = function(event)
	{
		console.log(event);
	}

	colorMode(HSL, 1, 1, 1, 1);
	rectMode(CENTER);

	background(color(1, 1, 1));

	noSmooth();

	aspectRatio = getAspectRatio();

	currentImageIndex = 0;
}

function draw()
{
	let deltatime = 1 / frameRate();

	mouseDelta.total = mouseDelta.start.sub(new p5.Vector(mouseX, mouseY));
	mouseDelta.start = createVector(mouseX, mouseY);

	mainCamera.tick(deltatime);

	if(mousePressed)
	{
		if(currentLine !== undefined)
		{
			currentLine.endPosition = mainCamera.screenToWorldPoint(new p5.Vector(mouseX, mouseY));
			if(currentLine.minLengthReached())
			{
				placeLine();
			}
		}
	}

	background(color(1, 1, 1));

	noStroke();

	shapes.forEach(function(s)
	{
		s.render();
	});

	fill(colorFromCSSString(settings.color));
	let brushSize = [Number.parseFloat(settings.brushSize.x), Number.parseFloat(settings.brushSize.y)];
	let brushRadius = Number.parseFloat(settings.brushSize.radius);

	let displayPreview = cursorOnToolbar && currentLine === undefined && settings.tool !== "view";
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
			Utils.imageExt(imageShapes[Number.parseFloat(settings.image.index)], x, y, brushSize[0] * width, brushSize[1] * width, colorFromCSSString(settings.color), radians(settings.image.rotation));
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
	if(event.buttons === 1 && !cursorOnToolbar)
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
	currentLine = undefined;
}

function mouseDragged(event)
{
	if(event.buttons === 2 || (event.buttons === 1 && settings.tool === "view"))
	{
		let delta = new p5.Vector(mouseDelta.total.x * -1, mouseDelta.total.y).div(width);
		mainCamera.moveRelative(new p5.Vector(delta.x, delta.y));
	}
}

function mouseWheel(event)
{
	mainCamera.zoomIn(Decimal.pow(0.8, new Decimal(event.delta / 100)));
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
			addShape(new Ellipse(position, size, color));
			break;
		case "rectangle":
			addShape(new Rectangle(position, size, color));
			break;
		case "text":
			currentText = addShape(new Text("", position, radius, color));
			break;
		case "image":
			addShape(new ImageShape(position, size, Number.parseFloat(settings.image.index), color, radians(settings.image.rotation)));
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
	currentLine = addShape(new Line(startPos, startPos, width, color));
}

function addShape(shape)
{
	shapes.push(shape);
	return shape;
}
