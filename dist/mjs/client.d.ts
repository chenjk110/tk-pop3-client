import * as utils from './utils';
import * as constans from './constants';
import { Connection, IConnectionOptions } from './connection';
interface IClientOptions extends IConnectionOptions {
    username: string;
    password: string;
}
export declare class Client {
    static utils: typeof utils;
    static constants: typeof constans;
    private _username;
    private _password;
    private _host;
    private _port;
    private _tls;
    private _timeout;
    private _connection;
    private _PASSInfo;
    constructor(options: IClientOptions);
    get connected(): boolean;
    get connection(): Connection;
    static create(options: IClientOptions): Client;
    private _authorize;
    private _listify;
    UIDL(): Promise<string[][]>;
    UIDL(msgOrder: string): Promise<string[]>;
    NOOP(): Promise<void>;
    LIST(): Promise<string[][]>;
    LIST(msgOrder: string): Promise<string[]>;
    RSET(): Promise<string>;
    RETR(msgOrder: string): Promise<string>;
    DELE(msgOrder: string): Promise<string>;
    STAT(): Promise<string>;
    TOP(msgOrder: string, n: number): Promise<string>;
    QUIT(): Promise<string>;
    close(): void;
}
export {};
