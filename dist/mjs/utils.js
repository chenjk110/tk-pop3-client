import { TERM_BUF_S, TERM_BUF, INDICATOR_OK_BUF, INDICATOR_ERR_BUF, CRLF } from './constants';
export const containsEndedBufs = (buffer) => TERM_BUF_S.some((buf) => buf.equals(buffer));
export const containsTermBuf = (buffer) => buffer.slice(-TERM_BUF.length).equals(TERM_BUF);
export const omitTermBuf = (buffer) => buffer.slice(0, TERM_BUF.length);
export const createPromiseRefs = () => {
    let handleResolve;
    let handleReject;
    const promise = new Promise((resolve, reject) => {
        handleReject = reject;
        handleResolve = resolve;
    });
    return { handleReject, handleResolve, promise };
};
export const isResOK = (buffer) => {
    return buffer.slice(0, INDICATOR_OK_BUF.length).equals(INDICATOR_OK_BUF);
};
export const isResERR = (buffer) => {
    return buffer.slice(0, INDICATOR_ERR_BUF.length).equals(INDICATOR_ERR_BUF);
};
export const pickMessageContent = (buffer) => {
    if (isResERR(buffer)) {
        return buffer.slice(INDICATOR_ERR_BUF.length, CRLF.length);
    }
    if (isResOK(buffer)) {
        return buffer.slice(INDICATOR_OK_BUF.length, CRLF.length);
    }
    return buffer.slice(0, CRLF.length);
};
export const stream2String = (stream) => {
    const { handleResolve, handleReject, promise } = createPromiseRefs();
    let buffer = Buffer.concat([]);
    let length = 0;
    stream.on('data', (_buffer) => {
        length += _buffer.length;
        buffer = Buffer.concat([buffer, _buffer], length);
    });
    stream.once('error', (err) => handleReject(err));
    stream.once('end', () => handleResolve(buffer.toString()));
    return promise;
};
export const listify = (str) => {
    return str.split(CRLF)
        .filter(Boolean)
        .map(line => line.split(' '));
};
//# sourceMappingURL=utils.js.map