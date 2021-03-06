import httpRequest from "../Utilites/httpRequest";
import getPowerSwitchCommand from "../Utilites/getPowerSwitchCommand";
import getStatus from "../Utilites/getStatus";
import listenToUpdates from "../Utilites/listenToUpdates";
import {Service, PlatformAccessory} from 'homebridge';
import {Platform} from '../index.js';
import {Functions} from "../Utilites/interfaces";

export class Fan {

    protected readonly service: Service;
    private currentActiveStatus: number;
    private currentSwing: number;
    private currentSpeed: number;
    private readonly name: string;
    private readonly IP: string;
    private readonly uuid: string;
    private functions: Functions [];
    private readonly path: string;
    private readonly ID: string;
    private command: string;

    constructor(
        private readonly platform: Platform,
        private readonly accessory: PlatformAccessory
    ) {
        this.functions = this.accessory.context.deviceInfo.Functions;
        this.currentActiveStatus = 0;
        this.currentSwing = 0;
        this.currentSpeed = 0;
        this.name = this.accessory.context.name;
        this.IP = this.accessory.context.IP;
        this.uuid = this.accessory.context.UUID;
        this.ID = this.accessory.context.ID;
        this.path = `/commands/ir/localremote/${this.uuid}`;
        this.command = '';

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

        listenToUpdates(this, this.ID, this.uuid, this.IP);
    }

    getServices() {
        return [this.service];
    }

    async onGetActive() {
        this.currentActiveStatus = await getStatus(this.IP, this.uuid);
        return this.currentActiveStatus;
    }

    async onSetActive(value: any) {
        if (value && this.currentActiveStatus) return;
        this.command = getPowerSwitchCommand(value, this.functions);
        try {
            await httpRequest(this.IP, `${this.path}${this.command}`);
            this.currentActiveStatus = value;
        } catch (e: any) {
            console.log(e.stack);
        }
    }

    onGetSwingMode () {
        return this.platform.Characteristic.SwingMode.SWING_DISABLED;
    }

    async onSetSwingMode (value: any) {
        this.command = '0AFF';
        try {
            await httpRequest(this.IP, `${this.path}${this.command}`);
            this.currentSwing = value;
        } catch (e: any) {
            console.log(e.stack);
        }

    }

    onGetSpeed () {
        return this.currentSpeed;
    }

    async onSetSpeed (value: any) {
        this.command = '0BFF';
        try {
            await httpRequest(this.IP, `${this.path}${this.command}`);
            this.currentSpeed = value;
        } catch (e: any) {
            console.log(e.stack);
        }
    }
}
