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

	render()
	{

	}
}

class Ellipse extends Shape
{
	constructor(position, radius, color)
	{
		super(position, color);
		this.radius = radius;
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

class Rectangle extends Shape
{
	constructor(position, size, color)
	{
		super(position, color);
		this.size = size;
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

class Line extends Shape
{
	constructor(position, endPosition, width, color)
	{
		super(position, color);
		this.endPosition = endPosition;
		this.width = width;
	}

	minLengthReached()
	{
		return Vec2.dist(this.position, this.endPosition).gte(this.width.mul(2));
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

class Text extends Shape
{
	constructor(text, position, size, color)
	{
		super(position, color);
		this.text = text;
		this.size = size;
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

	constructor(position, size, image, color, rotation)
	{
		super(position, color);
		this.size = size;
		this.image = image;
		this.rotation = rotation;
	}

	render()
	{
		super.render();

		let screenPosition = super.getScreenPos();
		let screenSize = createVector(this.size.x.mul(mainCamera.zoom).mul(width).toNumber(), this.size.y.mul(mainCamera.zoom).mul(width).toNumber());

		noStroke();
		Utils.imageExt(this.image, screenPosition.x, screenPosition.y, screenSize.x, screenSize.y, this.color, this.rotation);
	}
}
