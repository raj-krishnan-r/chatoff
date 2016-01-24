var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');

app.listen(8080,function()
	{console.log('Server Up at port 8080');}
		);

//Connection Requisites
var host = process.env.OPENSHIFT_MYSQL_DB_HOST || 'localhost';
var user = process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'root';
var pass = process.env.OPENSHIFT_MYSQL_DB_PASSWORD || 'dbase001';
var connection = mysql.createConnection({
  host     : host,
  user     : user,
  password : pass,
    database : 'bingo'
});
connection.connect();
//Rooms Objects
var item= Array();
var people = function(id,email,name)
{
  this.id = id;
  this.email=email;
  this.name=name;
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
forwardFile=__dirname+'/start.html';
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
    socket.on('disconnect',function(socket){
var index=0;
var flag=0;
while(item[index]!=null)
{
    if(item[index].id==socket.id)
    {
        item[index].id='';
       item[index].name='';
    }
    index++;
}

});
console.log('Client Connected');
socket.on('msg',function(data){
	io.to(data.rid).emit('incoming',data.msg);
});
socket.on('username',function(data){
var thing = new people(socket.id,data);
item.push(thing);
console.log('Registered user with id :'+socket.id+' and username '+data);
});
socket.on('package',function(data){
var len = item.length;
for(var j = 0;j<len;j++)
console.log(item[j].id+' : '+item[j].username);
});

//Code for account Creation
socket.on('CreateAccData',function(msg)
{

    var qString = "insert into userAccounts values(0,'"+msg[0]+"','"+msg[1]+"','"+msg[2]+"')";
    connection.query(qString,function(e,r,f)
        {
           if(e)
           {
               //throw e;
      socket.emit('CreateAccData','failed');
           }
           else
           {
               socket.emit('CreateAccData','done');
           }
        });

});

//Code for account existence check
 socket.on('checkAcc',function(msg)
{
    var qString = "select * from userAccounts where email = '"+msg[0]+"' and password = '"+msg[1]+"'";
    connection.query(qString,function(e,r,f)
        {
           if(e)
           {
               //throw e;
           }
           else
           {
               if(r.length==1){
                   var thing = new people(socket.id,r[0].email);
item.push(thing);
console.log('Registered user with id :'+socket.id+' and email '+r[0].email);
              socket.username=r[0].id;
             socket.emit('AccExistence',true);
             socket.emit('goto','landing.html');

			   }
           else
               socket.emit('AccExistence',false);

           }
        });

});
socket.on('find',function(data){

var index=0;
var flag=0;
while(item[index]!=null)
{
    if(item[index].email==data)
    {
        var template = '{"id":"'+item[index].id+'","email":"'+item[index].email+'" }';
        socket.emit('activePeople',template);
        flag=1;
        return;
    }
    index++;
}
if(!flag){
         var template = '{"id":0}';
        socket.emit('activePeople',template);}
});
socket.on('outgoingRequest',function(data){
    
   	io.to(data).emit('incomingRequest','req');
});
});