import { CRLF } from './constants'

export type CommandKeywords =
    // Minimal POP3 Command Keywords:
    | 'USER'
    | 'PASS'
    | 'STAT'
    | 'LIST'
    | 'RETR'
    | 'DELE'
    | 'NOOP'
    | 'RSET'
    | 'QUIT'
    // Optional POP3 Command Keywords:
    | 'APOP'
    | 'TOP'
    | 'UIDL'

export type CommandMessageContent = string | Buffer | { toString(): string }

export class Command {
    constructor(
        public name: CommandKeywords,
        public params?: string[],
        public message?: CommandMessageContent
    ) { }

    static create(
        name: CommandKeywords,
        params?: string[],
        message?: CommandMessageContent,
    ) {
        return new Command(name, params, message)
    }

    static combine(...commands: Command[]): string {
        return commands.map(commd => commd.toRaw()).join('')
    }

    public toRaw() {
        let { name, message = '', params = [] } = this
        const raw = [`${name}`].concat(params, `${message}`)
            .filter(v => v != null && v !== '')
            .join(' ')
        return raw + CRLF
    }

    public toString() {
        return this.toRaw()
    }

    public update(params: string[], message: CommandMessageContent) {
        this.updateParams(params)
        this.updateMessage(message)
        return this
    }

    public updateParams(params: string[]) {
        Object.assign(this, { params })
        return this
    }

    public updateMessage(message: CommandMessageContent) {
        Object.assign(this, { message })
        return this
    }
}
