const Websocket = require('ws');

const P2P_PORT = process.env. P2P_PORT ||5001;
const peers = process.env.PEERS ? process.env.PEERS.split(','): [];

class P2pServer{
    constructor(blockchain){
        this.blockchain  = blockchain;
        this.sockets = [];

    }
    listen(){
        const server = new Websocket.Server({port: P2P_PORT });
        server.on('connection', socket=>this.connectSocket(socket));
        this.connnectToPeers();
        console.log(`Listening to peer-to-peer connections on ${P2P_PORT}`); 


    }
    connnectToPeers(){
        peers.forEach(peer => {
            //ws://localhost:5001
            const socket = new Websocket(peer);
            socket.on('open', ()=>this.connectSocket(socket));
        });
    }
    connectSocket(socket){
        this.sockets.push(socket);
        console.log('Socket connected');
        this.messageHandler(socket);
        socket.send(JSON.stringify(this.blockchain.chain));

    }
    messageHandler(socket){
        socket.on('message',message=>{
            const data = JSON.parse(message);
        
            this.blockchain.replaceChain(data);



        });
    }
}
module.exports= P2pServer; 