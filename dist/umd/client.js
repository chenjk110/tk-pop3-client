var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./utils", "./constants", "./command", "./connection"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Client = void 0;
    var utils = __importStar(require("./utils"));
    var constans = __importStar(require("./constants"));
    var command_1 = require("./command");
    var connection_1 = require("./connection");
    var Client = (function () {
        function Client(options) {
            var _this = this;
            this._username = undefined;
            this._password = undefined;
            this._host = undefined;
            this._port = undefined;
            this._tls = false;
            this._timeout = undefined;
            this._connection = null;
            this._PASSInfo = undefined;
            if (!options || typeof options !== 'object') {
                throw new TypeError('Invalid Options.');
            }
            Object.keys(options).forEach(function (key) {
                _this["_" + key] = options[key];
            });
        }
        Object.defineProperty(Client.prototype, "connected", {
            get: function () {
                var _a;
                return (_a = this.connection) === null || _a === void 0 ? void 0 : _a.connected;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Client.prototype, "connection", {
            get: function () {
                return this._connection;
            },
            enumerable: false,
            configurable: true
        });
        Client.create = function (options) {
            return new Client(options);
        };
        Client.prototype._authorize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var info;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this._connection) {
                                this._connection = connection_1.Connection.create({
                                    host: this._host,
                                    port: this._port,
                                    timeout: this._timeout,
                                    tls: this._tls
                                });
                            }
                            if (this._connection.connected) {
                                return [2, this._PASSInfo];
                            }
                            return [4, this._connection.connect()];
                        case 1:
                            _a.sent();
                            return [4, this._connection.send(command_1.Command.create('USER', [this._username]))];
                        case 2:
                            _a.sent();
                            return [4, this._connection.send(command_1.Command.create('PASS', [this._password]))];
                        case 3:
                            info = (_a.sent())[0];
                            this._PASSInfo = info;
                            return [2, this._PASSInfo];
                    }
                });
            });
        };
        Client.prototype._listify = function (stream, msgOrder) {
            return __awaiter(this, void 0, void 0, function () {
                var str, list;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, utils.stream2String(stream)];
                        case 1:
                            str = _a.sent();
                            list = utils.listify(str);
                            return [2, msgOrder ? list[0] : list];
                    }
                });
            });
        };
        Client.prototype.UIDL = function (msgOrder) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _, stream;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4, this._authorize()];
                        case 1:
                            _b.sent();
                            return [4, this._connection.send(command_1.Command.create('UIDL', [msgOrder]))];
                        case 2:
                            _a = _b.sent(), _ = _a[0], stream = _a[1];
                            return [4, this._listify(stream, msgOrder)];
                        case 3: return [2, _b.sent()];
                    }
                });
            });
        };
        Client.prototype.NOOP = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this._authorize()];
                        case 1:
                            _a.sent();
                            return [4, this._connection.send(command_1.Command.create('NOOP'))];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        };
        Client.prototype.LIST = function (msgOrder) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _, stream;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4, this._authorize()];
                        case 1:
                            _b.sent();
                            return [4, this._connection.send(command_1.Command.create('LIST', [msgOrder]))];
                        case 2:
                            _a = _b.sent(), _ = _a[0], stream = _a[1];
                            return [4, this._listify(stream, msgOrder)];
                        case 3: return [2, _b.sent()];
                    }
                });
            });
        };
        Client.prototype.RSET = function () {
            return __awaiter(this, void 0, void 0, function () {
                var info;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this._authorize()];
                        case 1:
                            _a.sent();
                            return [4, this._connection.send(command_1.Command.create('RSET'))];
                        case 2:
                            info = (_a.sent())[0];
                            return [2, info];
                    }
                });
            });
        };
        Client.prototype.RETR = function (msgOrder) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _, stream;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4, this._authorize()];
                        case 1:
                            _b.sent();
                            return [4, this._connection.send(command_1.Command.create('RETR', [msgOrder]))];
                        case 2:
                            _a = _b.sent(), _ = _a[0], stream = _a[1];
                            return [2, utils.stream2String(stream)];
                    }
                });
            });
        };
        Client.prototype.DELE = function (msgOrder) {
            return __awaiter(this, void 0, void 0, function () {
                var info;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this._authorize()];
                        case 1:
                            _a.sent();
                            return [4, this._connection.send(command_1.Command.create('DELE', [msgOrder]))];
                        case 2:
                            info = (_a.sent())[0];
                            return [2, info];
                    }
                });
            });
        };
        Client.prototype.STAT = function () {
            return __awaiter(this, void 0, void 0, function () {
                var info;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this._authorize()];
                        case 1:
                            _a.sent();
                            return [4, this._connection.send(command_1.Command.create('STAT'))];
                        case 2:
                            info = (_a.sent())[0];
                            return [2, info];
                    }
                });
            });
        };
        Client.prototype.TOP = function (msgOrder, n) {
            if (n === void 0) { n = 0; }
            return __awaiter(this, void 0, void 0, function () {
                var _a, _, stream;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4, this._authorize()];
                        case 1:
                            _b.sent();
                            return [4, this._connection.send(command_1.Command.create('TOP', [msgOrder], n))];
                        case 2:
                            _a = _b.sent(), _ = _a[0], stream = _a[1];
                            return [2, utils.stream2String(stream)];
                    }
                });
            });
        };
        Client.prototype.QUIT = function () {
            return __awaiter(this, void 0, void 0, function () {
                var info;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this._connection.connected) {
                                return [2, this._PASSInfo || 'Bye!'];
                            }
                            return [4, this._connection.send(command_1.Command.create('QUIT'))];
                        case 1:
                            info = (_a.sent())[0];
                            this._PASSInfo = info || '';
                            return [2, this._PASSInfo];
                    }
                });
            });
        };
        Client.prototype.close = function () {
            this._connection.close();
            this._connection = null;
        };
        Client.utils = utils;
        Client.constants = constans;
        return Client;
    }());
    exports.Client = Client;
});
//# sourceMappingURL=client.js.map