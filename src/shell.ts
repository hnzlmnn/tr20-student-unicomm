import {Socket} from 'net'
import {createInterface, Interface} from 'readline'
import {getLogger} from './logging'
import Story from './story'
import {choice} from './utils'
import {EmojiString} from 'emoji-parse';

const log = getLogger('shell')

export default class Shell {
    private static readonly IDLE_TIMEOUT = 5000

    private readonly story: Story
    private readonly socket: Socket
    private lineRead: Interface
    private idleTimer?: NodeJS.Timeout
    private ended: boolean = false

    constructor(socket: Socket) {
        this.story = new Story({
            address: socket.remoteAddress,
            port: socket.remotePort,
        })
        this.socket = socket
        // tslint:disable-next-line:no-empty
        this.socket.on('error', () => {
        })
        this.lineRead = createInterface(this.socket)
        this.lineRead.on('line', this.onLine.bind(this))
        this.resetIdleTimer()
        // this.writeLine(':speech_balloon::heart: :arrow_right: :door:')
        this.writeLine(':raising_hand:')
    }

    private terminate(reason: 'exit' | 'idle' | 'invalid', extra?: any) {
        switch (reason) {
            case 'exit':
                this.writeLine(':upside_down_face:')
                // this.writeLine(':kissing_heart:')
                break
            case 'idle':
                this.writeLine(':alarm_clock:')
                break
            case 'invalid':
                const face = choice([
                    'thinking_face',
                    'face_with_monocle',
                ])
                this.writeLine(`:${face}: ${extra as string}`)
                break
        }
        this.socket.end()
    }

    private resetIdleTimer() {
        if (this.idleTimer !== undefined) {
            clearTimeout(this.idleTimer)
        }
        this.idleTimer = setTimeout(() => this.terminate('idle'), Shell.IDLE_TIMEOUT)
    }

    private hasLineEnd(s: string) {
        return s.substr(-1) === '\n'
    }

    private writeLine(line: string, emojify: boolean = true) {
        if (this.ended) {
            return
        }
        if (line === undefined) {
            return this.terminate("exit")
        }
        const formatted = (emojify ? EmojiString.emojify(line) : line).concat(this.hasLineEnd(line) ? '' : '\n')
        log('sending', formatted)
        try {
            this.socket.write(formatted)
        } catch (e) {
            this.ended = true
        }
    }

    private onLine(line: string) {
        this.resetIdleTimer()
        if (line === 'exit' || line === 'quit') {
            return this.terminate('exit')
        }
        log('received', line)
        let response = this.story.handler(line)
        if (response === undefined) {
            return this.terminate('invalid', line)
        }
        if (!Array.isArray(response)) {
            response = [response as string]
        }
        (response as string[]).forEach(r => this.writeLine(r))
    }

}
