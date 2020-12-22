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
        let raw = `${this.name}`;
        if (Array.isArray(this.params) && this.params.length) {
            this.params.filter(Boolean).forEach(param => {
                raw += ' ' + param;
            });
        }
        if (this.message) {
            raw += ' ' + this.message.toString();
        }
        raw += CRLF;
        return raw;
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