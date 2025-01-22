import { DateTime } from "luxon";

export class TimeUtil {
    public static getCurTimeReadable(fmt: string = 'HH:mm:ss.u'): string {
        const now = DateTime.now();
        const str = now.toFormat(fmt);
        return str;
    }

    public static getTimestamp(): number {
        const inSec = true;
        const now = Date.now().valueOf();
        return inSec ? Math.floor(now / 1000) : now;
    }
}