module.exports = async () => {
    const dgram = require('dgram');
    const server = dgram.createSocket({type: 'udp4', reuseAddr: true});
    const parseRemotesAnswer = require('./Utilites/parseRemotesAnswer.js');
    const getRemoteControllers = require('./Utilites/getRemoteControllers.js');
    const getAllCommands = require('./Utilites/getAllCommands.js');
    const PORT = 61201;
    const discover = 'LOOK.in:Discover!';
    const ALIVE = 'LOOK.in:Alive!';
    const IP = '192.168.100.2';
    const devicesArray = [];

    return await new Promise((resolve, reject) => {
        server.on('error', (err) => {
            reject(console.log('server error!', err.message));
        })

        server.on('message', async (msg, rinfo) => {
                console.log(`MESSAGE from remote: ${msg}`);
                console.log(`from ${rinfo.address}:${rinfo.port}`);

                if (msg.includes(ALIVE)) {
                    let alivePayload = msg.toString().slice(ALIVE.length);

                    let info = parseRemotesAnswer(alivePayload);
                    let device = {
                        ID: info[0],
                        type: info[1],
                        onBatteries: info[2],
                        IP: info[3],
                        autoVersion: info[4],
                        storageVersion: info[5]
                    };

                    let savedRemoteControllers = await getRemoteControllers(device.IP);
                    device.savedRC = JSON.parse(savedRemoteControllers);

                    if (device.savedRC instanceof Array) {
                        device.Commands = await getAllCommands(IP, device.savedRC);
                        device.savedRC.forEach( item => {
                            item.IP = device.IP;
                        });
                    }

                    if (!devicesArray.find(item => item.ID === device.ID)) {
                        devicesArray.push(device);
                    }
                    resolve(devicesArray);
                }
            }
        );

        server.bind(PORT, () => {
            console.log(`Server has been started on port ${PORT}`);
            sendDiscoverSignal(discover, PORT);
        });

//in this function IP address is hardcoded! It is needed to be read from Network
        function sendDiscoverSignal(msg, port) {
            server.setBroadcast(true);
            server.send(Buffer.from(msg), port, IP, (err) => {
                if (err) {
                    console.log('Discover signal sending error!', err.message);
                } else {
                    console.log('DISCOVER sent!', msg);
                }
            });
        }

    });

}
