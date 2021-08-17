const httpRequest: any = require('../Utilites/httpRequest.js');
import {Service, PlatformAccessory} from 'homebridge';
import {Platform} from '../index.js';

export class Humidifier {

    protected readonly service: Service;
    private readonly currentActiveStatus: boolean;
    private readonly currentHDstate: number;
    private readonly name: string;
    private readonly IP: string;
    private readonly uuid: string;
    private readonly path: string;
    private command: string;
    private msg: string;

    constructor(
        private readonly platform: Platform,
        private readonly accessory: PlatformAccessory
    ) {

        this.currentActiveStatus = false;
        this.currentHDstate = 0;
        this.name = this.accessory.context.name;
        this.IP = this.accessory.context.IP;
        this.uuid = this.accessory.context.UUID;
        this.path = `/commands/ir/localremote/${this.uuid}`;
        this.command = '';
        this.msg = '';

        this.service = this.accessory.getService(this.platform.Service.HumidifierDehumidifier) || this.accessory.addService(this.platform.Service.HumidifierDehumidifier);

        this.service.getCharacteristic(this.platform.Characteristic.Active)!
            .onGet(this.onGetActive.bind(this))
            .onSet(this.onSetActive.bind(this));

        this.service.getCharacteristic(this.platform.Characteristic.CurrentHumidifierDehumidifierState)!
            .onGet(this.onGetHDState.bind(this));

        this.service.getCharacteristic(this.platform.Characteristic.TargetHumidifierDehumidifierState)!
            .onGet(this.onGetTargetState.bind(this))
            .onSet(this.onSetTargetState.bind(this));
    }

    getServices() {
        return [this.service];
    }

    onGetActive() {
        return this.currentActiveStatus;
    }

    onSetActive(value: any) {
        this.command = value ? '03FF' : '02FF';
        this.msg = 'Power state';
        httpRequest(this.IP, `${this.path}${this.command}`, value, this.currentActiveStatus, this.msg);
        return this.currentActiveStatus;
    }

    onGetHDState () {
        return this.platform.Characteristic.CurrentHumidifierDehumidifierState.INACTIVE;
    }

    onGetTargetState () {
        console.log(`Target H-D Mode: ${this.platform.Characteristic.TargetHumidifierDehumidifierState.HUMIDIFIER_OR_DEHUMIDIFIER}`);
        return this.platform.Characteristic.TargetHumidifierDehumidifierState.HUMIDIFIER_OR_DEHUMIDIFIER;
    }

    onSetTargetState (value: any) {
        this.command = '04FF';
        this.msg = 'Humidifier-Dehumidifier mode';
        httpRequest(this.IP, this.path, value, this.currentHDstate, this.msg);
        return this.currentHDstate;
    }

}