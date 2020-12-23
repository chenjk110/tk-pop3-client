var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as TLS from 'tls';
import { Socket } from 'net';
import { EventEmitter } from 'events';
import { Readable } from 'stream';
import { CRLF, MULTI_LINE_CMD_NAMES, TLS_PORT, PORT, } from './constants';
import { containsEndedBufs, containsTermBuf, omitTermBuf, createPromiseRefs, isResERR, isResOK, pickMessageContent, } from './utils';
export class Connection extends EventEmitter {
    constructor(options) {
        super();
        this._socket = null;
        this._stream = null;
        this._commandName = '';
        const { host, port, tls, timeout, keepAlive = true } = Object.assign({}, options);
        this.host = host;
        this.port = port || (tls ? TLS_PORT : PORT);
        this.tls = tls;
        this.timeout = timeout;
        this.keepAlive = keepAlive;
    }
    get connected() {
        return !!this._socket;
    }
    static create(options) {
        return new Connection(options);
    }
    _resetStream() {
        this._stream = new Readable({
            read: () => { },
        });
        return this._stream;
    }
    _pushStream(buffer) {
        if (containsEndedBufs(buffer)) {
            this._endStream();
            return;
        }
        if (containsTermBuf(buffer)) {
            this._stream.push(omitTermBuf(buffer));
            this._endStream();
            return;
        }
        this._stream.push(buffer);
    }
    _endStream(err) {
        if (this._stream) {
            this._stream.push(null);
        }
        this.emit('end', err);
        this._stream = null;
    }
    connect() {
        const { handleResolve, handleReject, promise } = createPromiseRefs();
        const { host, port, timeout, tls } = this;
        const socket = new Socket();
        socket.setKeepAlive(this.keepAlive);
        this._socket = tls
            ? TLS.connect({ host, port, socket })
            : socket;
        if (!isNaN(+timeout)) {
            this._socket.setTimeout(+timeout, () => {
                const err = new Error('Connection timeout');
                if (this.listeners('end').length) {
                    this.emit('end', err);
                }
                if (this.listeners('error').length) {
                    this.emit('error', err);
                }
                this._socket.end();
                this._socket = null;
                handleReject(err);
            });
        }
        this._socket.on('data', (buffer) => {
            if (this._stream) {
                this._pushStream(buffer);
                return;
            }
            if (isResOK(buffer)) {
                const firstLineEndIndex = buffer.indexOf(CRLF);
                const infoBuffer = pickMessageContent(buffer.slice(0, firstLineEndIndex));
                let stream;
                if (MULTI_LINE_CMD_NAMES.includes(this._commandName)) {
                    stream = this._resetStream();
                    const bodyBuffer = buffer.slice(firstLineEndIndex + CRLF.length);
                    if (bodyBuffer[0]) {
                        this._pushStream(bodyBuffer);
                    }
                }
                this.emit('response', infoBuffer.toString(), stream);
                handleResolve(true);
                return;
            }
            if (isResERR(buffer)) {
                const err = new Error(pickMessageContent(buffer).toString());
                this.emit('error', err);
                return;
            }
            const err = new Error(`Unexpected response:\n${buffer.toString()}`);
            handleReject(err);
        });
        this._socket.on('error', (err) => {
            if (this._stream) {
                this.emit('error', err);
                return;
            }
            handleReject(err);
            this._socket = null;
        });
        this._socket.once('close', () => {
            const err = new Error('close');
            handleReject(err);
            this._socket = null;
        });
        this._socket.once('end', () => {
            const err = new Error('end');
            handleReject(err);
            this._socket = null;
        });
        socket.connect({ host, port });
        return promise;
    }
    send(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._socket) {
                throw new Error('No socket');
            }
            const { handleResolve: resolveValidateStream, handleReject: rejectValidateStream, promise: validateStream } = createPromiseRefs();
            if (!this._stream) {
                resolveValidateStream(true);
            }
            this.once('end', (err) => {
                if (err) {
                    rejectValidateStream(err);
                    return;
                }
                resolveValidateStream(true);
            });
            this.once('error', (err) => rejectValidateStream(err));
            yield validateStream;
            try {
                this._commandName = payload.toString().split(' ')[0].trim();
            }
            catch (err) {
                console.error(err);
                this._commandName = '';
            }
            const { handleResolve, handleReject, promise, } = createPromiseRefs();
            if (!this._socket) {
                handleReject(new Error('No socket'));
            }
            this._socket.write(payload.toString(), 'utf8');
            this.once('error', handleReject);
            this.once('response', (info, stream) => {
                this.removeListener('error', handleReject);
                handleResolve([info, stream]);
            });
            return promise;
        });
    }
    close(had_error) {
        var _a, _b;
        this._socket.emit('end');
        (_a = this._stream) === null || _a === void 0 ? void 0 : _a.emit('end');
        (_b = this._socket) === null || _b === void 0 ? void 0 : _b.emit('close', had_error);
        this._socket = null;
        this._stream = null;
    }
    _destroy() {
        Reflect.setPrototypeOf(this, null);
        const keys = Reflect.ownKeys(this);
        for (const key of keys) {
            Reflect.deleteProperty(this, key);
        }
        Reflect.defineProperty(this, '_destroyed', { value: true });
    }
    destroy() {
        const { handleResolve, handleReject, promise } = createPromiseRefs();
        try {
            if (this._stream) {
                this._stream.removeAllListeners();
                this._stream.destroy();
            }
            if (this._socket) {
                this._socket.removeAllListeners();
                this._socket.destroy();
            }
            this.removeAllListeners();
            this._destroy();
            handleResolve(true);
        }
        catch (err) {
            handleReject(err);
        }
        return promise;
    }
}
//# sourceMappingURL=connection.js.map