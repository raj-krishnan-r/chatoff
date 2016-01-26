function $id(id)
{
	return document.getElementById(id);
}
function searchFor()
{
if($id('connectWith').value!='')
{
socket.emit('find',$id('connectWith').value);
}
else
{

}
}
function playWith(id,name)
{
var strings = "{\"socketid\":\""+socket.id+"\",\"rid\":\""+id+"\",\"myname\":\""+$id('username').innerHTML+"\"}";
var span = document.createElement('span');
span.innerHTML=" Request is sent and waiting for <b>"+name+"</b> to accept... ";
span.setAttribute('id','request-'+id);
	$id('results').innerHTML="";
	$id('results').appendChild(span);
	socket.emit('outgoingRequest',strings);

}


function cancelRequest(ob)
{
	
		var strings = "{\"socketid\":\""+ob.dataset.id+"\",\"rid\":\""+ob.dataset.rid+"\"}";
	console.log(strings);
	socket.emit('noChat',strings);
	$id('notification').innerHTML="";
}
function responseRequest(ob)
{
var strings = "{\"socketid\":\""+ob.dataset.id+"\",\"rid\":\""+ob.dataset.rid+"\",\"myname\":\""+$id('username').innerHTML+"\"}";
socket.emit('yesChat',strings);
$id('notification').innerHTML='';
var infoBar = document.createElement('div');
infoBar.innerHTML=ob.dataset.name;
infoBar.setAttribute('class','recipientinfo');
infoBar.setAttribute('id','infobar-'+ob.dataset.rid);
var typespace = document.createElement('div');
var msgSpace = document.createElement('div');
var status = document.createElement('div');
status.setAttribute('class','status');
status.setAttribute('id','status-'+ob.dataset.rid);
msgSpace.setAttribute('id',ob.dataset.rid);
msgSpace.setAttribute('class','msgSpace');
typespace.setAttribute('class','typeArea');
typespace.addEventListener('keyup',function(e){
	var strings = "{\"rid\":\""+this.dataset.rid+"\",\"message\":\""+this.innerHTML+"\",\"senderid\":\""+this.dataset.socketid+"\"}";
	if(this.innerHTML.length>2)
	{
			var tem = "{\"rid\":\""+this.dataset.rid+"\",\"senderid\":\""+this.dataset.socketid+"\"}";
				socket.emit('typing',tem);
	}
	if(e.keyCode==13)
	{
		socket.emit('transferMsg',strings);
		var msg = document.createElement('div');
		msg.setAttribute('class','self');
		msg.innerHTML=this.innerHTML;
		$id(this.dataset.rid).appendChild(msg);
		this.innerHTML="";
		$id(this.dataset.rid).scrollTop=$id(this.dataset.rid).scrollHeight;
		
	}
});

typespace.setAttribute('data-placeholder','Type here...');
typespace.setAttribute("data-rid",""+ob.dataset.rid+"");
typespace.setAttribute("data-socketid",""+ob.dataset.id+"");
typespace.setAttribute('contenteditable','true');
var ele = document.createElement('div');
ele.appendChild(infoBar);
ele.setAttribute('class','each');
ele.appendChild(msgSpace);
ele.appendChild(typespace);
ele.appendChild(status);
$id('chatRack').appendChild(ele);
//typespace.style.bottom=ele.getBoundingClientRect().bottom+'px';
	$id('notification').innerHTML="";
}
function acceptRequest(ob)
{
	$id('results').innerHTML="";
var infoBar = document.createElement('div');
infoBar.innerHTML=ob.myname;
infoBar.setAttribute('class','recipientinfo');
infoBar.setAttribute('id','infobar-'+ob.socketid);
var typespace = document.createElement('div');
var msgSpace = document.createElement('div');
var status = document.createElement('div');
status.setAttribute('class','status');
status.setAttribute('id','status-'+ob.socketid);
msgSpace.setAttribute('class','msgSpace');
msgSpace.setAttribute('id',ob.socketid);
typespace.setAttribute('class','typeArea');

typespace.addEventListener('keyup',function(e){
	if(this.innerHTML.length>2)
	{
	var tem = "{\"senderid\":\""+this.dataset.rid+"\",\"rid\":\""+this.dataset.socketid+"\"}";
	socket.emit('typing',tem);
	}
	var strings = "{\"senderid\":\""+this.dataset.rid+"\",\"message\":\""+this.innerHTML+"\",\"rid\":\""+this.dataset.socketid+"\"}";
	if(e.keyCode==13)
	{
		var msg = document.createElement('div');
		msg.setAttribute('class','self');
		msg.innerHTML=this.innerHTML;
		$id(this.dataset.socketid).appendChild(msg);
				//$id(this.dataset.socketid).innerHTML+="<div class=\"self\">"+this.innerHTML+"<div>";
				socket.emit('transferMsg',strings);
						this.innerHTML="";
								$id(this.dataset.socketid).scrollTop=$id(this.dataset.socketid).scrollHeight;
	}
});
typespace.setAttribute('data-placeholder','Type here...');
typespace.setAttribute("data-rid",""+ob.rid+"");
typespace.setAttribute("data-socketid",""+ob.socketid+"");
typespace.setAttribute('contenteditable','true');
var ele = document.createElement('div');
ele.appendChild(infoBar);
ele.setAttribute('class','each');
ele.appendChild(msgSpace);
ele.appendChild(typespace);
ele.appendChild(status);
$id('chatRack').appendChild(ele);
console.log(ele.getBoundingClientRect().bottom+'px');
//typespace.style.bottom=ele.getBoundingClientRect().bottom+'px';
}