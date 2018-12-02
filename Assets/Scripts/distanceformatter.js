class DistanceFormatter
{
	static get PLANCK_LENGTH()
	{
		return new Decimal("1.6e-35");
	}

	static get LIGHT_YEAR()
	{
		return new Decimal("9.461e+15");
	}

	static get UNIVERSE()
	{
		return new Decimal("75e+9").mul(this.LIGHT_YEAR);
	}

	static get DISTANCES_SMALL()
	{
		return ["Millimeters", "Micrometers", "Nanometers", "Picometers",
		"Femtometers", "Attometers", "Zeptometers", "Yoctometers"];
	}

	static get DISTANCES_BIG()
	{
		return ["Meters", "Kilometers", "Megameters", "Gigameters", "Terameters",
		"Petameters", "Exameters"];
	}

	static format(value)
	{
		if(value.gte(this.UNIVERSE))
		{
			let order = Math.floor(Decimal.log(value, this.UNIVERSE)) - 1;
			let s = ["Uni", "Mega", "Giga", "Tera", "Peta", "Exa", "Zetta", "Yotta", "Hyper", "Omni"];
			let verseOrder = Math.floor(order / s.length);
			return NumberFormatter.format(value.div(this.UNIVERSE.pow(order + 1))) + " " + s[order % s.length] + "verses" + (verseOrder > 0 ? "^" + verseOrder : "");
		}
		if(value.gte(this.LIGHT_YEAR))
		{
			return NumberFormatter.format(value.div(this.LIGHT_YEAR)) + " Light Years";
		}
		else if(value.gte(1))
		{
			let mantissa = Math.pow(10, Decimal.log(value) % 3);
			let suffix = this.DISTANCES_BIG[Math.floor(Decimal.log(value) / 3)];
			return mantissa.toFixed(2) + " " + suffix;
		}
		else if(value.gte(0.01))
		{
			return (value.mul(100)).toFixed(2) + " Centimeters";
		}
		else if(value.gte(new Decimal("1e-24")))
		{
			let mantissa = Math.pow(10, Decimal.log(value) % 3 + 3);
			let suffix = this.DISTANCES_SMALL[-Math.floor(Decimal.log(value) / 3) - 1];
			return mantissa.toFixed(2) + " " + suffix;
		}
		else
		{
			return NumberFormatter.format(value.div(this.PLANCK_LENGTH)) + " Planck Lengths";
		}
		return 0;
	}
}
