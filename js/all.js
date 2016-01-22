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
