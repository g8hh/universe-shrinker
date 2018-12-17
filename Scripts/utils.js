class Utils
{
	static capitalize(s)
	{
		s = s.toLowerCase();
		return s[0].toUpperCase() + s.substring(1);
	}

	static imageExt(img, x, y, sizeX, sizeY, imageColor, rotation)
	{
		imageMode(CENTER);
		push();
		translate(x, y ); //translate towards center
		rotate(rotation);
		if(imageColor !== null)
		{
			tint(imageColor);
		}
		image(img, 0, 0, sizeX, sizeY);
		pop();
		noTint();
	}

	static textOutlined(txt, x, y, colorIn, colorOut, outWidth)
	{
		noStroke();
		outWidth = outWidth === undefined ? 1 : outWidth;

		fill(colorOut);
		[[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function(off)
		{
			let offCurrent = [off[0] * outWidth, off[1] * outWidth];
			text(txt, x + offCurrent[0], y + offCurrent[1]);
		});

		fill(colorIn);
		text(txt, x, y);
	}
	
	static clampDecimal(d, min, max)
	{
		return Decimal.min(Decimal.max(d, min), max);
	}
	
	static clamp(n, min, max)
	{
		return Math.min(Math.max(n, min), max);
	}
}
