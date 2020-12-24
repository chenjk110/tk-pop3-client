import assert, { rejects } from 'assert'
import { Client } from '../src/client'
import { TestServer, RunResult } from './_helper'

describe('Client', function () {

    this.timeout(10 * 1000)

    let info: RunResult
    let client: Client

    before(async () => {
        info = await TestServer.create().run()

        client = Client.create({
            host: info.host,
            port: info.port,
            username: TestServer.TEST_USERNAME,
            password: TestServer.TEST_PASSWORD,
        })

        return Promise.resolve()
    })

    it(`NOOP`, async () => {
        await client.NOOP()
    })

    it(`LIST`, async () => {
        const list = await client.LIST()
        assert.strictEqual(list.length, 10)
        assert.strictEqual(list[0].length, 2)
        assert.strictEqual(list[0][0], '0')
    })

    it(`LIST:0`, async () => {
        const item0 = await client.LIST('0')
        const [order, message] = item0
        assert.strictEqual(order, '0')
        assert.strictEqual(typeof message, 'string')
    })

    it(`UIDL`, async () => {
        const list = await client.UIDL()
        assert.strictEqual(list.length, 10)
        assert.strictEqual(list[0].length, 2)
        assert.strictEqual(list[0][0], '0')

    })

    it(`UIDL:0`, async () => {
        const item0 = await client.UIDL('0')
        const [order, message] = item0
        assert.strictEqual(order, '0')
        assert.strictEqual(typeof message, 'string')
    })

    it(`DELE`, async () => {
        await assert.rejects(() => client.DELE())
    })

    it(`DELE:0`, async () => {
        const result = await client.DELE('0')
        assert.strictEqual(typeof result, 'string')
        assert.ok(result)
    })

    it(`RETR`, async () => {
        await client.RETR()
    })

    it(`RSET`, async () => {
        await client.RSET()
    })

    it(`STAT`, async () => {
        await client.STAT()
    })

    it(`TOP`, async () => {
        await assert.rejects(() => client.TOP(''))
        await client.TOP('1')
    })

    it(`QUIT`, async () => {
        const result = await client.QUIT()
        assert.ok(result)
        assert(typeof result, 'string')
        assert(result.includes('Bye'))
    })

    after(() => {
        client.close()
        info.server.close()
        this.dispose()
    })
})  