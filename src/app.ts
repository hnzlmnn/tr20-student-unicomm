import {createServer, Socket} from 'net'
import {Emoji} from 'emoji-parse';
import {getLogger} from './logging'
import Shell from './shell'
import process, {env} from 'process'

const log = getLogger('')

const port = isFinite(Number(env.PORT)) ? Number(env.PORT) : 1337
const address = env.ADDRESS || '0.0.0.0'

log('Booting application')

Emoji.INCLUDE_VARIATION = false


const server = createServer((socket: Socket) => {
    const shell = new Shell(socket)
})

server.listen(port, address, () => {
    log(`Started on ${address}:${port}`)
})

process.on('SIGINT', () => process.exit(2));
process.on('SIGTERM', () => process.exit(15));
