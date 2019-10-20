const WebSocketServer = require('ws').Server;
const server = new WebSocketServer({ port: 9090 });

let connections = [];

server.on('connection', socket => {
    console.log('new connection');
    connections.push(socket);

    socket.on('message', messageData => {
        console.log('==========');
        console.log('new message');

        const message = JSON.parse(messageData);
        let connectionsToSend = connections;

        if (message.type === 'typing') {
            connectionsToSend = connectionsToSend.filter(current => {
                return current !== socket;
            });
        } else if (message.type === 'hello') {
            socket.userName = message.data.name;
        }

        message.from = socket.userName;
        messageData = JSON.stringify(message);

        connectionsToSend.forEach(connection => {
            console.log('sending data to client');

            connection.send(messageData, error => {
                if (error) {
                    connections = connections.filter(current => {
                        return current !== connection;
                    });

                    console.log('close connection');
                }
            });
        });

        console.log('==========');
    });
    socket.on('close', () => {
        connections = connections.filter(current => {
            return current !== socket;
        });

        console.log('close connection');
    });
});