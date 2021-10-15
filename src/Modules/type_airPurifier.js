"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirPurifier = void 0;
var httpRequest = require('../Utilites/httpRequest.js');
var getPowerSwitchCommand_js_1 = __importDefault(require("../Utilites/getPowerSwitchCommand.js"));
var AirPurifier = /** @class */ (function () {
    function AirPurifier(platform, accessory) {
        this.platform = platform;
        this.accessory = accessory;
        this.functions = this.accessory.context.deviceInfo.Functions;
        this.currentActiveStatus = false;
        //this.currentState = 0;
        //this.currentSpeed = 0;
        this.name = this.accessory.context.name;
        this.IP = this.accessory.context.IP;
        this.uuid = this.accessory.context.UUID;
        this.path = "/commands/ir/localremote/" + this.uuid;
        this.command = '';
        this.msg = '';
        this.service = this.accessory.getService(this.platform.Service.AirPurifier) || this.accessory.addService(this.platform.Service.AirPurifier);
        this.service.getCharacteristic(this.platform.Characteristic.Active)
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
    AirPurifier.prototype.getServices = function () {
        return [this.service];
    };
    AirPurifier.prototype.onGetActive = function () {
        return this.currentActiveStatus;
    };
    AirPurifier.prototype.onSetActive = function (value) {
        this.command = getPowerSwitchCommand_js_1.default(value, this.functions);
        this.msg = 'Power state';
        this.currentActiveStatus = httpRequest(this.IP, "" + this.path + this.command, value, this.msg);
    };
    return AirPurifier;
}());
exports.AirPurifier = AirPurifier;
