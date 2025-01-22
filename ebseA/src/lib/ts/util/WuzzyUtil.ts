import { jarowinkler } from "wuzzy";

export class WuzzyUtil {


    public static calcStrDistJaroWink(strA: string, strB: string) {
        return jarowinkler (strA, strB);
    }
}