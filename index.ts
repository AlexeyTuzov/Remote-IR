import * as server from './server.js';
//import * as http from 'http';
import {Lightbulb} from'./Modules/type_03.js';
//const Humidifier = require('./Modules/type_04.js');
//const AirPurifier = require('./Modules/type_05.js');
//const Fan = require('./Modules/type_07.js');

import {
    DynamicPlatformPlugin,
    PlatformAccessory,
    API,
    Service,
    Characteristic,
    Logger,
    PlatformConfig
} from 'homebridge';

async function getSavedRemotes() {
    const info: any = await server();
    const remotes: any[] = [];
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

export class Platform implements DynamicPlatformPlugin {

    public readonly Service: typeof Service = this.api.hap.Service;
    public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

    constructor(
        public readonly log: Logger,
        public readonly config: PlatformConfig,
        public readonly api: API,
        public myAccessories: PlatformAccessory[]
    ) {

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
                        new Lightbulb(item.IP, `Lightbulb UUID: ${item.UUID}`, item.UUID, this.api, accessory);
                        this.api.registerPlatformAccessories('homebridge-remote-ir-test', `${this.config.name}`, [accessory]);
                        break;
                    }
                    default:
                        break;
                }
            });
        });
    }

    configureAccessory(accessory: PlatformAccessory): void {
        this.myAccessories.push(accessory);
    }
}