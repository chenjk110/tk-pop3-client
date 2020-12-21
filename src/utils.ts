import { Readable } from 'stream'

import { TERM_BUF_S, TERM_BUF, INDICATOR_OK_BUF, INDICATOR_ERR_BUF, CRLF } from './constants'

export const containsEndedBufs = (buffer: Buffer) => TERM_BUF_S.some((buf) => buf.equals(buffer))

export const containsTermBuf = (buffer: Buffer) => buffer.slice(-5).equals(TERM_BUF)

export const omitTermBuf = (buffer: Buffer) => buffer.slice(0, TERM_BUF.length)

export const createPromiseRefs = <T>() => {
    let handleResolve: (value: T) => any
    let handleReject: (reason?: any) => any
    const promise = new Promise<T>((resolve, reject) => {
        handleReject = reject
        handleResolve = resolve
    })
    return { handleReject, handleResolve, promise }
}

export const isResOK = (buffer: Buffer) => {
    return buffer.slice(0, INDICATOR_OK_BUF.length).equals(INDICATOR_OK_BUF)
}

export const isResERR = (buffer: Buffer) => {
    return buffer.slice(0, INDICATOR_ERR_BUF.length).equals(INDICATOR_ERR_BUF)
}

export const pickMessageContent = (buffer: Buffer) => {
    if (isResERR(buffer)) {
        return buffer.slice(INDICATOR_ERR_BUF.length, CRLF.length)
    }
    if (isResOK(buffer)) {
        return buffer.slice(INDICATOR_OK_BUF.length, CRLF.length)
    }
    return buffer.slice(0, CRLF.length)
}

export const stream2String = (stream: Readable) => {
    const { handleResolve, handleReject, promise } = createPromiseRefs<string>()
    let buffer = Buffer.concat([])
    let length = 0
    stream.on('data', (_buffer) => {
        length += _buffer.length
        buffer = Buffer.concat([buffer, _buffer], length)
    })
    stream.once('error', (err) => handleReject(err))
    stream.once('end', () => handleResolve(buffer.toString()))
    return promise
}

export const listify = (str: string) => {
    return str.split(CRLF)
        .filter(Boolean)
        .map(line => line.split(' '))
}
