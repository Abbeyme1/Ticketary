import {randomBytes,scrypt} from "crypto";
import {promisify} from "util"

const scriptAsync = promisify(scrypt);

export class PasswordManager {
    static async hashPassword(password: string) {
        const salt = randomBytes(8).toString('hex');
        const buffer = (await scriptAsync(password,salt,64)) as Buffer;

        return `${buffer.toString('hex')}.${salt}`;
    }

    static async isValid(saved: string,provided: string)
    {
        const [password, salt] = saved.split('.');
        const buffer = (await scriptAsync(provided,salt,64)) as Buffer;

        return password === buffer.toString('hex');
    }
}