"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Humidifier = void 0;
var httpRequest = require('../Utilites/httpRequest.js');
var Humidifier = /** @class */ (function () {
    function Humidifier(platform, accessory) {
        this.platform = platform;
        this.accessory = accessory;
        this.currentActiveStatus = false;
        this.currentHDstate = 0;
        this.name = this.accessory.context.name;
        this.IP = this.accessory.context.IP;
        this.uuid = this.accessory.context.UUID;
        this.path = "/commands/ir/localremote/" + this.uuid;
        this.command = '';
        this.msg = '';
        this.service = this.accessory.getService(this.platform.Service.HumidifierDehumidifier) || this.accessory.addService(this.platform.Service.HumidifierDehumidifier);
        this.service.getCharacteristic(this.platform.Characteristic.Active)
            .onGet(this.onGetActive.bind(this))
            .onSet(this.onSetActive.bind(this));
        this.service.getCharacteristic(this.platform.Characteristic.CurrentHumidifierDehumidifierState)
            .onGet(this.onGetHDState.bind(this));
        this.service.getCharacteristic(this.platform.Characteristic.TargetHumidifierDehumidifierState)
            .onGet(this.onGetTargetState.bind(this))
            .onSet(this.onSetTargetState.bind(this));
    }
    Humidifier.prototype.getServices = function () {
        return [this.service];
    };
    Humidifier.prototype.onGetActive = function () {
        return this.currentActiveStatus;
    };
    Humidifier.prototype.onSetActive = function (value) {
        this.command = value ? '03FF' : '02FF';
        this.msg = 'Power state';
        httpRequest(this.IP, "" + this.path + this.command, value, this.currentActiveStatus, this.msg);
        return this.currentActiveStatus;
    };
    Humidifier.prototype.onGetHDState = function () {
        return this.platform.Characteristic.CurrentHumidifierDehumidifierState.INACTIVE;
    };
    Humidifier.prototype.onGetTargetState = function () {
        console.log("Target H-D Mode: " + this.platform.Characteristic.TargetHumidifierDehumidifierState.HUMIDIFIER_OR_DEHUMIDIFIER);
        return this.platform.Characteristic.TargetHumidifierDehumidifierState.HUMIDIFIER_OR_DEHUMIDIFIER;
    };
    Humidifier.prototype.onSetTargetState = function (value) {
        this.command = '04FF';
        this.msg = 'Humidifier-Dehumidifier mode';
        httpRequest(this.IP, this.path, value, this.currentHDstate, this.msg);
        return this.currentHDstate;
    };
    return Humidifier;
}());
exports.Humidifier = Humidifier;
