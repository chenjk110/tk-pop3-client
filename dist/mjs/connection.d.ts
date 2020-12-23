/// <reference types="node" />
import { EventEmitter } from 'events';
import { Readable } from 'stream';
import { Command } from './command';
export interface IConnectionOptions {
    host: string;
    port?: number;
    tls?: boolean;
    timeout?: number;
    keepAlive?: boolean;
}
export declare class Connection extends EventEmitter {
    host: string;
    port: number;
    tls: boolean;
    timeout: number;
    keepAlive: boolean;
    private _socket;
    private _stream;
    private _commandName;
    get connected(): boolean;
    constructor(options: IConnectionOptions);
    static create(options: IConnectionOptions): Connection;
    private _resetStream;
    private _pushStream;
    private _endStream;
    connect(): Promise<true>;
    send(payload: string | Command): Promise<[string, Readable]>;
    close(had_error?: boolean): void;
    private _destroy;
    destroy(): Promise<true>;
}
