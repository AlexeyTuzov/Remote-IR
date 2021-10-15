"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fan = void 0;
var httpRequest = require('../Utilites/httpRequest.js');
var getPowerSwitchCommand_js_1 = __importDefault(require("../Utilites/getPowerSwitchCommand.js"));
var Fan = /** @class */ (function () {
    function Fan(platform, accessory) {
        this.platform = platform;
        this.accessory = accessory;
        this.functions = this.accessory.context.deviceInfo.Functions;
        this.currentActiveStatus = false;
        this.currentSwing = 0;
        this.currentSpeed = 0;
        this.name = this.accessory.context.name;
        this.IP = this.accessory.context.IP;
        this.uuid = this.accessory.context.UUID;
        this.path = "/commands/ir/localremote/" + this.uuid;
        this.command = '';
        this.msg = '';
        this.service = this.accessory.getService(this.platform.Service.Fanv2) || this.accessory.addService(this.platform.Service.Fanv2);
        this.service.getCharacteristic(this.platform.Characteristic.Active)
            .onGet(this.onGetActive.bind(this))
            .onSet(this.onSetActive.bind(this));
        this.service.getCharacteristic(this.platform.Characteristic.SwingMode)
            .onGet(this.onGetSwingMode.bind(this))
            .onSet(this.onSetSwingMode.bind(this));
        this.service.getCharacteristic(this.platform.Characteristic.RotationSpeed)
            .onGet(this.onGetSpeed.bind(this))
            .onSet(this.onSetSpeed.bind(this));
    }
    Fan.prototype.getServices = function () {
        return [this.service];
    };
    Fan.prototype.onGetActive = function () {
        return this.currentActiveStatus;
    };
    Fan.prototype.onSetActive = function (value) {
        this.command = getPowerSwitchCommand_js_1.default(value, this.functions);
        this.msg = 'Power state';
        this.currentActiveStatus = httpRequest(this.IP, "" + this.path + this.command, value, this.msg);
    };
    Fan.prototype.onGetSwingMode = function () {
        return this.platform.Characteristic.SwingMode.SWING_DISABLED;
    };
    Fan.prototype.onSetSwingMode = function (value) {
        this.command = '0AFF';
        this.msg = 'Swing mode';
        this.currentSwing = httpRequest(this.IP, "" + this.path + this.command, value, this.msg);
    };
    Fan.prototype.onGetSpeed = function () {
        return this.currentSpeed;
    };
    Fan.prototype.onSetSpeed = function (value) {
        this.command = '0BFF';
        this.msg = 'Rotation speed';
        this.currentSpeed = httpRequest(this.IP, "" + this.path + this.command, value, this.msg);
    };
    return Fan;
}());
exports.Fan = Fan;
