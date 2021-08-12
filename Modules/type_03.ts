import * as httpRequest from '../Utilites/httpRequest.js';
import {Service, PlatformAccessory, API} from 'homebridge';
import {Platform} from '../index.js'

export class Lightbulb {

    private readonly Service: Service;
    private readonly api: API;
    private readonly accessory: PlatformAccessory;
    private readonly currentActiveStatus: boolean;
    private readonly name: string;
    private readonly IP: string;
    private readonly uuid: string;
    private readonly path: string;
    private readonly command: string;
    private readonly msg: string;

    constructor(IP: string, name: string, UUID: string, api: API, accessory: PlatformAccessory) {

        this.api = api;
        this.accessory = accessory;
        this.currentActiveStatus = false;
        this.name = name;
        this.IP = IP;
        this.uuid = UUID;
        this.path = `/commands/ir/localremote/${this.uuid}`;
        this.command = '';
        this.msg = '';

        this.Service = this.api.hap.Service.Lightbulb;
        console.log('this.Service', this.Service);

        this.service = this.accessory.getService.Lightbulb || this.accessory.addService.Lightbulb;

        this.service.getCharacteristic(this.Characteristic.On)
            .onGet(this.onGetHandler.bind(this))
            .onSet(this.onSetHandler.bind(this));
    }

    getServices() {
        return [this.service];
    }

    onGetHandler() {
        return this.currentActiveStatus;
    }

    onSetHandler(value) {
        this.command = value ? '03FF' : '02FF';
        this.msg = 'Power state';
        httpRequest(this.IP, `${this.path}${this.command}`, value, this.currentActiveStatus, this.msg);
        return this.currentActiveStatus;
    }

}

