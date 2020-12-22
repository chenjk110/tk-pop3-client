(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./constants"], factory);
    }
})(function (require, exports) {
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
            var raw = "" + this.name;
            if (Array.isArray(this.params) && this.params.length) {
                this.params.filter(Boolean).forEach(function (param) {
                    raw = raw + ' ' + param;
                });
            }
            if (this.message) {
                raw = raw + ' ' + this.message.toString();
            }
            raw = raw + constants_1.CRLF;
            return raw;
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
});
//# sourceMappingURL=command.js.map