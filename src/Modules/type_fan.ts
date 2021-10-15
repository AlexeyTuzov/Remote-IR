const httpRequest: any = require('../Utilites/httpRequest.js');
import getPowerSwitchCommand from "../Utilites/getPowerSwitchCommand.js";
import {Service, PlatformAccessory} from 'homebridge';
import {Platform} from '../index.js';
import {Functions} from "../index.js";

export class Fan {

    protected readonly service: Service;
    private currentActiveStatus: boolean;
    private currentSwing: number;
    private currentSpeed: number;
    private readonly name: string;
    private readonly IP: string;
    private readonly uuid: string;
    private readonly functions: Functions [];
    private readonly path: string;
    private command: string;
    private msg: string;

    constructor(
        private readonly platform: Platform,
        private readonly accessory: PlatformAccessory
    ) {
        this.functions = this.accessory.context.deviceInfo.Functions;
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
        this.command = getPowerSwitchCommand(value, this.functions);
        this.msg = 'Power state';
        this.currentActiveStatus = httpRequest(this.IP, `${this.path}${this.command}`, value, this.msg);
    }

    onGetSwingMode () {
        return this.platform.Characteristic.SwingMode.SWING_DISABLED;
    }

    onSetSwingMode (value: any) {
        this.command = '0AFF';
        this.msg = 'Swing mode';
        this.currentSwing = httpRequest(this.IP, `${this.path}${this.command}`, value, this.msg);
    }

    onGetSpeed () {
        return this.currentSpeed;
    }

    onSetSpeed (value: any) {
        this.command = '0BFF';
        this.msg = 'Rotation speed';
        this.currentSpeed = httpRequest(this.IP, `${this.path}${this.command}`, value, this.msg);
    }
}