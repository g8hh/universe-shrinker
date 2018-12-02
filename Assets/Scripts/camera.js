class Camera
{
	constructor(position, zoom)
	{
		this.position = position;
		this.zoom = zoom;
		this.targetZoom = this.zoom;
	}

	tick(deltatime)
	{
		this.zoom = this.zoom.mul(this.targetZoom.div(this.zoom).pow(Math.min(1, Math.pow(deltatime, 0.5))));
	}

	worldToScreenPoint(vec)
	{
		let offsetPosition = vec.add(this.position);
		return createVector((offsetPosition.x.mul(this.zoom).add(0.5)).mul(width).toNumber(),
						(offsetPosition.y.mul(this.zoom).sub(0.5 / aspectRatio).div(1)).mul(width * -1).toNumber());
	}

	screenToWorldPoint(PVector)
	{
			return new Vec2((new Decimal(PVector.x).sub(width / 2)).div(this.zoom).div(width),
							(new Decimal(PVector.y).sub(width / 2  / aspectRatio)).div(this.zoom).div(width * -1).mul(1)).add(this.position.mul(new Decimal(-1)));
	}

	getRange()
	{
		return Decimal.pow(this.zoom, -1);
	}

	zoomIn(factor)
	{
		this.targetZoom = this.targetZoom.mul(factor);
	}

	zoomOut(factor)
	{
		this.targetZoom = this.targetZoom.div(factor);
	}

	move(vec)
	{
		this.position = this.position.add(vec);
	}

	moveRelative(PVector)
	{
		let relValue = new Vec2(new Decimal(PVector.x), new Decimal(PVector.y)).mul(this.getRange());
		this.position = this.position.add(relValue);
	}
}
