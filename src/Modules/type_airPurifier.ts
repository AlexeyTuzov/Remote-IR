import httpRequest from "../Utilites/httpRequest";
import getPowerSwitchCommand from "../Utilites/getPowerSwitchCommand";
import getStatus from "../Utilites/getStatus";
import getFunctions from "../Utilites/getFunctions";
import {Service, PlatformAccessory} from 'homebridge';
import {Platform} from '../index.js';
import {Functions} from "../Utilites/interfaces";
import {emitter} from '../Utilites/UDPserver';

export class AirPurifier {

    protected readonly service: Service;
    private currentActiveStatus: number;
    private readonly name: string;
    private readonly IP: string;
    private readonly uuid: string;
    private functions: Functions[];
    private readonly path: string;
    private readonly ID: string;
    private command: string;
    private msg: string;

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
        this.msg = '';

        this.service = this.accessory.getService(this.platform.Service.AirPurifier) || this.accessory.addService(this.platform.Service.AirPurifier);

        this.service.getCharacteristic(this.platform.Characteristic.Active)!
            .onGet(this.onGetActive.bind(this))
            .onSet(this.onSetActive.bind(this));

        this.service.setCharacteristic(this.platform.Characteristic.TargetAirPurifierState, this.platform.Characteristic.TargetAirPurifierState.AUTO);

        const STATUS_UPDATE_EXPRESSION = String.raw`LOOK\.?in:Updated!${this.ID}:87:FE:${this.uuid}`;
        emitter.on('updated_status', async (msg: string) => {
            if (msg.match(RegExp(STATUS_UPDATE_EXPRESSION))) {
                this.currentActiveStatus = await getStatus(this.IP, this.uuid);
                console.log(`${this.uuid} status now: ${this.currentActiveStatus}`);
            }
        });

        const DATA_UPGRADE_EXPRESSION = String.raw`LOOK\.?in:Updated!${this.ID}:data:${this.uuid}`;
        emitter.on('updated_data', async (msg: string) => {
            if (msg.match(RegExp(DATA_UPGRADE_EXPRESSION))) {
                this.functions = await getFunctions(this.IP, this.uuid);
                console.log(`${this.uuid} functions now: ${this.functions}`);
            }
        });
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
        this.command = getPowerSwitchCommand(!!value, this.functions);
        this.msg = 'Power state';
        try {
            await httpRequest(this.IP, `${this.path}${this.command}`);
            this.currentActiveStatus = value;
        } catch (e: any) {
            console.log(e.stack);
        }
    }
}
