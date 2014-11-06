var idUser = 0;

exports.socket = function(socket) {

	socket.username = idUser.toString();
	console.log('User ' + idUser++ + ' connected');
	var address = socket.handshake.address;
	console.log("New connection from " + address);
	socket.on('message', function (message) {
		console.log(message);
	});
}
