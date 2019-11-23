import {Emoji, EmojiString} from 'emoji-parse';
import {getLogger} from './logging'
import State from './state'
import {n2es} from './utils'
import {Flag} from "./flag";

const log = getLogger('story')

export default class Story {
    private state: State
    private captcha: number = 0
    private info: any | undefined;

    constructor(extra?: any) {
        this.info = extra
        this.state = new State()
    }

    public handler(line: string): undefined | string | string[] | any[] {
        switch (this.state.step) {
            case 0:
                if (Emoji.parse(line).equals(Emoji.get('raising_hand_man'))) {
                    this.state.next()
                    return [
                        ':ok_woman:',
                        EmojiString.emojify(this.generateCaptcha(), true),
                    ]
                }
                break
            case 1:
                if (EmojiString.parse(line).equals(EmojiString.fromNumber(this.captcha), false, false)) {
                    this.state.next()
                    return [
                        Flag.generate(this.info),
                        undefined,
                    ]
                }
                break
        }
    }

    private generateCaptcha() {
        const a = Math.floor(Math.random() * 1000)
        const b = Math.floor(Math.random() * 1000)
        const o = [
            ':heavy_plus_sign:',
            ':heavy_minus_sign:',
            ':heavy_multiplication_x:',
        ][Math.floor(Math.random() * 3)]
        switch (o) {
            case ':heavy_plus_sign:':
                this.captcha = a + b
                break
            case ':heavy_minus_sign:':
                this.captcha = a - b
                break
            case ':heavy_multiplication_x:':
                this.captcha = a * b
                break
        }
        return n2es(a).concat(o).concat(n2es(b))
    }

}
