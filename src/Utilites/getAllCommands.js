const getCommands = require('./getCommands.js');

const getAllCommands = async (IP, rcArray) => {

    let result = new Promise(async (resolve, reject) => {

        let summary = [];

        try {
            for (let item of rcArray) {
                let res = await getCommands(IP, item.UUID);
                summary.push(JSON.parse(res));
            }
            resolve(summary);
        } catch (err) {
            console.log('Getting Saved Commands has been failed!', err.message);
            reject(err.message);
        }
    });

    return await result;

}

module.exports = getAllCommands;