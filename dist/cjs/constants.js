"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MULTI_LINE_CMD_NAMES = exports.TERM_BUF_S = exports.TERM_BUF = exports.CRLF_BUF = exports.CRLF = exports.INDICATOR_ERR_BUF = exports.INDICATOR_OK_BUF = exports.INDICATOR_ERR = exports.INDICATOR_OK = exports.TLS_PORT = exports.PORT = void 0;
exports.PORT = 110;
exports.TLS_PORT = 995;
exports.INDICATOR_OK = '+OK';
exports.INDICATOR_ERR = '-ERR';
exports.INDICATOR_OK_BUF = Buffer.from(exports.INDICATOR_OK, 'ascii');
exports.INDICATOR_ERR_BUF = Buffer.from(exports.INDICATOR_ERR, 'ascii');
exports.CRLF = '\r\n';
exports.CRLF_BUF = Buffer.from('\r\n');
exports.TERM_BUF = Buffer.from('\r\n.\r\n');
exports.TERM_BUF_S = [
    Buffer.from('\r\n.\r\n'),
    Buffer.from('.\r\n'),
];
exports.MULTI_LINE_CMD_NAMES = [
    'LIST',
    'RETR',
    'TOP',
    'UIDL',
];
//# sourceMappingURL=constants.js.map