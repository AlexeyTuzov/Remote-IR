const httpRequest: any = require('../Utilites/httpRequest.js');
import {Service, PlatformAccessory} from 'homebridge';
import {Platform} from '../index.js';

export class Fan {

    protected readonly service: Service;
    private readonly currentActiveStatus: boolean;
    private readonly currentSwing: number;
    private readonly currentSpeed: number;
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
        this.currentSwing = 0;
        this.currentSpeed = 0;
        this.name = this.accessory.context.name;
        this.IP = this.accessory.context.IP;
        this.uuid = this.accessory.context.UUID;
        this.path = `/commands/ir/localremote/${this.uuid}`;
        this.command = '';
        this.msg = '';

        this.service = this.accessory.getService(this.platform.Service.Fanv2) || this.accessory.addService(this.platform.Service.Fanv2);

        this.service.getCharacteristic(this.platform.Characteristic.Active)!
            .onGet(this.onGetActive.bind(this))
            .onSet(this.onSetActive.bind(this));

        this.service.getCharacteristic(this.platform.Characteristic.SwingMode)!
            .onGet(this.onGetSwingMode.bind(this))
            .onSet(this.onSetSwingMode.bind(this));

        this.service.getCharacteristic(this.platform.Characteristic.RotationSpeed)!
            .onGet(this.onGetSpeed.bind(this))
            .onSet(this.onSetSpeed.bind(this));
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

    onGetSwingMode () {
        return this.platform.Characteristic.SwingMode.SWING_DISABLED;
    }

    onSetSwingMode (value: any) {
        this.command = '0AFF';
        this.msg = 'Swing mode';
        httpRequest(this.IP, `${this.path}${this.command}`, value, this.currentSwing, this.msg);
        return this.currentSwing;
    }

    onGetSpeed () {
        return this.currentSpeed;
    }

    onSetSpeed (value: any) {
        this.command = '0BFF';
        this.msg = 'Rotation speed';
        httpRequest(this.IP, `${this.path}${this.command}`, value, this.currentSpeed, this.msg);
        return this.currentSpeed;
    }
}