export class MyAppError extends Error {
    public info: any;

    constructor(msg: string, info: any = null) {
        super(msg);
        this.info = info;
    }

}