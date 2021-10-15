"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TV = void 0;
var httpRequest = require('../Utilites/httpRequest.js');
var getPowerSwitchCommand_js_1 = __importDefault(require("../Utilites/getPowerSwitchCommand.js"));
var TV = /** @class */ (function () {
    function TV(platform, accessory) {
        this.platform = platform;
        this.accessory = accessory;
        this.functions = this.accessory.context.deviceInfo.Functions;
        this.currentTVActiveStatus = false;
        this.activeIdentifier = 1;
        this.configuredName = this.accessory.context.deviceInfo.Name;
        this.speakerMute = false;
        this.speakerActive = 0;
        this.speakerVolume = 0;
        this.name = this.accessory.context.name;
        this.IP = this.accessory.context.IP;
        this.uuid = this.accessory.context.UUID;
        this.path = "/commands/ir/localremote/" + this.uuid;
        this.command = '';
        this.msg = '';
        // interface modeResponse {
        //     Type: string;
        //     Signals: any[];
        // }
        this.tvService = this.accessory.getService(this.platform.Service.Television) || this.accessory.addService(this.platform.Service.Television);
        this.speakerService = this.accessory.getService(this.platform.Service.TelevisionSpeaker) || this.accessory.addService(this.platform.Service.TelevisionSpeaker);
        //this.inputSource = this.accessory.getService(this.platform.Service.InputSource) || this.accessory.addService(this.platform.Service.InputSource);
        this.tvService.getCharacteristic(this.platform.Characteristic.Active)
            .onGet(this.getTVActiveStatus.bind(this))
            .onSet(this.setTVActiveStatus.bind(this));
        this.tvService.setCharacteristic(this.platform.Characteristic.ActiveIdentifier, 1);
        this.tvService.setCharacteristic(this.platform.Characteristic.ConfiguredName, this.name);
        this.tvService.getCharacteristic(this.platform.Characteristic.RemoteKey)
            .onSet(this.remoteKeyCommands.bind(this));
        this.tvService.setCharacteristic(this.platform.Characteristic.SleepDiscoveryMode, this.platform.Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE);
        this.speakerService.getCharacteristic(this.platform.Characteristic.Mute)
            .onGet(this.getMuteState.bind(this))
            .onSet(this.setMuteState.bind(this));
        this.speakerService.setCharacteristic(this.platform.Characteristic.VolumeControlType, this.platform.Characteristic.VolumeControlType.RELATIVE);
        this.speakerService.getCharacteristic(this.platform.Characteristic.VolumeSelector)
            .onSet(this.setVolume.bind(this));
        this.speakerService.getCharacteristic(this.platform.Characteristic.Volume)
            .onGet(this.getVolume.bind(this));
        // this.inputSource.getCharacteristic(this.platform.Characteristic.Name)!
        //     .onGet(this.getInputName.bind(this));
        //
        // this.inputSource.getCharacteristic(this.platform.Characteristic.ConfiguredName)!
        //     .onGet(this.getInputName.bind(this));
        //
        // this.inputSource.setCharacteristic(this.platform.Characteristic.InputSourceType, this.platform.Characteristic.InputSourceType.HDMI);
        //
        // this.inputSource.setCharacteristic(this.platform.Characteristic.IsConfigured, this.platform.Characteristic.IsConfigured.NOT_CONFIGURED);
        //
        // this.inputSource.setCharacteristic(this.platform.Characteristic.CurrentVisibilityState, this.platform.Characteristic.CurrentVisibilityState.SHOWN);
        //
        // const isModeExist = this.accessory.context.deviceInfo.Functions.find( (item: FunctionsOfDevice) => item.Name === 'mode');
        //
        // if (!!isModeExist) {
        //     let arrayOfInputs: any[];
        //     let modes: modeResponse;
        //     http.get( {host: this.IP, path: `/data/${this.uuid}/mode`}, res => {
        //         let data: string = '';
        //         res.on('data', chunk => {
        //             data +=chunk;
        //         });
        //         res.on('end', () => {
        //             modes = JSON.parse(data);
        //             arrayOfInputs = { ...modes.Signals};
        //             this.configureInputs(arrayOfInputs);
        //         });
        //     }).on('error', err => {
        //         console.error('Error requesting modes of TV', err.stack);
        //     });
        //
        // }
    }
    TV.prototype.getServices = function () {
        return [this.tvService];
    };
    //=========================Methods 4 TV Service=====================================================================
    TV.prototype.getTVActiveStatus = function () {
        return this.currentTVActiveStatus;
    };
    TV.prototype.setTVActiveStatus = function (value) {
        this.command = getPowerSwitchCommand_js_1.default(value, this.functions);
        this.msg = 'Power state';
        this.currentTVActiveStatus = httpRequest(this.IP, "" + this.path + this.command, value, this.msg);
    };
    TV.prototype.remoteKeyCommands = function (value) {
        switch (value) {
            case this.platform.Characteristic.RemoteKey.SELECT: {
                this.command = '0C00';
                this.msg = 'Cursor';
                httpRequest(this.IP, "" + this.path + this.command, 'SELECT', this.msg);
                break;
            }
            case this.platform.Characteristic.RemoteKey.ARROW_UP: {
                this.command = '0C02';
                this.msg = 'Cursor';
                httpRequest(this.IP, "" + this.path + this.command, 'ARROW_UP', this.msg);
                break;
            }
            case this.platform.Characteristic.RemoteKey.ARROW_DOWN: {
                this.command = '0C04';
                this.msg = 'Cursor';
                httpRequest(this.IP, "" + this.path + this.command, 'ARROW_DOWN', this.msg);
                break;
            }
            case this.platform.Characteristic.RemoteKey.ARROW_LEFT: {
                this.command = '0C01';
                this.msg = 'Cursor';
                httpRequest(this.IP, "" + this.path + this.command, 'ARROW_LEFT', this.msg);
                break;
            }
            case this.platform.Characteristic.RemoteKey.ARROW_RIGHT: {
                this.command = '0C03';
                this.msg = 'Cursor';
                httpRequest(this.IP, "" + this.path + this.command, 'ARROW_RIGHT', this.msg);
                break;
            }
            case this.platform.Characteristic.RemoteKey.INFORMATION: {
                this.command = '0DFF';
                this.msg = 'Menu';
                httpRequest(this.IP, "" + this.path + this.command, 'INFORMATION', this.msg);
                break;
            }
            case this.platform.Characteristic.RemoteKey.REWIND: {
                this.command = '09FF';
                this.msg = 'Channel';
                httpRequest(this.IP, "" + this.path + this.command, 'DOWN', this.msg);
                break;
            }
            case this.platform.Characteristic.RemoteKey.FAST_FORWARD: {
                this.command = '08FF';
                this.msg = 'Channel';
                httpRequest(this.IP, "" + this.path + this.command, 'UP', this.msg);
                break;
            }
            default: break;
        }
    };
    //==========================Methods 4 TV Speaker====================================================================
    TV.prototype.getMuteState = function () {
        return this.speakerMute;
    };
    TV.prototype.setMuteState = function (value) {
        this.command = '05FF';
        this.msg = 'Mute state';
        this.speakerMute = httpRequest(this.IP, "" + this.path + this.command, value, this.msg);
    };
    TV.prototype.setVolume = function (value) {
        if (value) {
            this.speakerVolume--;
            this.command = '07FF';
            this.msg = 'Volume';
            httpRequest(this.IP, "" + this.path + this.command, 'STEP DOWN', this.msg);
        }
        else {
            this.speakerVolume++;
            this.command = '06FF';
            this.msg = 'Volume';
            httpRequest(this.IP, "" + this.path + this.command, 'STEP UP', this.msg);
        }
    };
    TV.prototype.getVolume = function () {
        return this.speakerVolume;
    };
    return TV;
}());
exports.TV = TV;
