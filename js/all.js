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
function playWith(id)
{
	$id('results').innerHTML="connecting with "+id+"...";
	socket.emit('outgoingRequest',id);
}
