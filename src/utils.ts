
import { Readable } from 'stream'
import { TERM_BUF_S, TERM_BUF, CRLF, INDICATOR_ERR_BUF, INDICATOR_OK_BUF } from './constants'

export const containsEndedBufs = (buffer: Buffer) => TERM_BUF_S.some((buf) => buf.equals(buffer))

export const containsTermBuf = (buffer: Buffer) => buffer.slice(-TERM_BUF.length).equals(TERM_BUF)

export const omitTermBuf = (buffer: Buffer) => buffer.slice(0, -TERM_BUF.length)

export const createPromiseRefs = <T>() => {
    let handleResolve: (value: T) => any
    let handleReject: (reason?: any) => any
    const promise = new Promise<T>((resolve, reject) => {
        handleResolve = resolve
        handleReject = reject
    })
    return { handleReject, handleResolve, promise }
}

export const isResOK = (buffer: Buffer) => {
    const indicator = buffer.slice(0, INDICATOR_OK_BUF.length).toString().toUpperCase()
    return indicator === INDICATOR_OK_BUF.toString()
}

export const isResERR = (buffer: Buffer) => {
    const indicator = buffer.slice(0, INDICATOR_ERR_BUF.length).toString().toUpperCase()
    return indicator === INDICATOR_ERR_BUF.toString()
}

export const pickMessageContent = (buffer: Buffer) => {
    const indexCRLF = buffer.indexOf(CRLF)
    if (isResERR(buffer)) {
        return buffer.slice(/* '-ERR ' */INDICATOR_ERR_BUF.length + 1, indexCRLF)
    }
    if (isResOK(buffer)) {
        return buffer.slice(/* '+OK ' */INDICATOR_OK_BUF.length + 1, indexCRLF)
    }
    return buffer.slice(0, indexCRLF)
}

export const stream2String = (stream: Readable) => {
    const { handleResolve, handleReject, promise } = createPromiseRefs<string>()

    let buffer = Buffer.concat([])
    let length = 0

    stream.on('data', (chunk) => {
        length += chunk.length
        buffer = Buffer.concat([buffer, chunk], length)
    })

    stream.on('error', (err) => handleReject(err))
    stream.on('end', () => handleResolve(buffer.toString()))

    return promise
}

export const listify = (str: string) => {
    return str.split(CRLF)
        .filter(Boolean)
        .map(line => line.split(' '))
}
