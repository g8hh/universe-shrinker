function storageHasItem(key)
{
	return localStorage.getItem(key) !== "null" && localStorage.getItem(key) !== null;
}

function saveSettings()
{
	localStorage.setItem("InfiniteCanvas_Settings", JSON.stringify(settings));
}

function loadSettings()
{
	if(storageHasItem("InfiniteCanvas_Settings"))
	{
	 	let storageObj = JSON.parse(localStorage.getItem("InfiniteCanvas_Settings"));
	 	Object.getOwnPropertyNames(storageObj).forEach(function(prop)
	 	{
		 	settings[prop] = storageObj[prop];
	 	});
	}
}

function saveCamera()
{
	let saveObj = {};
	
	saveObj.position = 
	{
		x: mainCamera.position.x.toString(),
		y: mainCamera.position.y.toString()
	};
	
	saveObj.targetZoom = mainCamera.targetZoom.toString();
	
	localStorage.setItem("InfiniteCanvas_Camera", JSON.stringify(saveObj));
}

function loadCamera()
{
	if(storageHasItem("InfiniteCanvas_Camera"))
	{
		let loadObj = JSON.parse(localStorage.getItem("InfiniteCanvas_Camera"));
	
		mainCamera.position = new Vec2(
			new Decimal(loadObj.position.x),
			new Decimal(loadObj.position.y)
		);
		
		mainCamera.targetZoom = new Decimal(loadObj.targetZoom);
		mainCamera.zoom = mainCamera.targetZoom;
	}
}
