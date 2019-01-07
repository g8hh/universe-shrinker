var emojis = [];

for(let i = Number.parseInt("0x1f600"); i < Number.parseInt("0x1f650"); i++){
	emojis.push("&#x"+i.toString(16)+";");
}
for(let i = Number.parseInt("0x1f910"); i < Number.parseInt("0x1f93f"); i++){
	emojis.push("&#x"+i.toString(16)+";");
}

function sendChatMessage(message)
{
	message = validateChatMessage(message);
	
	if(!(/^( )*$/g.test(message))) //dont send empty messages
	{
		database.ref().child("chatmessages").child(Date.now()).set({
			sender: username,
			time: Date.now(),
			message: message
		});
	}
	
	nodes.input.chatMessage.value = "";
}

function addChatMessage(messageObject) //add to messages div
{
	let messageDiv = nodes.container.chatboxMessages.appendChild(document.createElement("div"));
	messageDiv.classList.add("chatmessage");
	messageDiv.innerHTML = "<span class='name autumn'>" + messageObject.sender + "</span><br/>" +
							messageObject.message + "<br/>" +
							"<span  class='time'>" + TimeFormatter.format(messageObject.time) + "<span>";
	nodes.container.chatboxMessages.scrollTop += nodes.container.chatboxMessages.clientHeight;
}

function validateChatMessage(message)
{
	message = message.match(/([a-z|A-Z|0-9|?!., ])|&#x([\d|a-f]){5};/g);
	message = message !== null ? message.join("") : "";
	
	unicode = message.match(/&#x([\d|a-f]){5};/g);
	
	if(unicode !== null) //validate unicode characters (emojis)
	{
		for(let i = 0; i < unicode.length; i++)
		{
			if(!emojis.includes(unicode[i]))
			{
				message = message.replace(unicode[i], "");
			}
		}
	}
	
	if(message.length > 100)
	{
		message = message.substring(0, Utils.clamp(message.indexOf("&", 100), 100, 110));
	}
	return message;
}

nodes.button.sendChatMessage.onclick = function(e)
{
	sendChatMessage(nodes.input.chatMessage.value);
}

nodes.input.chatMessage.oninput = function(e)
{
	nodes.input.chatMessage.value = validateChatMessage(nodes.input.chatMessage.value);
}

nodes.container.chatbox.onmouseover = function(e)
{
	cursorOnContainer = true;
}

nodes.container.chatbox.onmouseout = function(e)
{
	cursorOnContainer = false;
}

for(let emoji of emojis)
{
	let btn = nodes.container.chatboxEmojis.appendChild(document.createElement("button"));
	btn.innerHTML = emoji;
	btn.className = "emojibutton";
	btn.onclick = function()
	{
		nodes.input.chatMessage.value += emoji;
		validateChatMessage(nodes.input.chatMessage.value);
	}
}