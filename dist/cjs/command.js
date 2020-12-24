"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
var constants_1 = require("./constants");
var Command = (function () {
    function Command(name, params, message) {
        this.name = name;
        this.params = params;
        this.message = message;
    }
    Command.create = function (name, params, message) {
        return new Command(name, params, message);
    };
    Command.combine = function () {
        var commands = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            commands[_i] = arguments[_i];
        }
        return commands.map(function (commd) { return commd.toRaw(); }).join('');
    };
    Command.prototype.toRaw = function () {
        var _a = this, name = _a.name, _b = _a.message, message = _b === void 0 ? '' : _b, _c = _a.params, params = _c === void 0 ? [] : _c;
        var raw = ["" + name].concat(params, "" + message)
            .filter(function (v) { return v != null && v !== ''; })
            .join(' ');
        return raw + constants_1.CRLF;
    };
    Command.prototype.toString = function () {
        return this.toRaw();
    };
    Command.prototype.update = function (params, message) {
        this.updateParams(params);
        this.updateMessage(message);
        return this;
    };
    Command.prototype.updateParams = function (params) {
        Object.assign(this, { params: params });
        return this;
    };
    Command.prototype.updateMessage = function (message) {
        Object.assign(this, { message: message });
        return this;
    };
    return Command;
}());
exports.Command = Command;
//# sourceMappingURL=command.js.map