import httpRequest from "../Utilites/httpRequest";
import getPowerSwitchCommand from "../Utilites/getPowerSwitchCommand";
import getStatus from "../Utilites/getStatus";
import listenToUpdates from "../Utilites/listenToUpdates";
import {Service, PlatformAccessory} from "homebridge";
import {Platform} from "../index.js";
import {Functions} from "../Utilites/interfaces";

export class TV {

    protected readonly tvService: Service;
    protected readonly speakerService: Service;
    private readonly name: string;
    private readonly IP: string;
    private readonly uuid: string;
    private readonly functions: Functions [];
    private currentTVActiveStatus: number;
    private activeIdentifier: number;
    private configuredName: string;
    private speakerMute: boolean;
    private speakerActive: number;
    private speakerVolume: number;
    private readonly path: string;
    private readonly ID: string;
    private command: string;
    private blockPowerOn: boolean;

    constructor (
        private readonly platform: Platform,
        private readonly accessory: PlatformAccessory
    ) {
        this.functions = this.accessory.context.deviceInfo.Functions;
        this.currentTVActiveStatus = 0;
        this.activeIdentifier = 1;
        this.configuredName = this.accessory.context.deviceInfo.Name;
        this.speakerMute = false;
        this.speakerActive = 0;
        this.speakerVolume = 0;
        this.name = this.accessory.context.name;
        this.IP = this.accessory.context.IP;
        this.uuid = this.accessory.context.UUID;
        this.ID = this.accessory.context.ID;
        this.path = `/commands/ir/localremote/${this.uuid}`;
        this.command = '';
        this.blockPowerOn = false;

        this.tvService = this.accessory.getService(this.platform.Service.Television) || this.accessory.addService(this.platform.Service.Television);
        this.speakerService = this.accessory.getService(this.platform.Service.TelevisionSpeaker) || this.accessory.addService(this.platform.Service.TelevisionSpeaker);

        this.tvService.getCharacteristic(this.platform.Characteristic.Active)!
            .onGet(this.getTVActiveStatus.bind(this))
            .onSet(this.setTVActiveStatus.bind(this));

        this.tvService.setCharacteristic(this.platform.Characteristic.ActiveIdentifier, 1);

        this.tvService.setCharacteristic(this.platform.Characteristic.ConfiguredName, this.name);

        this.tvService.setCharacteristic(this.platform.Characteristic.SleepDiscoveryMode, this.platform.Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE);

        this.tvService.getCharacteristic(this.platform.Characteristic.RemoteKey)!
            .onSet(this.remoteKeyCommands.bind(this));

        this.speakerService.getCharacteristic(this.platform.Characteristic.Mute)!
            .onGet(this.getMuteState.bind(this))
            .onSet(this.setMuteState.bind(this));

        this.speakerService.setCharacteristic(this.platform.Characteristic.VolumeControlType, this.platform.Characteristic.VolumeControlType.RELATIVE);

        this.speakerService.getCharacteristic(this.platform.Characteristic.VolumeSelector)!
            .onSet(this.setVolume.bind(this));

        this.speakerService.getCharacteristic(this.platform.Characteristic.Volume)!
            .onGet(this.getVolume.bind(this));

        listenToUpdates(this, this.ID, this.uuid, this.IP);
    }

     getServices() {
         return [this.tvService];
     }

    //=========================Methods 4 TV Service=====================================================================
    async getTVActiveStatus() {
        this.currentTVActiveStatus = await getStatus(this.IP, this.uuid);
        return this.currentTVActiveStatus;
    }

    async setTVActiveStatus(value: any) {
        if (this.blockPowerOn) return;
        this.command = getPowerSwitchCommand(value, this.functions);
        try {
            await httpRequest(this.IP, `${this.path}${this.command}`);
            this.currentTVActiveStatus = value;
        } catch (e: any) {
            console.log(e.stack);
        }
    }

    async remoteKeyCommands(value: any) {
        this.blockPowerOn = true;
        switch (value) {
            case this.platform.Characteristic.RemoteKey.SELECT: {
                this.command = '0C00';
                try {
                    await httpRequest(this.IP, `${this.path}${this.command}`);
                } catch (e: any) {
                    console.log(e.stack);
                }
                break;
            }
            case this.platform.Characteristic.RemoteKey.ARROW_UP: {
                this.command = '0C02';
                try {
                    await httpRequest(this.IP, `${this.path}${this.command}`);
                } catch (e: any) {
                    console.log(e.stack);
                }
                break;
            }
            case this.platform.Characteristic.RemoteKey.ARROW_DOWN: {
                this.command = '0C04';
                try {
                    await httpRequest(this.IP, `${this.path}${this.command}`);
                } catch (e: any) {
                    console.log(e.stack);
                }
                break;
            }
            case this.platform.Characteristic.RemoteKey.ARROW_LEFT: {
                this.command = '0C01';
                try {
                    await httpRequest(this.IP, `${this.path}${this.command}`);
                } catch (e: any) {
                    console.log(e.stack);
                }
                break;
            }
            case this.platform.Characteristic.RemoteKey.ARROW_RIGHT: {
                this.command = '0C03';
                try {
                    await httpRequest(this.IP, `${this.path}${this.command}`);
                } catch (e: any) {
                    console.log(e.stack);
                }
                break;
            }
            case this.platform.Characteristic.RemoteKey.INFORMATION: {
                this.command = '0DFF';
                try {
                    await httpRequest(this.IP, `${this.path}${this.command}`);
                } catch (e: any) {
                    console.log(e.stack);
                }
                break;
            }
            case this.platform.Characteristic.RemoteKey.REWIND: {
                this.command = '09FF';
                try {
                    await httpRequest(this.IP, `${this.path}${this.command}`);
                } catch (e: any) {
                    console.log(e.stack);
                }
                break;
            }
            case this.platform.Characteristic.RemoteKey.FAST_FORWARD: {
                this.command = '08FF';
                try {
                    await httpRequest(this.IP, `${this.path}${this.command}`);
                } catch (e: any) {
                    console.log(e.stack);
                }
                break;
            }
            default: break;
        }
        setTimeout(() => {this.blockPowerOn = false}, 5000);
    }

    //==========================Methods 4 TV Speaker====================================================================

    getMuteState() {
        return this.speakerMute;
    }

    async setMuteState(value: any) {
        this.blockPowerOn = true;
        this.command = '05FF';
        try {
            await httpRequest(this.IP, `${this.path}${this.command}`);
            this.speakerMute = value;
        } catch (e: any) {
            console.log(e.stack);
        }
        setTimeout(() => {this.blockPowerOn = false}, 5000);
    }

    async setVolume(value: any) {
        this.blockPowerOn = true;
        if (value) {
            this.command = '07FF';
            try {
                await httpRequest(this.IP, `${this.path}${this.command}`);
                this.speakerVolume--;
            } catch (e: any) {
                console.log(e.stack);
            }

        } else {

            this.command = '06FF';
            try {
                await httpRequest(this.IP, `${this.path}${this.command}`);
                this.speakerVolume++;
            } catch (e: any) {
                console.log(e.stack);
            }
        }
        setTimeout(() => {this.blockPowerOn = false}, 5000);
    }

    getVolume () {
        return this.speakerVolume;
    }
}
