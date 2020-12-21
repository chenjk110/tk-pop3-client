export const PORT = 110
export const TLS_PORT = 995

export const INDICATOR_OK: TKPOP3Client.ReplyIndicator = '+OK'
export const INDICATOR_ERR: TKPOP3Client.ReplyIndicator = '-ERR'
export const INDICATOR_OK_BUF = Buffer.from(INDICATOR_OK, 'ascii')
export const INDICATOR_ERR_BUF = Buffer.from(INDICATOR_ERR, 'ascii')

export const CRLF = '\r\n'
export const CRLF_BUF = Buffer.from('\r\n')
export const TERM_BUF = Buffer.from('\r\n.\r\n')
export const TERM_BUF_S = [
    Buffer.from('\r\n.\r\n'),
    Buffer.from('.\r\n'),
]

export const MULTI_LINE_CMD_NAMES = [
    'LIST',
    'RETR',
    'TOP',
    'UIDL',
]
