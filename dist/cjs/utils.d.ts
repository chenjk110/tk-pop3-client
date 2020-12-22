/// <reference types="node" />
import { Readable } from 'stream';
export declare const containsEndedBufs: (buffer: Buffer) => boolean;
export declare const containsTermBuf: (buffer: Buffer) => boolean;
export declare const omitTermBuf: (buffer: Buffer) => Buffer;
export declare const createPromiseRefs: <T>() => {
    handleReject: (reason?: any) => any;
    handleResolve: (value: T) => any;
    promise: Promise<T>;
};
export declare const isResOK: (buffer: Buffer) => boolean;
export declare const isResERR: (buffer: Buffer) => boolean;
export declare const pickMessageContent: (buffer: Buffer) => Buffer;
export declare const stream2String: (stream: Readable) => Promise<string>;
export declare const listify: (str: string) => string[][];
