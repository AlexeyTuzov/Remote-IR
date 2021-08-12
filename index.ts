const server = require('./server.js');
const http = require('http');
const Switch = require('./Modules/type_03.js');
const Humidifier = require('./Modules/type_04.js');
const AirPurifier = require('./Modules/type_05.js');
const Fan = require('./Modules/type_07.js');

import {DynamicPlatformPlugin, PlatformAccessory, API, Service, Characteristic, Logger, PlatformConfig} from 'homebridge';

async function getSavedRemotes () {
    const info = await server();
    const remotes = [];
    if (info instanceof Array) {
        info.forEach(item => {
            remotes.push(...item.savedRC);
        });
    }
    return remotes;


}

module.exports = (api) => {
    api.registerPlatform('homebridge-remote-ir-test', "Platform", Platform);
}

export class Platform implements DynamicPlatformPlugin{
    constructor (
        public readonly log: Logger,
        public readonly config: PlatformConfig,
        public readonly api: API,
        private myAccessories: [])
        {
        
        this.config = config;
        this.api = api;
        this.myAccessories = [];

        this.api.on('didFinishLaunching', async () => {
        const remotes = await getSavedRemotes();
        this.log.info('REMOTES:', remotes);
            remotes.forEach(item => {
                switch (item.Type) {
                    case '03': {
                        const accUUID = api.hap.uuid.generate(`item.UUID`);
                        const accessory = new this.api.platformAccessory(`Lightbulb UUID: ${item.UUID}`, accUUID);
                        const CLassAcc3 = require('./Modules/type_03.js');
                        new CLassAcc3(item.IP, `Lightbulb UUID: ${item.UUID}`, item.UUID, this.api, accessory);
                        this.api.registerPlatformAccessories('homebridge-remote-ir-test', `${this.config.name}`, [accessory]);
                        break;
                    }
                    default: break;
                }
            });
        });
    }
    configureAccessory (accessory: PlatformAccessory) {
        this.myAccessories.push(accessory);
    }

    accessory () {
       return this.myAccessories;
    }
}