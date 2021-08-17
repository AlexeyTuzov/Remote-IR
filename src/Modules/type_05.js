"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirPurifier = void 0;
var httpRequest = require('../Utilites/httpRequest.js');
var AirPurifier = /** @class */ (function () {
    function AirPurifier(platform, accessory) {
        this.platform = platform;
        this.accessory = accessory;
        this.currentActiveStatus = false;
        this.currentState = 0;
        this.currentSpeed = 0;
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
        this.service.getCharacteristic(this.platform.Characteristic.CurrentAirPurifierState)
            .onGet(this.onGetCurrentState.bind(this));
        this.service.getCharacteristic(this.platform.Characteristic.TargetAirPurifierState)
            .onGet(this.onGetTargetState.bind(this))
            .onSet(this.onSetTargetState.bind(this));
        this.service.getCharacteristic(this.platform.Characteristic.RotationSpeed)
            .onGet(this.onGetRotationSpeed.bind(this))
            .onSet(this.onSetRotationSpeed.bind(this));
    }
    AirPurifier.prototype.getServices = function () {
        return [this.service];
    };
    AirPurifier.prototype.onGetActive = function () {
        return this.currentActiveStatus;
    };
    AirPurifier.prototype.onSetActive = function (value) {
        this.command = value ? '03FF' : '02FF';
        this.msg = 'Power state';
        httpRequest(this.IP, "" + this.path + this.command, value, this.currentActiveStatus, this.msg);
        return this.currentActiveStatus;
    };
    AirPurifier.prototype.onGetCurrentState = function () {
        return this.platform.Characteristic.CurrentAirPurifierState.INACTIVE;
    };
    AirPurifier.prototype.onGetTargetState = function () {
        console.log("Target Air Purifier Mode: " + this.platform.Characteristic.TargetAirPurifierState.AUTO);
        return this.platform.Characteristic.TargetAirPurifierState.AUTO;
    };
    AirPurifier.prototype.onSetTargetState = function (value) {
        this.command = '04FF';
        this.msg = 'Current Air Purifier state';
        httpRequest(this.IP, this.path, value, this.currentState, this.msg);
        return this.currentState;
    };
    AirPurifier.prototype.onGetRotationSpeed = function () {
        return this.currentSpeed;
    };
    AirPurifier.prototype.onSetRotationSpeed = function (value) {
        this.command = '0BFF';
        this.msg = 'Rotation speed';
        httpRequest(this.IP, this.path, value, this.currentSpeed, this.msg);
        return this.currentSpeed;
    };
    return AirPurifier;
}());
exports.AirPurifier = AirPurifier;
