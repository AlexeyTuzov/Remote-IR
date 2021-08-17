"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = void 0;
var server = require('./server');
var type_03_js_1 = require("./Modules/type_03.js");
var type_04_js_1 = require("./Modules/type_04.js");
var type_05_js_1 = require("./Modules/type_05.js");
var type_06_js_1 = require("./Modules/type_06.js");
var type_07_js_1 = require("./Modules/type_07.js");
module.exports = function (api) {
    api.registerPlatform('homebridge-remote-ir-test', "Platform", Platform);
};
function getSavedRemotes() {
    return __awaiter(this, void 0, void 0, function () {
        var info, remotes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, server()];
                case 1:
                    info = _a.sent();
                    remotes = [];
                    if (info instanceof Array) {
                        info.forEach(function (item) {
                            remotes.push.apply(remotes, item.savedRC);
                        });
                    }
                    return [2 /*return*/, remotes];
            }
        });
    });
}
var Platform = /** @class */ (function () {
    function Platform(log, config, api, myAccessories) {
        var _this = this;
        this.log = log;
        this.config = config;
        this.api = api;
        this.myAccessories = myAccessories;
        this.Service = this.api.hap.Service;
        this.Characteristic = this.api.hap.Characteristic;
        this.config = config;
        this.api = api;
        this.myAccessories = [];
        this.Characteristic = this.api.hap.Characteristic;
        this.api.on('didFinishLaunching', function () { return __awaiter(_this, void 0, void 0, function () {
            var remotes;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getSavedRemotes()];
                    case 1:
                        remotes = _a.sent();
                        this.log.info('REMOTES:', remotes);
                        remotes.forEach(function (item) {
                            switch (item.Type) {
                                case '03': {
                                    var accUUID_1 = api.hap.uuid.generate("" + item.UUID);
                                    var existingAccessory = _this.myAccessories.find(function (accessory) { return accessory.UUID === accUUID_1; });
                                    if (existingAccessory) {
                                        new type_03_js_1.Lightbulb(_this, existingAccessory);
                                    }
                                    else {
                                        var accessory = new _this.api.platformAccessory("Lightbulb UUID: " + item.UUID, accUUID_1);
                                        accessory.context.IP = item.IP;
                                        accessory.context.name = "Lightbulb UUID: " + item.UUID;
                                        accessory.context.UUID = item.UUID;
                                        new type_03_js_1.Lightbulb(_this, accessory);
                                        _this.api.registerPlatformAccessories('homebridge-remote-ir-test', "" + _this.config.name, [accessory]);
                                    }
                                    break;
                                }
                                case '04': {
                                    var accUUID_2 = api.hap.uuid.generate("" + item.UUID);
                                    var existingAccessory = _this.myAccessories.find(function (accessory) { return accessory.UUID === accUUID_2; });
                                    if (existingAccessory) {
                                        new type_04_js_1.Humidifier(_this, existingAccessory);
                                    }
                                    else {
                                        var accessory = new _this.api.platformAccessory("Humidifier UUID: " + item.UUID, accUUID_2);
                                        accessory.context.IP = item.IP;
                                        accessory.context.name = "Humidifier UUID: " + item.UUID;
                                        accessory.context.UUID = item.UUID;
                                        new type_04_js_1.Humidifier(_this, accessory);
                                        _this.configureAccessory(accessory);
                                        _this.api.registerPlatformAccessories('homebridge-remote-ir-test', "" + _this.config.name, [accessory]);
                                    }
                                    break;
                                }
                                case '05': {
                                    var accUUID_3 = api.hap.uuid.generate("" + item.UUID);
                                    var existingAccessory = _this.myAccessories.find(function (accessory) { return accessory.UUID === accUUID_3; });
                                    if (existingAccessory) {
                                        new type_05_js_1.AirPurifier(_this, existingAccessory);
                                    }
                                    else {
                                        var accessory = new _this.api.platformAccessory("Air Purifier UUID: " + item.UUID, accUUID_3);
                                        accessory.context.IP = item.IP;
                                        accessory.context.name = "Air Purifier UUID: " + item.UUID;
                                        accessory.context.UUID = item.UUID;
                                        new type_05_js_1.AirPurifier(_this, accessory);
                                        _this.configureAccessory(accessory);
                                        _this.api.registerPlatformAccessories('homebridge-remote-ir-test', "" + _this.config.name, [accessory]);
                                    }
                                    break;
                                }
                                case '06': {
                                    var accUUID_4 = api.hap.uuid.generate("" + item.UUID);
                                    var existingAccessory = _this.myAccessories.find(function (accessory) { return accessory.UUID === accUUID_4; });
                                    if (existingAccessory) {
                                        new type_06_js_1.Switch(_this, existingAccessory);
                                    }
                                    else {
                                        var accessory = new _this.api.platformAccessory("Switch UUID: " + item.UUID, accUUID_4);
                                        accessory.context.IP = item.IP;
                                        accessory.context.name = "Switch UUID: " + item.UUID;
                                        accessory.context.UUID = item.UUID;
                                        new type_06_js_1.Switch(_this, accessory);
                                        _this.configureAccessory(accessory);
                                        _this.api.registerPlatformAccessories('homebridge-remote-ir-test', "" + _this.config.name, [accessory]);
                                    }
                                    break;
                                }
                                case '07': {
                                    var accUUID_5 = api.hap.uuid.generate("" + item.UUID);
                                    var existingAccessory = _this.myAccessories.find(function (accessory) { return accessory.UUID === accUUID_5; });
                                    if (existingAccessory) {
                                        new type_07_js_1.Fan(_this, existingAccessory);
                                    }
                                    else {
                                        var accessory = new _this.api.platformAccessory("Fan UUID: " + item.UUID, accUUID_5);
                                        accessory.context.IP = item.IP;
                                        accessory.context.name = "Fan UUID: " + item.UUID;
                                        accessory.context.UUID = item.UUID;
                                        new type_07_js_1.Fan(_this, accessory);
                                        _this.configureAccessory(accessory);
                                        _this.api.registerPlatformAccessories('homebridge-remote-ir-test', "" + _this.config.name, [accessory]);
                                    }
                                    break;
                                }
                                default:
                                    break;
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    }
    Platform.prototype.configureAccessory = function (accessory) {
        this.myAccessories.push(accessory);
    };
    return Platform;
}());
exports.Platform = Platform;
