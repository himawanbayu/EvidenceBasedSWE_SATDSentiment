import { TimeUtil } from "./TimeUtil";

type LogFuncType = (...arr: any[]) => void;

export class AppLog {
    private static LOG_KEY = 'ebse';
    private static HIDE_DEBUG: boolean = false;
    private static NO_DEBUG_WARNING_SHOWN = false;

    private static toConsole(text: string, keys: string[], func: LogFuncType, ...extra: any[]) {
        let partA = '** ' ;
        if(keys.length > 0) {
            //keys = [TimeUtil.getCurTimeReadable(), ...keys];
            keys = [...keys, TimeUtil.getCurTimeReadable()];
            partA = '**[' +  keys.join('][') + '] ';
        }
        if (arguments.length > 3) {
            //func("**[" + key + "] " + text + ", extra: ", ...extra);
            func("" + partA + text + ", extra: ", ...extra);
        } else {
            //func("**[" + key + "] " + text);
            func("" + partA + text);
        }
    }

    public static debug(text: string = '', ...extra: any[]) {
        if (AppLog.HIDE_DEBUG) {
            if (!AppLog.NO_DEBUG_WARNING_SHOWN) {
                AppLog.NO_DEBUG_WARNING_SHOWN = true;
                AppLog.toConsole('SKIP_DEBUG is set => no debugs are shown, this warning is shown only once.', [AppLog.LOG_KEY, 'debug'], console.debug);
            }
            return;
        }
        AppLog.toConsole(text, [AppLog.LOG_KEY, 'debug'], console.debug, ...extra);
    }

    public static log(text: string = '', ...extra: any[]) {
        AppLog.toConsole(text, [AppLog.LOG_KEY, 'log'], console.log, ...extra);
    }

    public static warn(text: string = '', ...extra: any[]) {
        AppLog.toConsole(text, [AppLog.LOG_KEY, 'warn'], console.warn, ...extra);
    }

    public static error(text: string = '', ...extra: any[]) {
        AppLog.toConsole(text, [AppLog.LOG_KEY, 'error'], console.error, ...extra);
    }
}

const logExp = {
    debug: AppLog.debug,
    log: AppLog.log,
    warn: AppLog.warn,
    error: AppLog.error,
}
