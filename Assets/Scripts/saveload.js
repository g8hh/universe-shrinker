function saveSettings()
{
	localStorage.setItem("InfiniteCanvas_Settings", JSON.stringify(settings));
}

function loadSettings()
{
	if(localStorage.getItem("InfiniteCanvas_Settings") !== "null" && localStorage.getItem("InfiniteCanvas_Settings") !== null)
	{
		let storageObj = JSON.parse(localStorage.getItem("InfiniteCanvas_Settings"));
		 Object.getOwnPropertyNames(storageObj).forEach(function(prop)
		 {
			 settings[prop] = storageObj[prop];
		 });
	}
}
