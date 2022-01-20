import UDPserver from './Utilites/UDPserver';
import getSavedRemoteControllers from './Utilites/getSavedRemoteControllers';
import { Device, RCInfo, RemoteController } from './Utilites/interfaces';
import {TV} from './Modules/type_tv';
import {Lightbulb} from './Modules/type_lightBulb';
import {Humidifier} from './Modules/type_humidifier';
import {AirPurifier} from './Modules/type_airPurifier';
import {Switch} from './Modules/type_switch';
import {Fan} from './Modules/type_fan';

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
            let deviceInfo: Device = await UDPserver();
            const remotes: RemoteController[] = await getSavedRemoteControllers(deviceInfo.IP);
            this.log.info('REMOTES:', remotes);
            remotes.forEach( item => {
                switch (item.Type) {
                    case '01': {
                        this.addAccessory('TV', TV, item);
                        break;
                    }
                    case '03': {
                        this.addAccessory('Lightbulb', Lightbulb, item);
                        break;
                    }
                    case '04': {
                        this.addAccessory('Humidifier', Humidifier, item);
                        break;
                    }
                    case '05': {
                        this.addAccessory('Air Purifier', AirPurifier, item);
                        break;
                    }
                    case '06': {
                        this.addAccessory('Switch', Switch, item);
                        break;
                    }
                    case '07': {
                        this.addAccessory('Fan', Fan, item);
                        break;
                    }
                    default:
                        break;
                }
            });
        });
    }

    addAccessory(accessoryName: string,
                 accessory:
                     typeof TV |
                     typeof Lightbulb |
                     typeof Humidifier |
                     typeof AirPurifier |
                     typeof Switch |
                     typeof Fan,
                 item: RemoteController): void {
        const accUUID = this.api.hap.uuid.generate(`${item.UUID}`);
        const existingAccessory: PlatformAccessory = this.myAccessories.find(accessory => accessory.UUID === accUUID)!;
        if (existingAccessory) {
            new accessory(this, existingAccessory);
        } else {
            const newAccessory: PlatformAccessory = new this.api.platformAccessory(`${accessoryName} UUID: ${item.UUID}`, accUUID);
            newAccessory.context.deviceInfo = item.deviceInfo;
            newAccessory.context.IP = item.IP;
            newAccessory.context.name = `${accessoryName} UUID: ${item.UUID}`;
            newAccessory.context.UUID = item.UUID;
            new accessory(this, newAccessory);
            this.configureAccessory(newAccessory);
            this.api.registerPlatformAccessories('homebridge-remote-ir-test', `${this.config.name}`, [newAccessory]);

        }
    }

    configureAccessory(accessory: PlatformAccessory): void {
        this.myAccessories.push(accessory);
    }
}
