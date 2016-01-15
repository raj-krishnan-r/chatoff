var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
var url = require('url');

app.listen(8080,function()
	{console.log('Server Up at port 8080');}
		);

//Rooms Objects
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
var forwardFile = __dirname+url.parse(req.url).path;	
if(url.parse(req.url).path=='/')
forwardFile=__dirname+'/index.html';
fs.readFile(forwardFile,function(err,data)
//fs.readFile(__dirname+'/index.html',function(err,data)
{

if(err){
res.writeHead(404);
return res.end('Request page is not found.');
}
res.writeHead(200);
res.end(data);
});
}
io.on('connection',function(socket){
console.log('Client Connected');
socket.on('msg',function(data){

	//console.log(data.rid+' : '+data.msg);
	io.to(data.rid).emit('incoming',data.msg);
});
socket.on('username',function(data){
//console.log('Up and Running');
var thing = new people(socket.id,data);
item.push(thing);
console.log('Registered user with id :'+socket.id+' and username '+data);
});
socket.on('package',function(data){
console.log(data);
var len = item.length;
for(var j = 0;j<len;j++)
console.log(item[j].id+' : '+item[j].username);
});
});

