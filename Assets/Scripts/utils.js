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
		tint(imageColor);
		image(img, 0, 0, sizeX, sizeY);
		pop();
	}
}
