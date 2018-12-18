//show/hide toolbar
nodes.button.close_toolbar.addEventListener("click", function(){
	let left = nodes.container.toolbar.style.left;

	nodes.container.toolbar.style.left = (left === "0px" || left === "") ? "-70%" : "0px";

	left = nodes.container.toolbar.style.left; //update value
	settings.toolBarHidden = !(left === "0px" || left === "");

	saveSettings();
});

var cursorOnContainer = false;

nodes.container.toolbar.onmouseover = function()
{
	cursorOnContainer = true;
};

nodes.container.toolbar.onmouseout = function()
{
	cursorOnContainer = false;
};

//change color preview on moving sliders

let colorSliders = [nodes.slider.color.hue, nodes.slider.color.saturation, nodes.slider.color.luminance];

colorSliders.forEach(function(el)
{
	el.oninput = function()
	{
		let h = nodes.slider.color.hue.value * 360;
		let s = nodes.slider.color.saturation.value * 100 + "%";
		let l = nodes.slider.color.luminance.value * 100 + "%";

		let colorString = "hsl(" + [h, s, l].join() + ")";

		nodes.toolbar_color_preview.style.backgroundColor = colorString;

		settings.sliderValues.color =
		{
			hue: colorSliders[0].value,
			saturation: colorSliders[1].value,
			luminance: colorSliders[2].value,
		}
		settings.color = colorString;

		saveSettings();
	}
});

let brushSizeSliders = [nodes.slider.brushSize.x, nodes.slider.brushSize.y, nodes.slider.brushSize.radius];

for(let i = 0; i < brushSizeSliders.length; i++)
{
	brushSizeSliders[i].oninput = function()
	{
		settings.brushSize[new Array("x", "y", "radius")[i]] = brushSizeSliders[i].value;

		saveSettings();
	}
}

nodes.slider.image.rotation.oninput = function()
{
	settings.image.rotation = nodes.slider.image.rotation.value;

	saveSettings();
}

nodes.slider.image.index.oninput = function()
{
	settings.image.index = nodes.slider.image.index.value;

	saveSettings();
}

//selecting tools
let toolNames = Object.getOwnPropertyNames(nodes.button.tools);

let tools = [];
toolNames.forEach(function(name)
{
	tools.push(nodes.button.tools[name]);
});

for(let i = 0; i < tools.length; i++)
{
	tools[i].onclick = function()
	{
		tools.forEach(function(e)
		{
			if(e.classList.contains("tool_selected"))
			{
				e.classList.remove("tool_selected");
			}
		});

		tools[i].classList.add("tool_selected");

		settings.tool = toolNames[i];

		saveSettings();
	}
}

nodes.checkbox.allowTint.onchange = function(event)
{
	settings.image.allowTint = nodes.checkbox.allowTint.checked;
	
	saveSettings();
}

nodes.container.toolbar.onclick = function(event)
{
	//event.preventDefault();
};

function selectTool(tool)
{
	nodes.button.tools[tool].onclick();
}

function setDarkMode(b)
{
	let elements = [nodes.container.toolbar, nodes.container.chatbox, nodes.toolbar_color_preview];
	
	if(b)
	{
		for(el of elements)
		{
			el.classList.add("invert");
		}
	}
	else
	{
		for(el of elements)
		{
			if(el.classList.contains("invert"))
			{
				el.classList.remove("invert");
			}
		}
	}
	
	settings.darkMode = b;
	
	saveSettings();
}

nodes.button.toggleDarkMode.onclick = function(e)
{
	setDarkMode(!settings.darkMode);
}

function colorFromCSSString(hsl)
{
	hsl = hsl.substring(3); //cut off "hsl"
	hsl = hsl.substring(1, hsl.length - 1); //remove braces

	let r = new RegExp("%", "g");
	hsl = hsl.replace(r, "");

	let colors = hsl.split(",");
	colors.forEach(function(c)
	{
		c = Number.parseInt(c); //string to number
	});
	let finalColors = [colors[0] / 360, colors[1] / 100, colors[2] / 100]; //normalize
	return color(finalColors[0], finalColors[1], finalColors[2]);
}
