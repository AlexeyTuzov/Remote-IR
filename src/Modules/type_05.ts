const httpRequest: any = require('../Utilites/httpRequest.js');
import {Service, PlatformAccessory} from 'homebridge';
import {Platform} from '../index.js';

export class AirPurifier {

    protected readonly service: Service;
    private readonly currentActiveStatus: boolean;
    private readonly currentState: number;
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
        this.currentState = 0;
        this.currentSpeed = 0;
        this.name = this.accessory.context.name;
        this.IP = this.accessory.context.IP;
        this.uuid = this.accessory.context.UUID;
        this.path = `/commands/ir/localremote/${this.uuid}`;
        this.command = '';
        this.msg = '';

        this.service = this.accessory.getService(this.platform.Service.AirPurifier) || this.accessory.addService(this.platform.Service.AirPurifier);

        this.service.getCharacteristic(this.platform.Characteristic.Active)!
            .onGet(this.onGetActive.bind(this))
            .onSet(this.onSetActive.bind(this));

        this.service.getCharacteristic(this.platform.Characteristic.CurrentAirPurifierState)!
            .onGet(this.onGetCurrentState.bind(this));

        this.service.getCharacteristic(this.platform.Characteristic.TargetAirPurifierState)!
            .onGet(this.onGetTargetState.bind(this))
            .onSet(this.onSetTargetState.bind(this));

        this.service.getCharacteristic(this.platform.Characteristic.RotationSpeed)!
            .onGet(this.onGetRotationSpeed.bind(this))
            .onSet(this.onSetRotationSpeed.bind(this));
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

    onGetCurrentState () {
        return this.platform.Characteristic.CurrentAirPurifierState.INACTIVE;
    }

    onGetTargetState () {
        console.log(`Target Air Purifier Mode: ${this.platform.Characteristic.TargetAirPurifierState.AUTO}`);
        return this.platform.Characteristic.TargetAirPurifierState.AUTO;
    }

    onSetTargetState (value: any) {
        this.command = '04FF';
        this.msg = 'Current Air Purifier state';
        httpRequest(this.IP, this.path, value, this.currentState, this.msg);
        return this.currentState;
    }

    onGetRotationSpeed () {
        return this.currentSpeed;
    }

    onSetRotationSpeed (value: any) {
        this.command = '0BFF';
        this.msg = 'Rotation speed';
        httpRequest(this.IP, this.path, value, this.currentSpeed, this.msg);
        return this.currentSpeed;
    }
}