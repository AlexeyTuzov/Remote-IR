const http = require('http');

const getRemoteControllers = async (IP) => {

    let query = new Promise((resolve, reject) => {
        http.get({host: IP, path: '/data'}, res => {
            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        }).on('error', err => {
            reject(console.error('something is gone wrong:', err.stack));
        });
    });

    return await query;
}

module.exports = getRemoteControllers;