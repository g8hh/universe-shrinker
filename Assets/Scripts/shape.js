var ShapeType =
{
	Ellipse: 0,
	Rectangle: 1,
	Line: 2,
	Text: 3,
	Image: 4
}

class Shape
{
	constructor(position, color)
	{
		this.position = position;
		this.color = (color === undefined) ? 0 : color;
	}

	getScreenPos()
	{
		let pos = mainCamera.worldToScreenPoint(this.position);
		return pos;
	}
	
	renderable() //returns if it should be rendered
	{
		return true;
	}

	render()
	{

	}
}

class EllipseShape extends Shape
{
	constructor(position, radius, color)
	{
		super(position, color);
		this.radius = radius;
		this.type = ShapeType.Ellipse;
	}
	
	renderable()
	{
		let relSize = Decimal.max(this.radius.x, this.radius.y).div(mainCamera.getRange());
		return relSize.gte(new Decimal(1 / 10000)) && relSize.lte(1000000) 
						&& Vec2.dist(this.position.mul(-1, -1), mainCamera.position).lte(mainCamera.getRange().mul(25));
	}

	render()
	{
		super.render();

		let screenPosition = super.getScreenPos();
		let screenSize = createVector(this.radius.x.mul(mainCamera.zoom).mul(width).toNumber(), this.radius.y.mul(mainCamera.zoom).mul(width).toNumber());

		noStroke();
		fill(this.color);
		ellipse(screenPosition.x, screenPosition.y, screenSize.x, screenSize.y);
	}
}

class RectangleShape extends Shape
{
	constructor(position, size, color)
	{
		super(position, color);
		this.size = size;
		this.type = ShapeType.Rectangle;
	}
	
	renderable()
	{
		let relSize = Decimal.max(this.size.x, this.size.y).div(mainCamera.getRange());
		return relSize.gte(new Decimal(1 / 10000)) && relSize.lte(1000000) 
						&& Vec2.dist(this.position.mul(-1, -1), mainCamera.position).lte(mainCamera.getRange().mul(25));
	}
	
	render()
	{
		super.render();

		let screenPosition = super.getScreenPos();
		let screenSize = createVector(this.size.x.mul(mainCamera.zoom).mul(width).toNumber(), this.size.y.mul(mainCamera.zoom).mul(width).toNumber());

		noStroke();
		fill(this.color);
		rectMode(CENTER);
		rect(screenPosition.x, screenPosition.y, screenSize.x, screenSize.y);
	}
}

class LineShape extends Shape
{
	constructor(position, endPosition, width, color)
	{
		super(position, color);
		this.endPosition = endPosition;
		this.width = width;
		this.type = ShapeType.Line;
	}

	minLengthReached()
	{
		return Vec2.dist(this.position, this.endPosition).gte(this.width.mul(2));
	}

	renderable()
	{
		let relSize = this.width.div(mainCamera.getRange());
		return relSize.gte(new Decimal(1 / 10000)) && relSize.lte(1000000) 
						&& Vec2.dist(this.position.mul(-1, -1), mainCamera.position).lte(mainCamera.getRange().mul(25))
						&& Vec2.dist(this.endPosition.mul(-1, -1), mainCamera.position).lte(mainCamera.getRange().mul(25));
	}
	
	render()
	{
		super.render();

		let screenPosition = super.getScreenPos();
		let screenEndPosition = mainCamera.worldToScreenPoint(this.endPosition);
		let screenWidth = this.width.mul(mainCamera.zoom).mul(width).toNumber();

		stroke(this.color);
		strokeWeight(screenWidth);
		line(screenPosition.x, screenPosition.y, screenEndPosition.x, screenEndPosition.y);
	}
}

class TextShape extends Shape
{
	constructor(text, position, size, color)
	{
		super(position, color);
		this.text = text;
		this.size = size;
		this.type = ShapeType.Text;
	}
	
	renderable()
	{
		let relSize = this.size.div(mainCamera.getRange());
		return relSize.gte(new Decimal(1 / 10000)) && relSize.lte(1000000) 
						&& Vec2.dist(this.position.mul(-1, -1), mainCamera.position).lte(mainCamera.getRange().mul(25 + this.text.length));
	}

	render()
	{
		super.render();

		let screenPosition = super.getScreenPos();
		let screenSize = this.size.mul(mainCamera.zoom).mul(width).toNumber();
		let textExists = this.text.length > 0;

		noStroke();
		fill(textExists ? this.color : color(0, 0, 0, 0.5));
		textSize(screenSize);
		textAlign(CENTER, CENTER);
		text(textExists ? this.text : "Type something...", screenPosition.x, screenPosition.y);
	}
}

class ImageShape extends Shape
{

	constructor(position, size, imageIndex, color, rotation)
	{
		super(position, color);

		this.imageIndex = imageIndex;

		this.type = ShapeType.Image;

		//if saved parameters exist and either color or index changed
		if((ImageShape.lastColor === null || ImageShape.lastIndex === null || ImageShape.savedImage === null) || 
			this.imageIndex !== ImageShape.lastIndex || 
			ImageShape.lastColor.levels.join("") !== color.levels.join(""))
		{
			this.image = imageShapes[this.imageIndex].get(); //use an index for saving

			ImageShape.lastColor = color;
			ImageShape.lastIndex = this.imageIndex;
			ImageShape.savedImage = this.image;
		}
		else
		{
			this.image = ImageShape.savedImage;
		}

		this.size = size;
		this.rotation = rotation;

	}

	tintImage()
	{
		this.image.loadPixels();

		for(let p = 0; p < this.image.width * this.image.height * 4; p += 4)
		{
			this.image.pixels[p] = Math.floor(this.image.pixels[p] * red(this.color) / 256);
			this.image.pixels[p + 1] = Math.floor(this.image.pixels[p + 1] * green(this.color) / 256);
			this.image.pixels[p + 2] = Math.floor(this.image.pixels[p + 2] * blue(this.color) / 256);
		}

		this.image.updatePixels();
	}
	
	renderable()
	{
		let relSize = Decimal.max(this.size.x, this.size.y).div(mainCamera.getRange());
		return relSize.gte(new Decimal(1 / 10000)) && relSize.lte(new Decimal(1000000)) &&
						Vec2.dist(this.position.mul(-1, -1), mainCamera.position).lte(mainCamera.getRange().mul(25));
	}

	render()
	{
		super.render();

		let screenPosition = super.getScreenPos();
		let screenSize = createVector(this.size.x.mul(mainCamera.zoom).mul(width).toNumber(), this.size.y.mul(mainCamera.zoom).mul(width).toNumber());

		if(screenSize.x > 1 && screenSize.y > 1)
		{
			noStroke();
			let col = settings.image.allowTint ? this.color : null;
			Utils.imageExt(this.image, screenPosition.x, screenPosition.y, screenSize.x, screenSize.y, col, this.rotation);
			noTint();
		}
	}
}

ImageShape.lastColor = null;
ImageShape.lastIndex = null;
ImageShape.savedImage = null;

function checkShapesInDatabase() //should shape be loaded
{
	database.ref("shapes").once("value", function(snapshot)
	{
		for(prop of Object.getOwnPropertyNames(snapshot.val()))
		{
			let shape = shapeFromJSON(snapshot.val()[prop]);
			if(shape.renderable())
			{
				loadShape(shape);
			}
		}
	});
}

function cleanShapes() //remove unneeded shapes
{
	let newShapes = [];
	
	for(shape of shapes)
	{
		if(shape.renderable())
		{
			newShapes.push(shape);
		}
	}
	
	shapes = newShapes;
}

function refreshShapes()
{
	checkShapesInDatabase();
	cleanShapes();
}
