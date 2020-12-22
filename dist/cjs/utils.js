"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listify = exports.stream2String = exports.pickMessageContent = exports.isResERR = exports.isResOK = exports.createPromiseRefs = exports.omitTermBuf = exports.containsTermBuf = exports.containsEndedBufs = void 0;
var constants_1 = require("./constants");
var containsEndedBufs = function (buffer) { return constants_1.TERM_BUF_S.some(function (buf) { return buf.equals(buffer); }); };
exports.containsEndedBufs = containsEndedBufs;
var containsTermBuf = function (buffer) { return buffer.slice(-constants_1.TERM_BUF.length).equals(constants_1.TERM_BUF); };
exports.containsTermBuf = containsTermBuf;
var omitTermBuf = function (buffer) { return buffer.slice(0, -constants_1.TERM_BUF.length); };
exports.omitTermBuf = omitTermBuf;
var createPromiseRefs = function () {
    var handleResolve;
    var handleReject;
    var promise = new Promise(function (resolve, reject) {
        handleResolve = resolve;
        handleReject = reject;
    });
    return { handleReject: handleReject, handleResolve: handleResolve, promise: promise };
};
exports.createPromiseRefs = createPromiseRefs;
var isResOK = function (buffer) {
    return buffer.slice(0, constants_1.INDICATOR_OK_BUF.length).equals(constants_1.INDICATOR_OK_BUF);
};
exports.isResOK = isResOK;
var isResERR = function (buffer) {
    return buffer.slice(0, constants_1.INDICATOR_ERR_BUF.length).equals(constants_1.INDICATOR_ERR_BUF);
};
exports.isResERR = isResERR;
var pickMessageContent = function (buffer) {
    var indexCRLF = buffer.indexOf(constants_1.CRLF);
    if (exports.isResERR(buffer)) {
        return buffer.slice(constants_1.INDICATOR_ERR_BUF.length + 1, indexCRLF);
    }
    if (exports.isResOK(buffer)) {
        return buffer.slice(constants_1.INDICATOR_OK_BUF.length + 1, indexCRLF);
    }
    return buffer.slice(0, indexCRLF);
};
exports.pickMessageContent = pickMessageContent;
var stream2String = function (stream) {
    var _a = exports.createPromiseRefs(), handleResolve = _a.handleResolve, handleReject = _a.handleReject, promise = _a.promise;
    var buffer = Buffer.concat([]);
    var length = 0;
    stream.on('data', function (chunk) {
        length += chunk.length;
        buffer = Buffer.concat([buffer, chunk], length);
    });
    stream.on('error', function (err) { return handleReject(err); });
    stream.on('end', function () { return handleResolve(buffer.toString()); });
    return promise;
};
exports.stream2String = stream2String;
var listify = function (str) {
    return str.split(constants_1.CRLF)
        .filter(Boolean)
        .map(function (line) { return line.split(' '); });
};
exports.listify = listify;
//# sourceMappingURL=utils.js.map