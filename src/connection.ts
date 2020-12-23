import * as TLS from 'tls'
import { Socket } from 'net'
import { EventEmitter } from 'events'
import { Readable } from 'stream'
import { Command } from './command'
import {
    CRLF,
    MULTI_LINE_CMD_NAMES,
    TLS_PORT,
    PORT,
} from './constants'
import {
    containsEndedBufs,
    containsTermBuf,
    omitTermBuf,
    createPromiseRefs,
    isResERR,
    isResOK,
    pickMessageContent,
} from './utils'

export interface IConnectionOptions {
    host: string
    port?: number
    tls?: boolean
    timeout?: number
    keepAlive?: boolean
}

export class Connection extends EventEmitter {

    public host: string
    public port: number
    public tls: boolean
    public timeout: number
    public keepAlive: boolean

    private _socket: null | Socket | TLS.TLSSocket = null
    private _stream: null | Readable = null
    private _commandName: string = ''

    get connected() {
        return !!this._socket
    }

    constructor(options: IConnectionOptions) {
        super()
        const { host, port, tls, timeout, keepAlive = true } = Object.assign({}, options)
        this.host = host
        this.port = port || (tls ? TLS_PORT : PORT)
        this.tls = tls
        this.timeout = timeout
        this.keepAlive = keepAlive
    }

    static create(options: IConnectionOptions) {
        return new Connection(options)
    }

    private _resetStream() {
        this._stream = new Readable({
            read: () => { },
        })
        return this._stream
    }

    private _pushStream(buffer: Buffer) {
        if (containsEndedBufs(buffer)) {
            this._endStream()
            return
        }
        if (containsTermBuf(buffer)) {
            this._stream.push(omitTermBuf(buffer))
            this._endStream()
            return
        }
        this._stream.push(buffer)
    }

    private _endStream(err?: Error) {
        if (this._stream) {
            this._stream.push(null)
        }
        this.emit('end', err)
        this._stream = null
    }

    public connect() {
        const { handleResolve, handleReject, promise } = createPromiseRefs<true>()

        const { host, port, timeout, tls } = this

        const socket = new Socket()

        socket.setKeepAlive(this.keepAlive)

        this._socket = tls
            ? TLS.connect({ host, port, socket })
            : socket

        if (!isNaN(+timeout)) {
            this._socket.setTimeout(+timeout, () => {
                const err = new Error('Connection timeout')
                if (this.listeners('end').length) {
                    this.emit('end', err)
                }
                if (this.listeners('error').length) {
                    this.emit('error', err)
                }
                this._socket.end()
                this._socket = null
                handleReject(err)
            })
        }

        this._socket.on('data', (buffer) => {
            if (this._stream) {
                this._pushStream(buffer)
                return
            }

            // '+OK'
            if (isResOK(buffer)) {
                const firstLineEndIndex = buffer.indexOf(CRLF)
                const infoBuffer = pickMessageContent(buffer.slice(0, firstLineEndIndex))

                let stream: Readable

                // verifying command that is in multi-line pattern
                if (MULTI_LINE_CMD_NAMES.includes(this._commandName)) {
                    stream = this._resetStream()
                    const bodyBuffer = buffer.slice(firstLineEndIndex + CRLF.length)
                    if (bodyBuffer[0]) {
                        this._pushStream(bodyBuffer)
                    }
                }

                this.emit('response', infoBuffer.toString(), stream)
                handleResolve(true)
                return
            }

            // '-ERR'
            if (isResERR(buffer)) {
                const err = new Error(pickMessageContent(buffer).toString())
                this.emit('error', err)
                return
            }

            // Unexpected Response Error
            const err = new Error(`Unexpected response:\n${buffer.toString()}`)
            handleReject(err)
        })

        this._socket.on('error', (err) => {
            if (this._stream) {
                this.emit('error', err)
                return
            }
            handleReject(err)
            this._socket = null
        })

        this._socket.once('close', () => {
            const err = new Error('close')
            handleReject(err)
            this._socket = null
        })

        this._socket.once('end', () => {
            const err = new Error('end')
            handleReject(err)
            this._socket = null
        })

        socket.connect({ host, port })

        return promise
    }

    public async send(payload: string | Command): Promise<[string, Readable]> {
        // validating socket
        if (!this._socket) {
            throw new Error('No socket')
        }

        // validating stream
        const {
            handleResolve: resolveValidateStream,
            handleReject: rejectValidateStream,
            promise: validateStream
        } = createPromiseRefs()

        if (!this._stream) {
            resolveValidateStream(true)
        }

        this.once('end', (err) => {
            if (err) {
                rejectValidateStream(err)
                return
            }
            resolveValidateStream(true)
        })

        this.once('error', (err) => rejectValidateStream(err))

        await validateStream // await for validation

        // cache command name
        try {
            this._commandName = payload.toString().split(' ')[0].trim()
        } catch (err) {
            console.error(err)
            this._commandName = ''
        }

        // sending command
        const {
            handleResolve,
            handleReject,
            promise,
        } = createPromiseRefs<[string, Readable]>()

        if (!this._socket) {
            handleReject(new Error('No socket'))
        }

        this._socket.write(payload.toString(), 'utf8')

        this.once('error', handleReject)
        this.once('response', (info: string, stream: Readable) => {
            this.removeListener('error', handleReject)
            handleResolve([info, stream])
        })

        return promise
    }

    public close(had_error?: boolean) {
        this._socket.emit('end')
        this._stream?.emit('end')
        this._socket?.emit('close', had_error)
        this._socket = null
        this._stream = null
    }

    private _destroy() {
        Reflect.setPrototypeOf(this, null)
        const keys = Reflect.ownKeys(this)
        for (const key of keys) {
            Reflect.deleteProperty(this, key)
        }
        Reflect.defineProperty(this, '_destroyed', { value: true })
    }

    public destroy() {
        const { handleResolve, handleReject, promise } = createPromiseRefs<true>()

        try {
            if (this._stream) {
                this._stream.removeAllListeners()
                this._stream.destroy()
            }
            if (this._socket) {
                this._socket.removeAllListeners()
                this._socket.destroy()
            }
            this.removeAllListeners()
            this._destroy()
            handleResolve(true)
        } catch (err) {
            handleReject(err)
        }
        return promise
    }
}
