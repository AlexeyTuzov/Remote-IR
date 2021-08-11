function parseRemotesAnswer(payload) {

    let result = [];
    while (true) {
        let position = payload.indexOf(':');
        if (payload.indexOf(':') === -1) {
            result.push(payload.toString());
            return result;
        } else {
            let add = payload.slice(0, position);
            payload = payload.slice(position + 1);
            result.push(add.toString());
            parseRemotesAnswer(payload);
        }
    }
}

module.exports = parseRemotesAnswer;