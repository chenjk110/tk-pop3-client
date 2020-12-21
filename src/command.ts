import { CRLF } from './constants'

export class Command implements TKPOP3Client.ICommand {
    constructor(
        public name: TKPOP3Client.CommandKeywords,
        public params?: string[],
        public message?: TKPOP3Client.CommandMessageContent
    ) { }

    static create(
        name: TKPOP3Client.CommandKeywords,
        params?: string[],
        message?: TKPOP3Client.CommandMessageContent,
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
                raw += ' ' + param
            })
        }
        if (this.message) {
            raw += ' ' + this.message.toString()
        }
        raw += CRLF
        return raw
    }

    public toString() {
        return this.toRaw()
    }

    public update(params: string[], message: TKPOP3Client.CommandMessageContent) {
        this.updateParams(params)
        this.updateMessage(message)
        return this
    }

    public updateParams(params: string[]) {
        Object.assign(this, { params })
        return this
    }

    public updateMessage(message: TKPOP3Client.CommandMessageContent) {
        Object.assign(this, { message })
        return this
    }
}
