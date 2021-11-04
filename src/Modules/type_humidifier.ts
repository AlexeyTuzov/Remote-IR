const httpRequest: any = require('../Utilites/httpRequest.js');
import getPowerSwitchCommand from "../Utilites/getPowerSwitchCommand";
import {Service, PlatformAccessory} from 'homebridge';
import {Platform} from '../index.js';
import {Functions} from "../index.js";

export class Humidifier {

    protected readonly service: Service;
    private currentActiveStatus: number;
    //private currentHDState: number;
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
        this.currentActiveStatus = 0;
        //this.currentHDState = 0;
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

        // ============the following functionality has not been realised yet============================================
        //this.service.getCharacteristic(this.platform.Characteristic.CurrentHumidifierDehumidifierState)!
        //    .onGet(this.onGetHDState.bind(this));

        //this.service.getCharacteristic(this.platform.Characteristic.TargetHumidifierDehumidifierState)!
        //    .onGet(this.onGetTargetState.bind(this))
        //    .onSet(this.onSetTargetState.bind(this));
    }

    getServices() {
        return [this.service];
    }

    onGetActive() {
        return this.currentActiveStatus;
    }

    async onSetActive(value: any) {
        if (value && this.currentActiveStatus) return;
        this.command = getPowerSwitchCommand(value, this.functions);
        this.msg = 'Power state';
        this.currentActiveStatus = await httpRequest(this.IP, `${this.path}${this.command}`, value, this.msg);
    }

    //onGetHDState () {
    //    return this.platform.Characteristic.CurrentHumidifierDehumidifierState.INACTIVE;
    //}

    //onGetTargetState () {
    //    console.log(`Target H-D Mode: ${this.platform.Characteristic.TargetHumidifierDehumidifierState.HUMIDIFIER_OR_DEHUMIDIFIER}`);
    //    return this.platform.Characteristic.TargetHumidifierDehumidifierState.HUMIDIFIER_OR_DEHUMIDIFIER;
    //}

    //async onSetTargetState (value: any) {
    //    this.command = '04FF';
    //    this.msg = 'Humidifier-Dehumidifier mode';
    //    this.currentHDState = await httpRequest(this.IP, this.path, value, this.msg);
    //}

}