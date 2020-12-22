/// <reference types="node" />
declare type CommandKeywords = 'USER' | 'PASS' | 'QUIT' | 'STAT' | 'LIST' | 'RETR' | 'DELE' | 'NOOP' | 'RSET' | 'QUIT' | 'APOP' | 'TOP' | 'UIDL';
declare type CommandMessageContent = string | Buffer | {
    toString(): string;
};
export declare class Command {
    name: CommandKeywords;
    params?: string[];
    message?: CommandMessageContent;
    constructor(name: CommandKeywords, params?: string[], message?: CommandMessageContent);
    static create(name: CommandKeywords, params?: string[], message?: CommandMessageContent): Command;
    static combine(...commands: Command[]): string;
    toRaw(): string;
    toString(): string;
    update(params: string[], message: CommandMessageContent): this;
    updateParams(params: string[]): this;
    updateMessage(message: CommandMessageContent): this;
}
export {};
