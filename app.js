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
              socket.username=r[0].id;
               console.log(socket.username);
             socket.emit('AccExistence',true);
			   socket.emit('goto','landing.html');
			   }
           else
               socket.emit('AccExistence',false);

           }
        });

});

});