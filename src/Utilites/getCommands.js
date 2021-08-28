const http = require('http');

const getCommands = (IP, UUID) => {

    return new Promise((resolve, reject) => {
        http.get({host: IP, path: `/data/${UUID}`}, res => {
            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        }).on('error', err => {
            reject(console.error('Something is gone wrong getting commands!', err.stack));
        });
    });
};


module.exports = getCommands;

