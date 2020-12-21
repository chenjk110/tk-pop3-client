declare namespace TKPOP3Client {
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

    type ReplyIndicator = '+OK' | '-ERR'

    interface ICommandRunFunc {
        run(...args: any[]): NodeJS.ReadStream
        run(...args: any[]): Promise<Buffer>
    }

    type CommandMessageContent = string | Buffer | { toString(): string }

    interface ICommand {
        name: CommandKeywords
        params?: string[]
        message?: CommandMessageContent
        toRaw(): string
    }

    interface IConnectionOptions {
        host: string
        port: number
        tls?: boolean
        timeout?: number
    }

    interface IConnection {
        host: string
        port: number
        tls: boolean
        timeout: number
    }

    interface IClientOptions extends IConnectionOptions {
        username: string
        password: string
    }
}