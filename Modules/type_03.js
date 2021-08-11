const httpRequest = require('../Utilites/httpRequest.js');

class Lightbulb {
    constructor(IP, name, UUID, api, accessory) {

        this.api = api;
        this.accessory = accessory;
        this.currentActiveStatus = false;
        this.name = name;
        this.IP = IP;
        this.uuid = UUID;
        this.path = `/commands/ir/localremote/${this.uuid}`;
        this.command = '';
        this.msg = '';

        this.Characteristic = this.api.hap.Characteristic;
        this.Service = this.api.hap.Service.Lightbulb;
        console.log('this.Service', this.Service);

        this.service = this.accessory.getService.Lightbulb || this.accessory.addService.Lightbulb;

        this.service.getCharacteristic(this.Characteristic.On)
            .onGet(this.onGetHandler.bind(this))
            .onSet(this.onSetHandler.bind(this));
    }

    getServices() {
        return [this.service];
    }

    onGetHandler() {
        return this.currentActiveStatus;
    }

    onSetHandler(value) {
        this.command = value ? '03FF' : '02FF';
        this.msg = 'Power state';
        httpRequest(this.IP, `${this.path}${this.command}`, value, this.currentActiveStatus, this.msg);
        return this.currentActiveStatus;
    }

}

module.exports = Lightbulb;

