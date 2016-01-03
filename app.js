var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8080,function()
	{console.log('Server Up at port 8080');}
		);

//Rooms Objectsv
var item= Array();
var people = function(id,username)
{
  this.id = id;
  this.username=username;
};

//Multiplexing
var nsp = io.of('/my');
nsp.on('connection',function(scoket){
	console.log('my route');
});
nsp.emit('hello','emyt');
/*
Declaration of handler function
*/
function handler(req,res)
{
fs.readFile(__dirname+'/index.html',function(err,data)
{
if(err){
res.writeHead(500);
return res.end('Error loading index.html');
}
res.writeHead(200);
res.end(data);
});
}
io.on('connection',function(socket){
console.log('Client Connected');
socket.on('username',function(data){
	console.log(socket.id);
	console.log('Up and Running');
var thing = new people(socket.id,data);
item.push(thing);
});
socket.on('package',function(data){
console.log(data);
var len = item.length;
for(var j = 0;j<len;j++)
console.log(item[j].id+' : '+item[j].username);
});
});

