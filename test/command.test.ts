import assert from 'assert'
import { Command, CommandKeywords } from '../src/command'

const commandNames: CommandKeywords[] = [
    // Minimal POP3 Command Keywords:
    'USER',
    'PASS',
    'QUIT',
    'STAT',
    'LIST',
    'RETR',
    'DELE',
    'NOOP',
    'RSET',
    'QUIT',
    // Optional POP3 Command Keywords:
    'APOP',
    'TOP',
    'UIDL'
]

describe('Command', async function () {

    it(`new Command()`, () => {
        commandNames.forEach(name => {
            const cmd = new Command(name)
            assert(cmd instanceof Command)
            assert.strictEqual(cmd.name, name)
            assert.strictEqual(cmd.message, undefined)
            assert.strictEqual(cmd.params, undefined)
        })
    })

    it(`Command.create()`, () => {
        const cmd = Command.create('USER')
        assert(cmd instanceof Command)
        assert(cmd.name = 'USER')
    })

    it(`Command.toRaw(), Command.toString()`, () => {
        const cmd1 = Command.create('LIST')
        const cmd2 = Command.create('LIST', ['1'])
        const cmd3 = Command.create('RETR', ['1'], 'Got it!')
        assert.strictEqual(cmd1.toRaw(), 'LIST\r\n')
        assert.strictEqual(cmd2.toRaw(), 'LIST 1\r\n')
        assert.strictEqual(cmd3.toRaw(), 'RETR 1 Got it!\r\n')
        assert.strictEqual(cmd1.toString(), 'LIST\r\n')
        assert.strictEqual(cmd2.toString(), 'LIST 1\r\n')
        assert.strictEqual(cmd3.toString(), 'RETR 1 Got it!\r\n')
    })

    it(`Command.combine()`, () => {
        const cmd1 = Command.create('APOP')
        const cmd2 = Command.create('DELE')
        const combinedRaw = Command.combine(cmd1, cmd2)
        assert.strictEqual(combinedRaw, 'APOP\r\nDELE\r\n')
    })

    it(`Command.updateParams()`, () => {
        const cmd = Command.create('USER')
        assert.strictEqual(cmd.toString(), 'USER\r\n')

        cmd.updateParams(['username'])
        assert.strictEqual(cmd.toString(), 'USER username\r\n')
    })

    it(`Command.updateMessage()`, () => {
        const cmd = Command.create('RETR', ['1'], 'Some Message')
        assert.strictEqual(cmd.toString(), 'RETR 1 Some Message\r\n')

        cmd.updateMessage('Message updated.')
        assert.strictEqual(cmd.toString(), 'RETR 1 Message updated.\r\n')
    })

    it(`Command.update()`, () => {
        const cmd = Command.create('USER')
        assert.strictEqual(cmd.toString(), 'USER\r\n')

        cmd.update(['username'], '')
        assert.strictEqual(cmd.toString(), 'USER username\r\n')

        const cmd2 = Command.create('RETR')
        assert.strictEqual(cmd2.toString(), 'RETR\r\n')

        cmd2.update(['1'], 'OKOKOK!')
        assert.strictEqual(cmd2.toString(), 'RETR 1 OKOKOK!\r\n')
    })

    after(() => {
        this.dispose()
    })
})