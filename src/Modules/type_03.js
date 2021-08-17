"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lightbulb = void 0;
var httpRequest = require('../Utilites/httpRequest.js');
var Lightbulb = /** @class */ (function () {
    function Lightbulb(platform, accessory) {
        this.platform = platform;
        this.accessory = accessory;
        this.currentActiveStatus = false;
        this.name = this.accessory.context.name;
        this.IP = this.accessory.context.IP;
        this.uuid = this.accessory.context.UUID;
        this.path = "/commands/ir/localremote/" + this.uuid;
        this.command = '';
        this.msg = '';
        this.service = this.accessory.getService(this.platform.Service.Lightbulb) || this.accessory.addService(this.platform.Service.Lightbulb);
        this.service.getCharacteristic(this.platform.Characteristic.On)
            .onGet(this.onGetHandler.bind(this))
            .onSet(this.onSetHandler.bind(this));
    }
    Lightbulb.prototype.getServices = function () {
        return [this.service];
    };
    Lightbulb.prototype.onGetHandler = function () {
        return this.currentActiveStatus;
    };
    Lightbulb.prototype.onSetHandler = function (value) {
        this.command = value ? '03FF' : '02FF';
        this.msg = 'Power state';
        httpRequest(this.IP, "" + this.path + this.command, value, this.currentActiveStatus, this.msg);
        return this.currentActiveStatus;
    };
    return Lightbulb;
}());
exports.Lightbulb = Lightbulb;
