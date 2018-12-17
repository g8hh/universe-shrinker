class NumberFormatter
{
	static get PREFIXES_START()
	{
		return ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion",
		"Quintillion", "Sextillion", "Septillion", "Octillion", "Nonillion", "Decillion"];
	}

	static get PREFIXES_ONES()
	{
		return ["", "Un", "Duo", "Tre", "Quattuor",
		"Quin", "Sex", "Sept", "Octo", "Novem"];
	}

	static get PREFIXES_TENS()
	{
		return ["", "Decillion", "Vigintillion", "Trigintillion", "Quadragintillion", "Quinquagintillion",
	"Sexagintillion", "Septuagintillion", "Octogintillion", "Nonagintillion"];
	}

	static format(value)
	{
		if(value.gte(1e+33))
		{
			let mantissa = Math.pow(10, Decimal.log(value) % 3);
			let fixedE = Decimal.log(value) - 3;
			let suffix = this.PREFIXES_ONES[Math.floor(fixedE / 3) % this.PREFIXES_ONES.length] +
									this.PREFIXES_TENS[Math.floor(fixedE / 30)];
			suffix = Utils.capitalize(suffix);
			return mantissa.toFixed(2) + " " + suffix;
		}
		if(value.gte(1000))
		{
			let mantissa = Math.pow(10, Decimal.log(value) % 3);
			let suffix = this.PREFIXES_START[Math.floor(Decimal.log(value) / 3)];
			return mantissa.toFixed(2) + " " + suffix;
		}
		else if(value.gte(0.01))
		{
			return value.toFixed(2);
		}
		else
		{
			return "1/" + NumberFormatter.format(Decimal.pow(value, -1));
		}
	}


}
