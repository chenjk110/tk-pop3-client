import { CRLF } from './constants'

type CommandKeywords =
    // Minimal POP3 Command Keywords:
    | 'USER'
    | 'PASS'
    | 'QUIT'
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

type CommandMessageContent = string | Buffer | { toString(): string }

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
        let raw = `${this.name}`
        if (Array.isArray(this.params) && this.params.length) {
            this.params.filter(Boolean).forEach(param => {
                raw = raw + ' ' + param
            })
        }
        if (this.message) {
            raw = raw + ' ' + this.message.toString()
        }
        raw = raw + CRLF
        return raw
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
