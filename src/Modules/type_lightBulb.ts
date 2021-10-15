const httpRequest: Function = require('../Utilites/httpRequest.js');
import getPowerSwitchCommand from "../Utilites/getPowerSwitchCommand.js";
import {Service, PlatformAccessory} from 'homebridge';
import {Platform} from '../index.js';
import {Functions} from "../index.js";

export class Lightbulb {

    protected readonly service: Service;
    private currentActiveStatus: boolean;
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
        this.name = this.accessory.context.name;
        this.IP = this.accessory.context.IP;
        this.uuid = this.accessory.context.UUID;
        this.path = `/commands/ir/localremote/${this.uuid}`;
        this.command = '';
        this.msg = '';
        this.service = this.accessory.getService(this.platform.Service.Lightbulb) || this.accessory.addService(this.platform.Service.Lightbulb);

        this.service.getCharacteristic(this.platform.Characteristic.On)!
            .onGet(this.onGetHandler.bind(this))
            .onSet(this.onSetHandler.bind(this));
    }

    getServices() {
        return [this.service];
    }

    onGetHandler() {
        return this.currentActiveStatus;
    }

    onSetHandler(value: any) {
        this.command = getPowerSwitchCommand(value, this.functions);
        this.msg = 'Power state';
        this.currentActiveStatus = httpRequest(this.IP, `${this.path}${this.command}`, value, this.msg);
    }

}

