var nodes =
{
	toolbar_color_preview: document.getElementById("toolbar_color_preview"),
	container:
	{
		toolbar: document.getElementById("toolbar_container")
	},
	button:
	{
		close_toolbar: document.getElementById("button_close_toolbar"),
		tools:
		{
			ellipse: document.getElementById("button_tool_ellipse"),
			rectangle: document.getElementById("button_tool_rectangle"),
			line: document.getElementById("button_tool_line"),
			text: document.getElementById("button_tool_text"),
			image: document.getElementById("button_tool_image")
		}
	},
	slider:
	{
		color:
		{
			hue: document.getElementById("toolbar_slider_hue"),
			saturation: document.getElementById("toolbar_slider_saturation"),
			luminance: document.getElementById("toolbar_slider_luminance")
		},
		brushSize:
		{
			x: document.getElementById("toolbar_slider_brushSize_x"),
			y: document.getElementById("toolbar_slider_brushSize_y")
		},
		image:
		{
			rotation: document.getElementById("toolbar_slider_image_rotation"),
			index: document.getElementById("toolbar_slider_image_index")
		}
	}
};

var settings =
{
	toolbarHidden: false,
	color: "hsl(0, 0%, 0%)",
	sliderValues:
	{
		color:
		{
			hue: 0,
			saturation: 0,
			luminance: 0
		}
	},
	tool: "ellipse",
	brushSize:
	{
		x: "0.1", y: "0.1"
	},
	image:
	{
		index: 0,
		rotation: 0
	}
};

var imageShapes = [];

function preload()
{
	let baseLink = "https://raw.githubusercontent.com/cook1ee/cook1ee.github.io/master/Assets/ImageShapes/";

	let links = ["earth.png", "moon.png", "space.png", "mandelbrot.png"];

	links.forEach(function(link)
	{
		imageShapes.push(loadImage(baseLink + link));
	});


}
