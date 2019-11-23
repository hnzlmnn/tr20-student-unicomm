import 'mocha'
import {Socket} from 'net'
import {Emoji, EmojiString} from 'emoji-parse';
import {getLogger} from './logging'
import {e2s, eascii, equation} from "./utils";
import {createInterface} from "readline";

const log = getLogger('test')

describe('Application functionality', () => {

    it('should correctly answer to our test client', () => {

        const socket = new Socket()
        let step = 0

        const writeLine = (line: string) => {
            socket.write(line.concat('\n'))
        }

        // tslint:disable-next-line:no-empty
        socket.connect(31337, 'unicomm-master.fshbwl.ru', () => {
        })

        const lineRead = createInterface(socket)

        lineRead.on('line', line => {
            log(line)
            switch (step) {
                case 0:
                    if (EmojiString.parse(line).emojiAt(0).equals(Emoji.get('raising_hand_man'), false, false)) {
                        writeLine(Emoji.get('raising_hand_man').toString('utf8', true))
                        step++
                    }
                    break
                case 1:
                    if (EmojiString.parse(line).emojiAt(0).equals(Emoji.get('ok_man'), false, false)) {
                        // WAIT
                    } else {
                        const eq = eascii(e2s(EmojiString.parse(line)))
                        const solution = equation(eq)
                        const response = EmojiString.fromNumber(solution)
                        log(eq, solution)
                        log(response.toString('utf8', true, true))
                        writeLine(response.toString('utf8', true, true))
                        step++
                    }
                    break
            }
        })

        // tslint:disable-next-line:no-empty
        socket.on('close', () => {
        })

        socket.on('error', () => {
            console.info('Skipped application testing as no server was running or could be reached!')
        })

    })

})
