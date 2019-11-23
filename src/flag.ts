import crypto, {} from 'crypto'

const AES_KEY = Buffer.from('~9rpg_8y%8#(E0|`@vQZ g2MEXP2^<Ws', 'ascii')

export class Flag {

    public static generate(payload: any): string {
        const token = {
            challenge: "UniComm",
            time: (new Date()).toLocaleString(),
            data: payload
        }
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cfb', AES_KEY, iv);
        let enc = [iv, cipher.update(JSON.stringify(token), 'utf8')];
        enc.push(cipher.final());
        const flag = Buffer.concat(enc).toString('base64');
        const flag_lines = flag.match(/.{1,48}/g) as string[]
        return `-----BEGIN FISHBOWL FLAG-----
${flag_lines.join('\n')}
-----END FISHBOWL FLAG-----`
    }
}
