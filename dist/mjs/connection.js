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
import { CRLF, CRLF_BUF, MULTI_LINE_CMD_NAMES, TLS_PORT, PORT, } from './constants';
import { containsEndedBufs, containsTermBuf, omitTermBuf, createPromiseRefs, isResERR, isResOK, pickMessageContent, } from './utils';
export class Connection extends EventEmitter {
    constructor(options) {
        super();
        this._socket = null;
        this._stream = null;
        this._commandName = '';
        const { host, port, tls, timeout } = Object.assign({}, options);
        this.host = host;
        this.port = port || (tls ? TLS_PORT : PORT);
        this.tls = tls;
        this.timeout = timeout;
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
        socket.setKeepAlive(true);
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
            if (isResERR(buffer)) {
                const err = new Error(pickMessageContent(buffer).toString());
                this.emit('error', err);
                return;
            }
            if (isResOK(buffer)) {
                const firstLineEndIndex = buffer.indexOf(CRLF_BUF);
                const infoBuffer = buffer.slice(4, firstLineEndIndex);
                let stream = null;
                if (MULTI_LINE_CMD_NAMES.includes(this._commandName)) {
                    stream = this._resetStream();
                    const bodyBuffer = buffer.slice(firstLineEndIndex + 2);
                    if (bodyBuffer[0]) {
                        this._pushStream(bodyBuffer);
                    }
                }
                this.emit('response', infoBuffer.toString(), stream);
                handleResolve(true);
                return;
            }
            const err = new Error('Unexpected response');
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
            this._commandName = payload.toString().split(' ')[0];
            const { handleResolve, handleReject, promise, } = createPromiseRefs();
            if (!this._socket) {
                handleReject(new Error('No socket'));
            }
            this._socket.write(`${payload.toString()}${CRLF}`, 'utf8');
            this.once('error', handleReject);
            this.once('response', (info, stream) => {
                this.removeListener('error', handleReject);
                handleResolve([info, stream]);
            });
            return promise;
        });
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
    }
}
//# sourceMappingURL=connection.js.map