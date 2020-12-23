import assert from 'assert'
import { Connection } from '../src/connection'
import { RunResult, TestServer } from './_helper'

describe(`Connection`, function () {

    let info: RunResult
    let host: string
    let port: number

    before(async () => {

        info = await TestServer.create().run()

        host = info.host
        port = info.port

        return Promise.resolve()
    })

    it(`Connection.create()`, async () => {

        const conn = Connection.create({ host, port })

        assert(conn instanceof Connection)

        await conn.destroy()

    })

    it(`Connection.connect()`, async () => {
        const conn = Connection.create({ host, port })

        await conn.connect()

        conn.close()

        await conn.destroy()
    })

    it(`Connection.send()`, async () => {
        const conn = Connection.create({ host, port })

        await conn.connect()

        await conn.send(`NOOP\r\n.\r\n`)

        conn.close()

        await conn.destroy()
    })

    it(`Connection.connected`, async () => {

        const conn = Connection.create({ host, port })

        assert.strictEqual(conn.connected, false)

        await conn.connect()

        assert.strictEqual(conn.connected, true)

        conn.close()

        assert.strictEqual(conn.connected, false)

        await conn.destroy()

    })

    it(`Connection.destroy()`, async () => {
        const conn = Connection.create({ host, port })

        assert(Object.keys(conn).length > 0)

        await conn.destroy()

        assert(Object.keys(conn).length === 0)

    })

    after(() => {
        info.server.close()
        info.server.unref()
        this.dispose()
    })
})
