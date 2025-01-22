import { SheetType, type ISheetItem } from "../types/AppTypes";

export class SheetItem implements ISheetItem {
    public name: string;
    public url: string;
    public type: SheetType;

    constructor(name: string, path: string, type: SheetType = SheetType.Unknown) {
        this.name = name;
        this.url = path;
        this.type = type;
    }
} 