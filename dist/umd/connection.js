var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
        define(["require", "exports", "tls", "net", "events", "stream", "./constants", "./utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Connection = void 0;
    var TLS = __importStar(require("tls"));
    var net_1 = require("net");
    var events_1 = require("events");
    var stream_1 = require("stream");
    var constants_1 = require("./constants");
    var utils_1 = require("./utils");
    var Connection = (function (_super) {
        __extends(Connection, _super);
        function Connection(options) {
            var _this = _super.call(this) || this;
            _this._socket = null;
            _this._stream = null;
            _this._commandName = '';
            var _a = Object.assign({}, options), host = _a.host, port = _a.port, tls = _a.tls, timeout = _a.timeout;
            _this.host = host;
            _this.port = port || (tls ? constants_1.TLS_PORT : constants_1.PORT);
            _this.tls = tls;
            _this.timeout = timeout;
            return _this;
        }
        Object.defineProperty(Connection.prototype, "connected", {
            get: function () {
                return !!this._socket;
            },
            enumerable: false,
            configurable: true
        });
        Connection.create = function (options) {
            return new Connection(options);
        };
        Connection.prototype._resetStream = function () {
            this._stream = new stream_1.Readable({
                read: function () { },
            });
            return this._stream;
        };
        Connection.prototype._pushStream = function (buffer) {
            if (utils_1.containsEndedBufs(buffer)) {
                this._endStream();
                return;
            }
            if (utils_1.containsTermBuf(buffer)) {
                this._stream.push(utils_1.omitTermBuf(buffer));
                this._endStream();
                return;
            }
            this._stream.push(buffer);
        };
        Connection.prototype._endStream = function (err) {
            if (this._stream) {
                this._stream.push(null);
            }
            this.emit('end', err);
            this._stream = null;
        };
        Connection.prototype.connect = function () {
            var _this = this;
            var _a = utils_1.createPromiseRefs(), handleResolve = _a.handleResolve, handleReject = _a.handleReject, promise = _a.promise;
            var _b = this, host = _b.host, port = _b.port, timeout = _b.timeout, tls = _b.tls;
            var socket = new net_1.Socket();
            socket.setKeepAlive(true);
            this._socket = tls
                ? TLS.connect({ host: host, port: port, socket: socket })
                : socket;
            if (!isNaN(+timeout)) {
                this._socket.setTimeout(+timeout, function () {
                    var err = new Error('Connection timeout');
                    if (_this.listeners('end').length) {
                        _this.emit('end', err);
                    }
                    if (_this.listeners('error').length) {
                        _this.emit('error', err);
                    }
                    _this._socket.end();
                    _this._socket = null;
                    handleReject(err);
                });
            }
            this._socket.on('data', function (buffer) {
                if (_this._stream) {
                    _this._pushStream(buffer);
                    return;
                }
                if (utils_1.isResERR(buffer)) {
                    var err_1 = new Error(utils_1.pickMessageContent(buffer).toString());
                    _this.emit('error', err_1);
                    return;
                }
                if (utils_1.isResOK(buffer)) {
                    var firstLineEndIndex = buffer.indexOf(constants_1.CRLF_BUF);
                    var infoBuffer = buffer.slice(4, firstLineEndIndex);
                    var stream = null;
                    if (constants_1.MULTI_LINE_CMD_NAMES.includes(_this._commandName)) {
                        stream = _this._resetStream();
                        var bodyBuffer = buffer.slice(firstLineEndIndex + 2);
                        if (bodyBuffer[0]) {
                            _this._pushStream(bodyBuffer);
                        }
                    }
                    _this.emit('response', infoBuffer.toString(), stream);
                    handleResolve(true);
                    return;
                }
                var err = new Error('Unexpected response');
                handleReject(err);
            });
            this._socket.on('error', function (err) {
                if (_this._stream) {
                    _this.emit('error', err);
                    return;
                }
                handleReject(err);
                _this._socket = null;
            });
            this._socket.once('close', function () {
                var err = new Error('close');
                handleReject(err);
                _this._socket = null;
            });
            this._socket.once('end', function () {
                var err = new Error('end');
                handleReject(err);
                _this._socket = null;
            });
            socket.connect({ host: host, port: port });
            return promise;
        };
        Connection.prototype.send = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, resolveValidateStream, rejectValidateStream, validateStream, _b, handleResolve, handleReject, promise;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!this._socket) {
                                throw new Error('No socket');
                            }
                            _a = utils_1.createPromiseRefs(), resolveValidateStream = _a.handleResolve, rejectValidateStream = _a.handleReject, validateStream = _a.promise;
                            if (!this._stream) {
                                resolveValidateStream(true);
                            }
                            this.once('end', function (err) {
                                if (err) {
                                    rejectValidateStream(err);
                                    return;
                                }
                                resolveValidateStream(true);
                            });
                            this.once('error', function (err) { return rejectValidateStream(err); });
                            return [4, validateStream];
                        case 1:
                            _c.sent();
                            this._commandName = payload.toString().split(' ')[0];
                            _b = utils_1.createPromiseRefs(), handleResolve = _b.handleResolve, handleReject = _b.handleReject, promise = _b.promise;
                            if (!this._socket) {
                                handleReject(new Error('No socket'));
                            }
                            this._socket.write("" + payload.toString() + constants_1.CRLF, 'utf8');
                            this.once('error', handleReject);
                            this.once('response', function (info, stream) {
                                _this.removeListener('error', handleReject);
                                handleResolve([info, stream]);
                            });
                            return [2, promise];
                    }
                });
            });
        };
        Connection.prototype._destroy = function () {
            Reflect.setPrototypeOf(this, null);
            var keys = Reflect.ownKeys(this);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                Reflect.deleteProperty(this, key);
            }
            Reflect.defineProperty(this, '_destroyed', { value: true });
        };
        Connection.prototype.destroy = function () {
            var _a = utils_1.createPromiseRefs(), handleResolve = _a.handleResolve, handleReject = _a.handleReject, promise = _a.promise;
            try {
                if (this._stream) {
                    this._stream.removeAllListeners();
                    this._stream.destroy();
                }
                if (this._socket) {
                    this._socket.removeAllListeners();
                    this._socket.destroy();
                }
                this._destroy();
                this.emit('destroy', null);
                this.removeAllListeners();
                handleResolve(true);
            }
            catch (err) {
                this.emit('destroy', err);
                handleReject(err);
            }
            return promise;
        };
        return Connection;
    }(events_1.EventEmitter));
    exports.Connection = Connection;
});
//# sourceMappingURL=connection.js.map