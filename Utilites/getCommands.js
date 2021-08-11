const http = require('http');

const getCommands = async (IP, UUID) => {

    let query = new Promise((resolve, reject) => {
        http.get({host: IP, path: `/data/${UUID}`}, res => {
            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        }).on('error', err => {
            reject(console.error('Something is gone wrong!', err.stack));
        });
    });

    return await query;
}

module.exports = getCommands;

