function saveSettings()
{
	localStorage.setItem("InfiniteCanvas_Settings", JSON.stringify(settings));
}

function loadSettings()
{
	if(localStorage.getItem("InfiniteCanvas_Settings") !== "null" && localStorage.getItem("InfiniteCanvas_Settings") !== null)
	{
		let storageObj = JSON.parse(localStorage.getItem("InfiniteCanvas_Settings"));
		if(Object.getOwnPropertyNames(settings).length <= Object.getOwnPropertyNames(storageObj).length)
		{
			//only load localStorage object if it doesnt delete properties from the settings object
			settings = storageObj;
		}
	}
}
