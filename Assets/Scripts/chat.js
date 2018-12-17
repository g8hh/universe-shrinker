function sendChatMessage(message)
{
	if(message.length > 0)
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
	messageDiv.innerHTML = "<span class='name'>" + messageObject.sender + "</span><br/>" +
							messageObject.message + "<br/>" +
							"<span  class='time'>" + TimeFormatter.format(messageObject.time) + "<span>";
	nodes.container.chatboxMessages.scrollTop += nodes.container.chatboxMessages.clientHeight;
}

function validateChatMessage(message)
{
	message = message.match(/[a-z|A-Z|0-9|?!., ]*/g).join("");
	if(message.length > 100)
	{
		message = message.substring(0, 100);
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