var net= require('net');


var lst= new LIST_ROOM();
function policy()
{
	var xml = '<?xml version="1.0"?>\n<!DOCTYPE cross-domain-policy SYSTEM'
          + ' "http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd">\n<cross-domain-policy>\n';
 
  xml += '<allow-access-from domain="*" to-ports="*"/>\n';
  xml += '</cross-domain-policy>\n';
  
  return xml;
}
var i=0;
server= net.createServer(function(socket)
{
	console.log("da connect")
	socket.setEncoding('utf8');
	socket.write(policy() +'\0');
	arrSocket.push(socket);
	
	socket.on('data',function(data){
		
		//socket.write(data);
			var string   = data.replace('\u0000', '').replace('u0000', '').replace(' ', '');
			var obj=JSON.parse(string);
			
			if(obj.Room=='true')
			{
				switch(obj.type)
				{
					case 'CREATE_ROOM':
						lst.create_room(socket,obj.room_name);
						console.log('da tao room');
						break;
					case 'JOIN_ROOM':
						lst.join_room(obj.room_name,socket);
						break;
					case 'MESSAGE':
						lst.message_room(obj.room_name,obj.message,socket);
						break;
					case 'GET_LIST_ROOM':
						lst.getListRoom(socket);
						break;
					
				}
					
			}
			else
			{
				switch(obj.handle)
				{
					case 'CREATE_NAME':
						socket._name=obj.message.name;
						socket.write(JSON.stringify({'Room':'false','type':'CREATE_NAME','paramas':'true'}) +'\0');
						break;
				}
			}
			

		});
	socket.on('close',function()
	{
		arrSocket.splice(arrSocket.indexOf(socket),1);
		console.log(arrSocket.length);
	});

	
	

		
	

});
server.listen(8000);
var arrSocket=[];

function broadcast(socket,message,_all)
{
	
	arrSocket.forEach(function(sk){
		if(_all==false &&sk!=socket)
		{
			sk.write(message);
		}
		else
		{
			sk.write(message);
		}
		
		});
}


//-----------------------------------------------------------------
function ROOM()
{
	this.ID;
	this.name;
	this.arrayRoom=[];
}
ROOM.prototype.createRoom= function(_ID,_name,socket)
{
	this.ID=_ID;
	this.name=_name;
	this.arrayRoom.push(socket);
	
	
}
ROOM.prototype.joinRoom= function(socket)
{
	this.arrayRoom.push(socket);
	this.arrayRoom.forEach(function(sk)
	{
		if(sk!=socket)
		{
			sk.write("Ban Moi Vao Room ne")
		}
	});
	
}
ROOM.prototype.sendRoom= function(message,socket)
{
	this.arrayRoom.forEach(function(sk)
	{
		if(sk!=socket)
		{
			sk.write(message)
		}
	});
}
//--------------------------------------

function LIST_ROOM()
{
	this.list_room=[];
	
}

LIST_ROOM.prototype.create_room= function(socket,name)
{
	
	var Room= new ROOM();
	Room.createRoom(i,name,socket);
	this.list_room.push(Room);
	broadcast(socket,(JSON.stringify({'Room':'true','type':'ADD_ROOM','params':{'room_ID':i,'room_name':name,'number':1}}) +'\0'),true);
	i++;
}

LIST_ROOM.prototype.join_room= function(room_name,socket)
{
	this.list_room.forEach(function(_room){
		
		if(_room.name==room_name)
		{
			_room.joinRoom(socket);
		}
		
		});
	console.log('da join room');
}
LIST_ROOM.prototype.message_room= function(room_name,message,socket)
{
		this.list_room.forEach(function(_room){
		
		if(_room.name==room_name)
		{
			_room.sendRoom(message,socket);
		}
		s
	});
}

LIST_ROOM.prototype.getListRoom= function(socket)
{
	var array_list_room=[];
	
	this.list_room.forEach(function(_room){
		
		array_list_room.push({room_ID:_room.ID,room_name:_room.name,number:_room.arrayRoom.length});
		
	});	
	socket.write(JSON.stringify({'Room':true,'type':'LIST_ROOM','paramas':array_list_room}) +'\0');
	console.log(JSON.stringify(array_list_room) +'\0');
}

//------------------------------------------------------- 