import httpRequest from "../Utilites/httpRequest";
import getPowerSwitchCommand from "../Utilites/getPowerSwitchCommand";
import getStatus from "../Utilites/getStatus";
import listenToUpdates from "../Utilites/listenToUpdates";
import {Service, PlatformAccessory} from 'homebridge';
import {Platform} from '../index.js';
import {Functions} from "../Utilites/interfaces";

export class Switch {

    protected readonly service: Service;
    private currentActiveStatus: number;
    private readonly name: string;
    private readonly IP: string;
    private readonly uuid: string;
    private readonly functions: Functions [];
    private readonly path: string;
    private readonly ID: string;
    private command: string;

    constructor(
        private readonly platform: Platform,
        private readonly accessory: PlatformAccessory
    ) {
        this.functions = this.accessory.context.deviceInfo.Functions;
        this.currentActiveStatus = 0;
        this.name = this.accessory.context.name;
        this.IP = this.accessory.context.IP;
        this.uuid = this.accessory.context.UUID;
        this.ID = this.accessory.context.ID;
        this.path = `/commands/ir/localremote/${this.uuid}`;
        this.command = '';

        this.service = this.accessory.getService(this.platform.Service.Switch) || this.accessory.addService(this.platform.Service.Switch);

        this.service.getCharacteristic(this.platform.Characteristic.On)!
            .onGet(this.onGetHandler.bind(this))
            .onSet(this.onSetHandler.bind(this));

        listenToUpdates(this, this.ID, this.uuid, this.IP);
    }

    getServices() {
        return [this.service];
    }

    async onGetHandler() {
        this.currentActiveStatus = await getStatus(this.IP, this.uuid);
        return this.currentActiveStatus;
    }

    async onSetHandler(value: any) {
        if (value && this.currentActiveStatus) return;
        this.command = getPowerSwitchCommand(value, this.functions);
        try {
            await httpRequest(this.IP, `${this.path}${this.command}`);
            this.currentActiveStatus = value;
        } catch (e: any) {
            console.log(e.stack);
        }
    }
}
