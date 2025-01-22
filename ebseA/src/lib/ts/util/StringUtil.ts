import * as cheerio from "cheerio";

export class StringUtil {


    public static removeEmptyLines(strA: string, onlySpace: boolean = false, doTrim: boolean = false): string {
        let strB = strA
            .replaceAll("\r", "\n") // replace carriage-return with newline
            .replaceAll(/([\t ]+\n)/g, "\n") //remove spaces/tabs before newlines
            .replaceAll(/(\n+)/g, "\n"); // remove empty lines
        if (onlySpace) {
            //strB = strB.replaceAll(/([ \t\n])/g, " "); // replace \t and \n with ' '
            strB = strB.replaceAll(/([ \t\n]+)/g, " "); // replace \t and \n with ' '
        }
        if (doTrim) {
            strB = strB.trim();
        }
        return strB;
        //.replaceAll(/([ \t]+)/g, " ");
    }

    // remove divs, extract plain text
    public static cleanJiraHtmlA(rawHtml: string) {
        let jqObj = cheerio.load(rawHtml);
        jqObj('div').remove();
        let plain: string = jqObj.text();
        plain = StringUtil.removeEmptyLines(plain, true, true);
        return plain;
    }
}