import * as utils from './utils'
import * as constans from './constants'
import { Command } from './command'
import { Connection, IConnectionOptions } from './connection'
import { Readable } from 'stream'

interface IClientOptions extends IConnectionOptions {
    username: string
    password: string
}

export class Client {

    static utils = utils
    static constants = constans

    private _username: string = undefined
    private _password: string = undefined
    private _host: string = undefined
    private _port: number = undefined
    private _tls: boolean = false
    private _timeout: number = undefined
    private _connection: Connection = null
    private _PASSInfo: string = undefined

    constructor(options: IClientOptions) {
        // validating options
        if (!options || typeof options !== 'object') {
            throw new TypeError('Invalid Options.')
        }
        // assign private value
        Object.keys(options).forEach(key => {
            this[`_` + key] = options[key]
        })
    }

    get connected() {
        return this.connection?.connected
    }

    get connection() {
        return this._connection
    }

    static create(options: IClientOptions) {
        return new Client(options)
    }

    private async _authorize() {
        if (!this._connection) {
            this._connection = Connection.create({
                host: this._host,
                port: this._port,
                timeout: this._timeout,
                tls: this._tls
            })
        }

        if (this.connected) {
            return this._PASSInfo
        }

        await this._connection.connect()

        await this._connection.send(
            Command.create('USER', [this._username])
        )

        const [info] = await this._connection.send(
            Command.create('PASS', [this._password])
        )

        this._PASSInfo = info

        return this._PASSInfo
    }

    private async _listify(stream: Readable, msgOrder?: string) {
        const str = await utils.stream2String(stream)
        const list = utils.listify(str)
        return msgOrder ? list[0] : list
    }

    async UIDL(): Promise<string[][]>
    async UIDL(msgOrder: string): Promise<string[]>
    async UIDL(msgOrder?: string) {
        await this._authorize()
        const [info, stream] = await this._connection.send(
            Command.create('UIDL', [msgOrder])
        )
        return msgOrder
            ? info.split(' ')
            : await this._listify(stream, msgOrder)
    }

    async NOOP() {
        await this._authorize()
        await this._connection.send(
            Command.create('NOOP')
        )
        return
    }

    async LIST(): Promise<string[][]>
    async LIST(msgOrder: string): Promise<string[]>
    async LIST(msgOrder?: string) {
        await this._authorize()
        const [info, stream] = await this._connection.send(
            Command.create('LIST', [msgOrder])
        )
        return msgOrder
            ? info.split(' ')
            : await this._listify(stream, msgOrder)
    }

    async RSET() {
        await this._authorize()
        const [info] = await this._connection.send(
            Command.create('RSET')
        )
        return info
    }

    async RETR(msgOrder: string) {
        await this._authorize()
        
        const [_, stream] = await this._connection.send(
            Command.create('RETR', [msgOrder])
        )

        return utils.stream2String(stream)
    }

    async DELE(msgOrder: string) {
        await this._authorize()
        const [info] = await this._connection.send(
            Command.create('DELE', [msgOrder])
        )
        return info
    }

    async STAT() {
        await this._authorize()
        const [info] = await this._connection.send(
            Command.create('STAT')
        )
        return info
    }

    async TOP(msgOrder: string, n: number) {
        await this._authorize()
        const [_, stream] = await this._connection.send(
            Command.create('TOP', [msgOrder], n)
        )
        return utils.stream2String(stream)
    }

    async QUIT() {
        if (!this.connected) {
            return this._PASSInfo || 'Bye!'
        }
        const [info] = await this._connection.send(
            Command.create('QUIT')
        )
        this._PASSInfo = info || ''
        return this._PASSInfo
    }

    close() {
        this._connection.close()
        this._connection = null
    }
}
