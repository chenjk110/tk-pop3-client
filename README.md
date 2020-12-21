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
static create(options: TKPOP3Client.IClientOptions): Client;
```

```ts
UIDL(msgOrder?: string): Promise<string[] | string[][]>;
```

```ts
NOOP(): Promise<void>;
```

```ts
LIST(msgOrder?: string): Promise<string[] | string[][]>;
```

```ts
RSET(): Promise<string>;
```

```ts
RETR(msgOrder?: string): Promise<string>;
```

```ts
DELE(msgOrder?: string): Promise<string>;
```

```ts
STAT(): Promise<string>;
```

```ts
TOP(msgOrder: string, n?: number): Promise<string>;
```

```ts
QUIT(): Promise<string>;
```


## Command

```ts
static create(name: TKPOP3Client.CommandKeywords, params?: string[], message?: TKPOP3Client.CommandMessageContent): Command;
```

```ts
static combine(...commands: Command[]): string;
```

```ts
toRaw(): string;
```

```ts
toString(): string;
```

```ts
update(params: string[], message: TKPOP3Client.CommandMessageContent): this;
```

```ts
updateParams(params: string[]): this;
```

```ts
updateMessage(message: TKPOP3Client.CommandMessageContent): this;
```


## Connection
```ts
get connected(): boolean;
```

```ts
static create(options: TKPOP3Client.IConnectionOptions): Connection;
```

```ts
connect(): Promise<true>;
```

```ts
send(payload: string | Command): Promise<[string, Readable]>;
```
