# POP3 Client

**References:**

[POP3 RFC](https://tools.ietf.org/html/rfc1939)

[Github node-pop3](https://github.com/node-pop3/node-pop3)


# Examples:
```ts
import { Client } from './tk-pop3-client'

const client = new Client({
    host: 'xxx.xxx.xx.xx',
    port: 9090,
    username: 'username',
    password: 'password',
    tls: true,
    timeout: 10000
})

client.STAT().then(result => {
    ///
})

client.QUIT().then(info => {
    ///
})

```

# API:
## Client
static create(options: TKPOP3Client.IClientOptions): Client;
private _authorize;
private _listify;
UIDL(msgOrder?: string): Promise<string[] | string[][]>;
NOOP(): Promise<void>;
LIST(msgOrder?: string): Promise<string[] | string[][]>;
RSET(): Promise<string>;
RETR(msgOrder?: string): Promise<string>;
DELE(msgOrder?: string): Promise<string>;
STAT(): Promise<string>;
TOP(msgOrder: string, n?: number): Promise<string>;
QUIT(): Promise<string>;