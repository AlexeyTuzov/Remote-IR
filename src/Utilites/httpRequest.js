const http = require('http');

const httpRequest = (IP, path, value, parameter, msg) => {
    http.get({host: IP, path: path})
        .on('error', err => {
            console.log(`Http request has been failed to change parameter: ${msg}`);
            console.log('Error that occurred:', err.stack);
        })
        .on('finish', () => {
            parameter = value;
            console.log(`${msg} has been changed to: ${value}`);
        });
}

module.exports = httpRequest;