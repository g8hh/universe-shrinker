var initialShapeLoad = false;

function shapeToJSON(shape)
{
	let savedObject = {};
	
	savedObject.type = shape.type;
	
	savedObject.position = 
	{
		x: shape.position.x.toString(),
		y: shape.position.y.toString()
	};
	
	savedObject.color = shape.color.levels.join(",");
	
	switch(shape.type)
	{
		case ShapeType.Ellipse:
			savedObject.radius = 
			{
				x: shape.radius.x.toString(),
				y: shape.radius.y.toString()
			};
			break;
		case ShapeType.Rectangle:
			savedObject.size = 
			{
				x: shape.size.x.toString(),
				y: shape.size.y.toString()
			};
			break;
		case ShapeType.Line:
			savedObject.width = shape.width.toString();
			savedObject.endPosition =
			{
				x: shape.endPosition.x.toString(),
				y: shape.endPosition.y.toString(),
			};
			break;
		case ShapeType.Text:
			savedObject.size = shape.size.toString();
			savedObject.text = shape.text.toString();
			break;
		case ShapeType.Image:
			savedObject.size = 
			{
				x: shape.size.x.toString(),
				y: shape.size.y.toString()
			};
			savedObject.imageIndex = shape.imageIndex;
			savedObject.rotation = shape.rotation;
			break;
		default:
			break;
	}
	
	return JSON.stringify(savedObject);
}

function shapeFromJSON(string)
{
	colorMode(RGB, 255, 255, 255, 255);
	
	let loadObject = JSON.parse(string);
	
	let shapeType = loadObject.type;
	
	let shapePosition = new Vec2(
		new Decimal(loadObject.position.x),
		new Decimal(loadObject.position.y)
	);
	
	let colors = loadObject.color.split(",");
    let shapeColor = color(Number.parseInt(colors[0]), Number.parseInt(colors[1]), Number.parseInt(colors[2]), Number.parseInt(colors[3]));
		
	colorMode(HSL, 1, 1, 1, 1);

	let size;
	
	switch(shapeType)
	{
		case ShapeType.Ellipse:
			let radius = new Vec2(
				new Decimal(loadObject.radius.x),
				new Decimal(loadObject.radius.y)
			);
			return new EllipseShape(shapePosition, radius, shapeColor);
		case ShapeType.Rectangle:
			size = new Vec2(
				new Decimal(loadObject.size.x),
				new Decimal(loadObject.size.y)
			);
			return new RectangleShape(shapePosition, size, shapeColor);
		case ShapeType.Line:
			let endPosition = new Vec2(
				new Decimal(loadObject.endPosition.x),
				new Decimal(loadObject.endPosition.y)
			);
			let width = new Decimal(loadObject.width);
			return new LineShape(shapePosition, endPosition, width, shapeColor);
		case ShapeType.Text:
			let text = loadObject.text;
			size = new Decimal(loadObject.size);
			return new TextShape(text, shapePosition, size, shapeColor);
		case ShapeType.Image:
			let imageIndex = loadObject.imageIndex;
			size = new Vec2(
				new Decimal(loadObject.size.x),
				new Decimal(loadObject.size.y)
			);
			let rotation = loadObject.rotation;
			return new ImageShape(shapePosition, size, imageIndex, shapeColor, rotation);
		default:
			return null;
	}
	
}

function addShapeToDatabase(shape)
{
	let reference = database.ref("shapes");
	let key = reference.push().key;
	
	let shapeRef = database.ref("shapes/" + key);
	
	shapeRef.set(shapeToJSON(shape));
}

function syncDatabase()
{
	let time = Date.now();
	
	database.ref("shapes").on("child_added", function(snapshot)
	{
		let value = snapshot.val();
		
		loadShape(shapeFromJSON(value));
	});
	
	//set user data
	database.ref("users").on("value", function(snapshot)
	{
		userData = snapshot.val();
		
		userNames = Object.getOwnPropertyNames(userData);
		
		if(userNames.length > 0)
		{
			for(user of userNames)
			{
				if(userData[user].timeStamp + 25000 < Date.now()) //25 seconds timeout -> deletion
				{
					database.ref("users/" + user).remove();
				}
			}
		}
		
	});
	
	database.ref("users").on("value", function(snapshot)
	{
		userNames = Object.getOwnPropertyNames(snapshot.val());
	});
	
	database.ref("chatmessages").on("value", function(snapshot){
		if(Object.getOwnPropertyNames(snapshot.val()).length > 50)
		{
			database.ref("chatmessages/" + Object.getOwnPropertyNames(snapshot.val())[0]).remove();
		}
	});
	
	database.ref("chatmessages").on("child_added", function(snapshot){
		addChatMessage(snapshot.val());
	});
}