const server: any = require ('./server');
import {Lightbulb} from './Modules/type_03.js';
import {Humidifier} from './Modules/type_04.js';
import {AirPurifier} from './Modules/type_05.js';
import {Switch} from './Modules/type_06.js';
import {Fan} from './Modules/type_07.js';

import {
    DynamicPlatformPlugin,
    PlatformAccessory,
    API,
    Service,
    Characteristic,
    Logger,
    PlatformConfig
} from 'homebridge';

module.exports = (api: any) => {

    api.registerPlatform('homebridge-remote-ir-test', "Platform", Platform);
}

interface Remote {
    Type: string;
    UUID: string;
    Updated: number;
    IP: string
}

async function getSavedRemotes() {
    const info: any = await server();
    let remotes: Remote[] = [];
    if (info instanceof Array) {
        info.forEach(item => {
            remotes.push(...item.savedRC);
        });
    }
    return remotes;
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
        this.Characteristic = this.api.hap.Characteristic;

        this.api.on('didFinishLaunching', async () => {
            const remotes: Remote[] = await getSavedRemotes();
            this.log.info('REMOTES:', remotes);
            remotes.forEach(item => {
                switch (item.Type) {
                    case '03': {
                        const accUUID = api.hap.uuid.generate(`${item.UUID}`);
                        const existingAccessory: PlatformAccessory = this.myAccessories.find( accessory => accessory.UUID === accUUID)!;
                        if (existingAccessory) {
                            new Lightbulb(this, existingAccessory);
                        } else {
                            const accessory: PlatformAccessory = new this.api.platformAccessory(`Lightbulb UUID: ${item.UUID}`, accUUID);
                            accessory.context.IP = item.IP;
                            accessory.context.name = `Lightbulb UUID: ${item.UUID}`;
                            accessory.context.UUID = item.UUID;
                            new Lightbulb(this, accessory);
                            this.api.registerPlatformAccessories('homebridge-remote-ir-test', `${this.config.name}`, [accessory]);
                        }
                        break;
                    }
                    case '04': {
                        const accUUID = api.hap.uuid.generate(`${item.UUID}`);
                        const existingAccessory: PlatformAccessory = this.myAccessories.find( accessory => accessory.UUID === accUUID)!;
                        if (existingAccessory) {
                            new Humidifier(this, existingAccessory);
                        } else {
                            const accessory: PlatformAccessory = new this.api.platformAccessory(`Humidifier UUID: ${item.UUID}`, accUUID);
                            accessory.context.IP = item.IP;
                            accessory.context.name = `Humidifier UUID: ${item.UUID}`;
                            accessory.context.UUID = item.UUID;
                            new Humidifier(this, accessory);
                            this.configureAccessory(accessory);
                            this.api.registerPlatformAccessories('homebridge-remote-ir-test', `${this.config.name}`, [accessory]);
                        }
                        break;
                    }
                    case '05': {
                        const accUUID = api.hap.uuid.generate(`${item.UUID}`);
                        const existingAccessory: PlatformAccessory = this.myAccessories.find( accessory => accessory.UUID === accUUID)!;
                        if (existingAccessory) {
                            new AirPurifier(this, existingAccessory);
                        } else {
                            const accessory: PlatformAccessory = new this.api.platformAccessory(`Air Purifier UUID: ${item.UUID}`, accUUID);
                            accessory.context.IP = item.IP;
                            accessory.context.name = `Air Purifier UUID: ${item.UUID}`;
                            accessory.context.UUID = item.UUID;
                            new AirPurifier(this, accessory);
                            this.configureAccessory(accessory);
                            this.api.registerPlatformAccessories('homebridge-remote-ir-test', `${this.config.name}`, [accessory]);
                        }
                        break;
                    }
                    case '06': {
                        const accUUID = api.hap.uuid.generate(`${item.UUID}`);
                        const existingAccessory: PlatformAccessory = this.myAccessories.find( accessory => accessory.UUID === accUUID)!;
                        if (existingAccessory) {
                            new Switch(this, existingAccessory);
                        } else {
                            const accessory: PlatformAccessory = new this.api.platformAccessory(`Switch UUID: ${item.UUID}`, accUUID);
                            accessory.context.IP = item.IP;
                            accessory.context.name = `Switch UUID: ${item.UUID}`;
                            accessory.context.UUID = item.UUID;
                            new Switch(this, accessory);
                            this.configureAccessory(accessory);
                            this.api.registerPlatformAccessories('homebridge-remote-ir-test', `${this.config.name}`, [accessory]);
                        }
                        break;
                    }
                    case '07': {
                        const accUUID = api.hap.uuid.generate(`${item.UUID}`);
                        const existingAccessory: PlatformAccessory = this.myAccessories.find( accessory => accessory.UUID === accUUID)!;
                        if (existingAccessory) {
                            new Fan(this, existingAccessory);
                        } else {
                            const accessory: PlatformAccessory = new this.api.platformAccessory(`Fan UUID: ${item.UUID}`, accUUID);
                            accessory.context.IP = item.IP;
                            accessory.context.name = `Fan UUID: ${item.UUID}`;
                            accessory.context.UUID = item.UUID;
                            new Fan(this, accessory);
                            this.configureAccessory(accessory);
                            this.api.registerPlatformAccessories('homebridge-remote-ir-test', `${this.config.name}`, [accessory]);
                        }
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