class Vec2
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}

	add(v)
	{
		return new Vec2(this.x.add(v.x), this.y.add(v.y));
	}

	sub(v)
	{
		return new Vec2(this.x.sub(v.x), this.y.sub(v.y));
	}

	mul(x, y)
	{
		if(y === undefined)
		{
			return new Vec2(this.x.mul(x), this.y.mul(x));
		}
		return new Vec2(this.x.mul(x), this.y.mul(y));
	}

	div(x, y)
	{
		if(y === undefined)
		{
			return new Vec2(this.x.div(x), this.y.div(x));
		}
		return new Vec2(this.x.div(x), this.y.div(y));
	}

	mag()
	{
		return Decimal.sqrt(this.x.pow(2).add(this.y.pow(2)));
	}

	static dist(v1, v2)
	{
		let dx = v2.x.sub(v1.x);
		let dy = v2.y.sub(v1.y);
		return Decimal.sqrt(dx.pow(2).add(dy.pow(2)));
	}

	toString()
	{
		return "(" + [this.x.toString(), this.y.toString()].join() + ")";
	}
}
