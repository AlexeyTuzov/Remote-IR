module.exports = async () => {
    const dgram = require('dgram');
    const server = dgram.createSocket({type: 'udp4', reuseAddr: true});
    const parseRemotesAnswer = require('./Utilites/parseRemotesAnswer.js');
    const getRemoteControllers = require('./Utilites/getRemoteControllers.js');
    const getCommands = require('./Utilites/getCommands.js');
    const PORT = 61201;
    const discover = 'LOOK.in:Discover!';
    const ALIVE = 'LOOK.in:Alive!';
    const IP = '255.255.255.255';
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
                        device.savedRC.forEach( item => {
                            item.IP = device.IP;
                        });
                        for await (let item of device.savedRC) {
                            if (item.Type === '01') {
                                item.deviceInfo = JSON.parse( await getCommands(item.IP, item.UUID));
                            }
                        }
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
