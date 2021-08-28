"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Humidifier = void 0;
var httpRequest = require('../Utilites/httpRequest.js');
var Humidifier = /** @class */ (function () {
    function Humidifier(platform, accessory) {
        this.platform = platform;
        this.accessory = accessory;
        this.currentActiveStatus = false;
        //this.currentHDState = 0;
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
        // ============the following functionality has not been realised yet============================================
        //this.service.getCharacteristic(this.platform.Characteristic.CurrentHumidifierDehumidifierState)!
        //    .onGet(this.onGetHDState.bind(this));
        //this.service.getCharacteristic(this.platform.Characteristic.TargetHumidifierDehumidifierState)!
        //    .onGet(this.onGetTargetState.bind(this))
        //    .onSet(this.onSetTargetState.bind(this));
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
        this.currentActiveStatus = httpRequest(this.IP, "" + this.path + this.command, value, this.msg);
    };
    return Humidifier;
}());
exports.Humidifier = Humidifier;
