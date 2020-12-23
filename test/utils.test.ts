import assert from 'assert'
import { Readable } from 'stream'
import { utils } from '../src'

describe('Utils', async function () {

    it(`containsEndedBufs`, () => {
        assert(utils.containsEndedBufs(Buffer.from(`.\r\n`)))
        assert(utils.containsEndedBufs(Buffer.from(`\r\n.\r\n`)))
    })

    it(`containsTermBuf`, () => {
        assert(utils.containsTermBuf(Buffer.from('SomeMessage\r\n.\r\n')))
    })

    it(`createPromiseRefs:handleResolve`, (done) => {
        const { handleResolve, promise } = utils.createPromiseRefs()

        handleResolve(1)

        assert.doesNotReject(promise)

        promise.then(value => done(assert.strictEqual(value, 1)))
    })

    it(`createPromiseRefs:handleReject`, (done) => {
        const { handleReject, promise } = utils.createPromiseRefs()

        handleReject(new Error('some error'))

        assert.rejects(promise)

        promise.catch(reason => {
            assert(reason instanceof Error)
            assert.strictEqual(reason.message, 'some error')
            done()
        }).catch(done)
    })

    it(`isResERR`, () => {
        assert(utils.isResERR(Buffer.from(`-ERR Some Message.`)))
    })

    it(`isResOk`, () => {
        assert(utils.isResOK(Buffer.from('+OK Some Message.')))
    })

    it(`omitTermBuf`, () => {
        const message = utils.omitTermBuf(Buffer.from('Some Message.\r\n.\r\n')).toString()
        assert.strictEqual(message, 'Some Message.')
    })

    it(`pickMessageContent`, () => {
        const message = utils.pickMessageContent(Buffer.from(`+OK Some Message.\r\n`)).toString()
        assert.strictEqual(message, 'Some Message.')
    })

    it(`listify`, () => {
        const list = utils.listify([
            '1 aaa',
            '2 bbb',
            '3 ccc'
        ].join('\r\n'))

        assert(Array.isArray(list))
        assert.strictEqual(list.length, 3)
        assert(Array.isArray(list[0]))
        assert.strictEqual(list[0][0], '1')
        assert.strictEqual(list[0][1], 'aaa')
    })

    it(`stream2String`, (done) => {
        let buffer = Buffer.concat([])
        let length = 0
        const stream = new Readable({
            read: () => { }
        })

        const buf1 = Buffer.from('Hello')
        const buf2 = Buffer.from('World')
        const buf3 = Buffer.concat([buf1, buf2])

        stream.push(buf1)
        stream.push(buf2)
        stream.push(null)

        stream.on('data', (chunk) => {
            length += chunk.length
            buffer = Buffer.concat([buffer, chunk], length)
        })
        stream.on('close', done)
        stream.on('end', () => {
            assert(buffer.equals(buf3))
        })
    })
})
