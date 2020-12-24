import { MULTI_LINE_CMD_NAMES, TERM_BUF } from '../src/constants'
import { Server, Socket, AddressInfo } from 'net'

export type RunResult = {
    port: number,
    host: string,
    server: Server
}

export class TestServer {
    static TEST_USERNAME = 'test_username'
    static TEST_PASSWORD = 'test_password'

    public server: Server
    public tls: boolean

    private _info: RunResult

    constructor(tls = false) {
        this.tls = tls

        this.server = new Server()

        this.server.on('connection', (socket) => {
            let chunks = []
            socket.on('data', (chunk) => {
                chunks.push(chunk)
                if (['\r\n', '\r\n.\r\n'].some(b => chunk.toString().endsWith(b))) {
                    this.handleResponse(Buffer.concat(chunks), socket)
                    chunks = []
                }
            })
            socket.write(this.messageOK('Welcom POP3 TestServer.'))
        })
    }

    static create(tls = false) {
        return new TestServer(tls)
    }

    public run() {
        if (this.server.listening) {
            return Promise.resolve(this._info)
        }
        return new Promise<RunResult>((resolve, reject) => {
            this.server.once('error', reject)
            this.server.listen(() => {
                this.server.off('error', reject)
                const { address: host, port } = this.server.address() as AddressInfo
                this._info = { port, host, server: this.server }
                resolve(this._info)
            })
        })
    }

    private messageOK(msg?: string) {
        return `+OK${msg ? ' ' + msg : ''}\r\n`
    }

    private messageERR(msg?: string) {
        return `-ERR${msg ? ' ' + msg : ''}\r\n`
    }

    handleResponse(chunks: Buffer, socket: Socket) {
        let content = chunks.toString()

        if (!content) {
            socket.write(this.messageOK())
        } else {

            content = content.slice(0, content.indexOf('\r\n')).trim()

            const [name, ...payloads] = content.split(' ')

            // simple implementation
            if (name === `NOOP`
                || name === `STAT`
                || name === `APOP`
                || name === `RETR`
                || name === `RSET`) {
                socket.write(this.messageOK())
            }

            else if (name === `QUIT`) {
                socket.write(this.messageOK(`Bye Bye!`))
            }

            else if (name === `USER`) {
                const [username] = payloads
                if (username === TestServer.TEST_USERNAME) {
                    socket.write(this.messageOK(`Username: ${username}`))
                } else {
                    socket.write(this.messageERR(`Invalid Username: ${username}`))
                }
            }

            else if (name === `PASS`) {
                const [pass] = payloads
                if (pass === TestServer.TEST_PASSWORD) {
                    socket.write(this.messageOK(`Welcome!`))
                } else {
                    socket.write(this.messageERR(`Invalid Password: ${pass}`))
                }
            }

            else if (name === `DELE`) {
                const [order] = payloads
                if (isNaN(+order)) {
                    socket.write(this.messageERR(`Invalid Order ${order}`))
                } else {
                    socket.write(this.messageOK(`Delete Order ${order}`))
                }
            }

            else if (name === `LIST` || name === `UIDL`) {
                const [order] = payloads
                const rand = Math.random().toString(16).slice(3)
                if (order) {
                    if (isNaN(+order)) {
                        socket.write(this.messageERR(`Invalid Order ${order}`))
                    } else {
                        socket.write(this.messageOK() + `${order} ${rand}\r\n`)
                    }
                } else {
                    const listResult = Array.from(
                        { length: 10 },
                        (_, idx) => {
                            return `${idx} ${rand}\r\n`
                        }
                    ).join('')
                    socket.write(this.messageOK(`Total 10`) + listResult)
                }
            }

            else if (name === 'TOP') {
                const [order, n] = payloads
                if (isNaN(+order) || +order < 0) {
                    socket.write(this.messageERR(`Invalid Message-Number Argument: '${order}'`))
                } else if (isNaN(+n) || +n < 0) {
                    socket.write(this.messageERR(`Invalid Lines Arugment: '${n}'`))
                } else {
                    socket.write(this.messageOK(`top of message follows`))
                    socket.write([
                        'content content content',
                        'content content content',
                        'content content content',
                    ].join('\r\n'))
                }
            }

            else {
                socket.write(this.messageERR(`Unknown Keyword '${name}'`))
            }

            if (MULTI_LINE_CMD_NAMES.includes(name)) {
                socket.write(TERM_BUF)
            }
        }
    }
}

