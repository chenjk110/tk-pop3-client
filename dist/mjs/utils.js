import { TERM_BUF_S, TERM_BUF, CRLF, INDICATOR_ERR_BUF, INDICATOR_OK_BUF } from './constants';
export const containsEndedBufs = (buffer) => TERM_BUF_S.some((buf) => buf.equals(buffer));
export const containsTermBuf = (buffer) => buffer.slice(-TERM_BUF.length).equals(TERM_BUF);
export const omitTermBuf = (buffer) => buffer.slice(0, -TERM_BUF.length);
export const createPromiseRefs = () => {
    let handleResolve;
    let handleReject;
    const promise = new Promise((resolve, reject) => {
        handleResolve = resolve;
        handleReject = reject;
    });
    return { handleReject, handleResolve, promise };
};
export const isResOK = (buffer) => {
    const indicator = buffer.slice(0, INDICATOR_OK_BUF.length).toString().toUpperCase();
    return indicator === INDICATOR_OK_BUF.toString();
};
export const isResERR = (buffer) => {
    const indicator = buffer.slice(0, INDICATOR_ERR_BUF.length).toString().toUpperCase();
    return indicator === INDICATOR_ERR_BUF.toString();
};
export const pickMessageContent = (buffer) => {
    const indexCRLF = buffer.indexOf(CRLF);
    if (isResERR(buffer)) {
        return buffer.slice(INDICATOR_ERR_BUF.length + 1, indexCRLF);
    }
    if (isResOK(buffer)) {
        return buffer.slice(INDICATOR_OK_BUF.length + 1, indexCRLF);
    }
    return buffer.slice(0, indexCRLF);
};
export const stream2String = (stream) => {
    const { handleResolve, handleReject, promise } = createPromiseRefs();
    let buffer = Buffer.concat([]);
    let length = 0;
    stream.on('data', (chunk) => {
        length += chunk.length;
        buffer = Buffer.concat([buffer, chunk], length);
    });
    stream.on('error', (err) => handleReject(err));
    stream.on('end', () => handleResolve(buffer.toString()));
    return promise;
};
export const listify = (str) => {
    return str.split(CRLF)
        .filter(Boolean)
        .map(line => line.split(' '));
};
//# sourceMappingURL=utils.js.map