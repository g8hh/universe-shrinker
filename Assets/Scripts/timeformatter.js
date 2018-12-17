class TimeFormatter
{
	static format(ms)
	{
		let date = new Date(ms);
		
		return [date.getHours(), 
				("0" + date.getMinutes()).slice(-2), 
				("0" + date.getSeconds()).slice(-2)].join(":");
	}
}