loadSettings();

initSettings();

function initSettings()
{
	//load values from settings and assign them
	Object.getOwnPropertyNames(nodes.slider.color).forEach(function(name)
	{
		nodes.slider.color[name].value = settings.sliderValues.color[name];
	});

	nodes.slider.brushSize.x.value = settings.brushSize.x;
	nodes.slider.brushSize.y.value = settings.brushSize.y;
	nodes.slider.brushSize.radius.value = settings.brushSize.radius;

	nodes.slider.image.rotation.value = settings.image.rotation;

	nodes.toolbar_color_preview.style.backgroundColor = settings.color;

	selectTool(settings.tool);

	nodes.container.toolbar.style.left = settings.toolBarHidden ? "-70%" : "0px";
	
	setDarkMode(settings.darkMode);
}

document.oncontextmenu = function(event)
{
	event.preventDefault();
}

document.onkeydown = function(e)
{
	if(e.which === 13) //enter
	{
		sendChatMessage(nodes.input.chatMessage.value);
	}
}
