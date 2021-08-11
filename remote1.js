const dgram = require('dgram');
const client = dgram.createSocket({type: 'udp4', reuseAddr: true});

const PORT = 61201;
const ID = 'AA45B78C';
const RCType = '0x81';
const onBatteries = '1';
const IP = '192.154.11.8';
const AutoVer = '0000';
const StorageVer = '000';

const Response = 'LOOK.in:Alive!' + ID + ':' + parseInt(RCType, 16) + ':'+ onBatteries + ':' + IP + ':' + AutoVer + ':' + StorageVer;

//const discover = 'LOOK.in:Discover!';

client.on('error', (err) => {
    console.log('error block', err);
});

client.on('listening', () => {
    console.log('sending initial answer \'alive!\' ');
    client.send(Buffer.from(Response), PORT, (err) => {
        console.log('error while initial answer being sent!', err);
    })
})

client.on('message', (msg, rinfo) => {
    if (msg.toString() === 'LOOK.in.Discover!') {
        client.send(Buffer.from(Response), PORT, (err) => {
            console.log('error while sending answer', err);
        });
    }
})

//client.send(Buffer.from(discover), PORT);
client.bind(PORT);



