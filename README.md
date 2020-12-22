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

```ts
interface IClientOptions {
    username: string
    password: string
    host: string
    port: number
    tls?: boolean
    timeout?: number
}

```

```ts
static create(options: IClientOptions): Client
```

```ts
public UIDL(msgOrder?: string): Promise<string[] | string[][]>
```

```ts
public NOOP(): Promise<void>
```

```ts
public LIST(msgOrder?: string): Promise<string[] | string[][]>
```

```ts
public RSET(): Promise<string>
```

```ts
public RETR(msgOrder?: string): Promise<string>
```

```ts
public DELE(msgOrder?: string): Promise<string>
```

```ts
public STAT(): Promise<string>
```

```ts
public TOP(msgOrder: string, n?: number): Promise<string>
```

```ts
public QUIT(): Promise<string>
```


## Command
```ts
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

type CommandMessageContent = 
    | string 
    | Buffer 
    | { toString(): string }
    
```

```ts
static create(name: CommandKeywords, params?: string[], message?: CommandMessageContent): Command
```

```ts
static combine(...commands: Command[]): string
```

```ts
public toRaw(): string
```

```ts
public toString(): string
```

```ts
public update(params: string[], message: CommandMessageContent): this
```

```ts
public updateParams(params: string[]): this
```

```ts
public updateMessage(message: CommandMessageContent): this
```


## Connection
```ts
interface IConnectionOptions {
    host: string
    port: number
    tls?: boolean
    timeout?: number
}
```

```ts
get connected(): boolean
```

```ts
static create(options: IConnectionOptions): Connection
```

```ts
public connect(): Promise<true>
```

```ts
public send(payload: string | Command): Promise<[string, Readable]>
```

```ts
public destroy(): Promise<true>
```
