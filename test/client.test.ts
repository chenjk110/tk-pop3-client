import assert from 'assert'
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

    after(() => {
        client.close()
        info.server.close()
        this.dispose()
    })
})