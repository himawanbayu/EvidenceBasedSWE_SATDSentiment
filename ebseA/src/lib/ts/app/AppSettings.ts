import type { IAppSettings, ITimeUnits } from "$lib/ts/types/AppTypes";

export class AppSettings implements IAppSettings {
    public cacheAllowRead = true;
    public cacheAllowWrite = true;
    public cacheMaxAgeVal = 6;
    //cacheMaxAgeUnit: TypeTimeUnit, //keyof AppConst.TIME_UNIT,
    public cacheMaxAgeUnit: keyof ITimeUnits = "month";
    public cacheSkipIncomplete: boolean = false;
}