var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as utils from './utils';
import * as constans from './constants';
import { Command } from './command';
import { Connection } from './connection';
export class Client {
    constructor(options) {
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
        Object.keys(options).forEach(key => {
            this[`_` + key] = options[key];
        });
    }
    get connected() {
        var _a;
        return (_a = this.connection) === null || _a === void 0 ? void 0 : _a.connected;
    }
    get connection() {
        return this._connection;
    }
    static create(options) {
        return new Client(options);
    }
    _authorize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._connection) {
                this._connection = Connection.create({
                    host: this._host,
                    port: this._port,
                    timeout: this._timeout,
                    tls: this._tls
                });
            }
            if (this._connection.connected) {
                return this._PASSInfo;
            }
            yield this._connection.connect();
            yield this._connection.send(Command.create('USER', [this._username]));
            const [info] = yield this._connection.send(Command.create('PASS', [this._password]));
            this._PASSInfo = info;
            return this._PASSInfo;
        });
    }
    _listify(stream, msgOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = yield utils.stream2String(stream);
            const list = utils.listify(str);
            return msgOrder ? list[0] : list;
        });
    }
    UIDL(msgOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._authorize();
            const [_, stream] = yield this._connection.send(Command.create('UIDL', [msgOrder]));
            return yield this._listify(stream, msgOrder);
        });
    }
    NOOP() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._authorize();
            yield this._connection.send(Command.create('NOOP'));
            return;
        });
    }
    LIST(msgOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._authorize();
            const [_, stream] = yield this._connection.send(Command.create('LIST', [msgOrder]));
            return yield this._listify(stream, msgOrder);
        });
    }
    RSET() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._authorize();
            const [info] = yield this._connection.send(Command.create('RSET'));
            return info;
        });
    }
    RETR(msgOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._authorize();
            const [_, stream] = yield this._connection.send(Command.create('RETR', [msgOrder]));
            return utils.stream2String(stream);
        });
    }
    DELE(msgOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._authorize();
            const [info] = yield this._connection.send(Command.create('DELE', [msgOrder]));
            return info;
        });
    }
    STAT() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._authorize();
            const [info] = yield this._connection.send(Command.create('STAT'));
            return info;
        });
    }
    TOP(msgOrder, n = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._authorize();
            const [_, stream] = yield this._connection.send(Command.create('TOP', [msgOrder], n));
            return utils.stream2String(stream);
        });
    }
    QUIT() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._connection.connected) {
                return this._PASSInfo || 'Bye!';
            }
            const [info] = yield this._connection.send(Command.create('QUIT'));
            this._PASSInfo = info || '';
            return this._PASSInfo;
        });
    }
    close() {
        this._connection.close();
        this._connection = null;
    }
}
Client.utils = utils;
Client.constants = constans;
//# sourceMappingURL=client.js.map