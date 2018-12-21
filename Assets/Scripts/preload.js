var nodes =
{
	toolbar_color_preview: document.getElementById("toolbar_color_preview"),
	container:
	{
		toolbar: document.getElementById("toolbar_container"),
		chatbox: document.getElementById("chatbox_container"),
		chatboxMessages: document.getElementById("chatbox_messages"),
		toolbarImage: document.getElementById("toolbar_container_image")
	},
	button:
	{
		close_toolbar: document.getElementById("button_close_toolbar"),
		toggleDarkMode: document.getElementById("button_toggle_darkmode"),
		tools:
		{
			ellipse: document.getElementById("button_tool_ellipse"),
			rectangle: document.getElementById("button_tool_rectangle"),
			line: document.getElementById("button_tool_line"),
			text: document.getElementById("button_tool_text"),
			image: document.getElementById("button_tool_image"),
			view: document.getElementById("button_tool_view")
		},
		sendChatMessage: document.getElementById("chatbox_button_send")
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
			y: document.getElementById("toolbar_slider_brushSize_y"),
			radius: document.getElementById("toolbar_slider_brushSize_radius")
		},
		image:
		{
			rotation: document.getElementById("toolbar_slider_image_rotation")
		}
	},
	input:
	{
		chatMessage: document.getElementById("chatbox_input_message")
	},
	text:
	{
		usersOnline: document.getElementById("text_users_online")
	},
	checkbox:
	{
		allowTint: document.getElementById("toolbar_check_allowtint")
	}
};

var settings =
{
	darkMode: false,
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
		x: "0.1", y: "0.1", radius: "0.05"
	},
	image:
	{
		index: 0,
		rotation: 0,
		allowTint: false
	}
};
