import { CRLF } from './constants';
export class Command {
    constructor(name, params, message) {
        this.name = name;
        this.params = params;
        this.message = message;
    }
    static create(name, params, message) {
        return new Command(name, params, message);
    }
    static combine(...commands) {
        return commands.map(commd => commd.toRaw()).join('');
    }
    toRaw() {
        let { name, message = '', params = [] } = this;
        const raw = [`${name}`].concat(params, `${message}`)
            .filter(v => v != null && v !== '')
            .join(' ');
        return raw + CRLF;
    }
    toString() {
        return this.toRaw();
    }
    update(params, message) {
        this.updateParams(params);
        this.updateMessage(message);
        return this;
    }
    updateParams(params) {
        Object.assign(this, { params });
        return this;
    }
    updateMessage(message) {
        Object.assign(this, { message });
        return this;
    }
}
//# sourceMappingURL=command.js.map