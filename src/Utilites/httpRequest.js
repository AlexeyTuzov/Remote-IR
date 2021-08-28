const http = require('http');

const httpRequest = (IP, path, value, msg) => {

    return new Promise((resolve, reject) => {

        http.get({host: IP, path: path}, res => {
            res.on('data', () =>{});
            res.on('end', () => {
                console.log(`${msg} requested to change state to ${value} with status code `, res.statusCode);
                resolve(value);
            });
        })
            .on('error', err => {
                console.log(`Http request has been failed to change parameter: ${msg}`);
                reject(console.log('Error that occurred:', err.stack));
            });
    });

}

module.exports = httpRequest;