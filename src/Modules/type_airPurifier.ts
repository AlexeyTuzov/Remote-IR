const httpRequest: any = require('../Utilites/httpRequest.js');
import getPowerSwitchCommand from "../Utilites/getPowerSwitchCommand.js";
import {Service, PlatformAccessory} from 'homebridge';
import {Platform} from '../index.js';
import {Functions} from "../index.js";

export class AirPurifier {

    protected readonly service: Service;
    private currentActiveStatus: boolean;
    //private currentState: number;
    //private currentSpeed: number;
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
        //this.currentState = 0;
        //this.currentSpeed = 0;
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

        // ============the following functionality has not been realised yet============================================
        //this.service.getCharacteristic(this.platform.Characteristic.CurrentAirPurifierState)!
        //    .onGet(this.onGetCurrentState.bind(this));

        this.service.setCharacteristic(this.platform.Characteristic.TargetAirPurifierState, this.platform.Characteristic.TargetAirPurifierState.AUTO);
        //this.service.getCharacteristic(this.platform.Characteristic.TargetAirPurifierState)!
        //    .onGet(this.onGetTargetState.bind(this))
        //    .onSet(this.onSetTargetState.bind(this));

        //this.service.getCharacteristic(this.platform.Characteristic.RotationSpeed)!
        //    .onGet(this.onGetRotationSpeed.bind(this))
        //    .onSet(this.onSetRotationSpeed.bind(this));
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

    //onGetCurrentState () {
    //    return this.platform.Characteristic.CurrentAirPurifierState.INACTIVE;
    //}

    //onGetTargetState () {
    //    console.log(`Target Air Purifier Mode: ${this.platform.Characteristic.TargetAirPurifierState.AUTO}`);
    //    return this.platform.Characteristic.TargetAirPurifierState.AUTO;
    //}

    //onSetTargetState (value: any) {
    //    this.command = '04FF';
    //    this.msg = 'Current Air Purifier state';
    //    this.currentState = httpRequest(this.IP, this.path, value, this.msg);
    //    return this.currentState;
    //}

    //onGetRotationSpeed () {
    //    return this.currentSpeed;
    //}

    //onSetRotationSpeed (value: any) {
    //    this.command = '0BFF';
    //    this.msg = 'Rotation speed';
    //    this.currentSpeed = httpRequest(this.IP, this.path, value, this.msg);
    //    return this.currentSpeed;
    //}
}