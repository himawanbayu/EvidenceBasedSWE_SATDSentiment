import * as cheerio from "cheerio";
import { MYP } from "../app/MyApp";
import { StringUtil } from "./StringUtil";
import { AppCfg } from "../app/AppCfg";
import type { IJiraIssue } from "../types/AppTypes";
//import { Element } from "domhandler";
//import { XMLParser } from "fast-xml-parser";

export class JiraUtil {

    public static genIssuePageUrlA(issueId: string, doUppercase: boolean = true): string {
        // issueId i.e. CAMEL-10009
        let str = doUppercase ? issueId.toUpperCase() : issueId;
        return AppCfg.URLS.ext.jiraPageA.replaceAll('{id}', str);
    }

    public static genIssueXmlUrlA(issueId: string, doUppercase: boolean = true): string {
        // issueId i.e. CAMEL-10009
        let str = doUppercase ? issueId.toUpperCase() : issueId;
        return AppCfg.URLS.ext.jiraDataXmlA.replaceAll('{id}', str);
    }

    public static isJiraUrl(url: string): boolean {
        return url.toLowerCase().includes('/jira/');
    }

    public static genXmlIssueUrl(id: string): string {
        return AppCfg.URLS.ext.jiraDataXmlA.replaceAll('{id}', id);
    }

    public static processIssueXml(url: string, xmlData: string):IJiraIssue {
        const jqObj = cheerio.load(xmlData, { xml: true });


        let objA = jqObj('channel > item').extract({        
            project: {
                selector: 'project',
                value: (el, key) => { return jqObj(el).text().toLowerCase(); }
            },
            issueNr: { // id is based on the xml field 'key'
                selector: 'key',
                value: (el, k) => {
                    let str = jqObj(el).text();
                    let parts = str.split('-');
                    if (parts.length == 2 && parts[1].length > 0) {
                        return parts[1];
                    }
                    MYP.warn('unable to deterime id for key: ' + str);
                    return '';
                }
            },
            summary: {
                selector: 'summary',
                value: (el, key) => { return jqObj(el).text(); }
            },
            description: {
                selector: 'description',
                value: (el, key) => { return StringUtil.cleanJiraHtmlA(jqObj(el).text()); }
            },
            created: 'created',
            updated: 'updated',
            resolved: 'resolved',
            comments: [{
                selector: 'comments > comment',
                value: (el, key) => {
                    let elObj = jqObj(el);
                    let obj = {
                        text: StringUtil.cleanJiraHtmlA(elObj.text()),
                        created: elObj.attr('created'),
                        author: elObj.attr('author'),
                    };
                    return obj;
                }
            }],
            // key: 'key',
            // link: 'link',
            // title: 'title',
        });
        let res:IJiraIssue = objA as unknown as IJiraIssue;
        //MYP.log('processIssueXml res', res);
        return res;
    }

}



/***** [ OLD CODE ] *****/
/**

public static cleanHtmlStr(htmlStr: string, removeTags: string[] = [], doCleanNewLines: boolean) {
    const jqObj = cheerio.load(htmlStr);
    removeTags.forEach((tag) => {
        jqObj(tag).remove();
    });
    let strOut = jqObj.text();
    if (doCleanNewLines) {
        strOut = StringUtil.removeEmptyLines(strOut, false, true);
    }
    return strOut;
}

protected static extractItemData(jqObj: cheerio.CheerioAPI, el: Element, key: string) {
    let itemElem = jqObj(el);
    let objB = itemElem.extract({
        project: 'project',
        title: 'title',
        link: 'link',
    });
    let objA = {
        project: jqObj(el).find('project').text(),
        title: jqObj(el).find('title').text(),
        link: jqObj(el).find('link').text(),
    }
    //return jqObj(el).find('title').text();
    return objA;
}

public static processIssueXml_OLD5(url: string, xmlData: string) {

    let parser = new XMLParser();
    let xmlObj = parser.parse(xmlData);
    let objA = xmlObj;// JSON.stringify(xmlObj, null, 2);

    MYP.log('processIssueXml objItem', objA);
    return objA;
}


public static processIssueXml_OLD4(url: string, xmlData: string) {
    MYP.log('zz##', xmlData);

    const jqObj = cheerio.load(xmlData);
    let str: string;
    let objB = jqObj('channel > item').extract({
        project: 'project',
        link: 'link',
        title: 'title',
        description: 'description',
    });

    let extractFunc = function (el: Element, key: string) {
        //return jqObj(el).find('title').text();
    }

    let objC = jqObj('channel').extract({
        item: {
            selector: 'item',
            value: (el, key) => {
                //return JiraUtil.extractItemData(jqObj, el, key);
                let itemElem = jqObj(el);
                let resA = {
                    project: jqObj(el).find('project').text(),
                    title: jqObj(el).find('title').text(),
                    link: jqObj(el).find('link').text(),
                };
                return resA;
            }
        }
    });

    let objD = jqObj('channel  item ').extract({

        project: 'project',
        title: 'title',
        link: 'link',

    });

    let bbb = jqObj('channel').find('item').prop('outerHTML');
    bbb = bbb ? bbb : '';
    let parser = new XMLParser();
    let xmlObj = parser.parse(bbb);
    //let xmlObj = parser.parse(xmlData);
    let objA = xmlObj;// JSON.stringify(xmlObj, null, 2);

    MYP.log('processIssueXml objItem', objA);
    return objA;
}

public static processIssueXml_OLD3(url: string, xmlData: string) {
    const jqObj = cheerio.load(xmlData);
    let str: string;
    let elemItem = jqObj('channel > item');

    let objItem = elemItem.extract({
        title: 'title',
        summary: 'summary',
        description: 'description',
        created: 'created',
        updated: 'updated',
        resolved: 'resolved',
        //comments: ['comments > comment'],
        //"innerText" | "innerHTML" | "outerHTML" | "textContent"
        //comments: { selector: 'comments > comment', value: { content: 'textContent', created: 'created', author: 'author', } },
        commentsA: [{ selector: 'comment', value: 'outerHTML' }],
        //commentsB: [{ selector: 'comment', value: { content: 'outerHTML' } }],
        commentsB: [{ selector: 'comments > comment', value: 'outerHTML' }],
        //commentsC: [{ selector: 'comments', value: { content: ['comment'] , xys:'prop(author)'} }],
        commentsC: [{ selector: 'comments', value: { content: ['comment'] } }],

    });

    if (objItem.description) {
        objItem.description = JiraUtil.cleanHtmlStr(objItem.description, ['div'], true);
    }
    if (objItem.summary) {
        objItem.summary = JiraUtil.cleanHtmlStr(objItem.summary, ['div'], true);
    }

    // let comments: string[] = [];
    // let arr = objItem.comments;
    // objItem.comments.forEach((val, idx) => {
    //     comments.push(JiraUtil.cleanHtmlStr(val, ['div'], true));
    // });
    // objItem.comments = comments;


    // arr.forEach((val, idx) => {            
    // });




    //let objA = jqObj('channel >  item').html();


    //MYP.log('processIssueXml objA', objA);
    MYP.log('processIssueXml objItem', objItem);
    return objItem;
}

public static processIssueXml_OLD2(url: string, xmlData: string) {
    const jqObj = cheerio.load(xmlData);
    let str: string;
    let elem: cheerio.CheerioAPI;


    //elem = 
    let objA = jqObj.extract({
        title: 'channel > item > title',
        summary: 'channel > item > summary',
        description: 'channel > item > description',
        created: 'channel > item > created ',
    });

    let objB = jqObj.extract({
        item: 'channel > item',
    });

    //MYP.log('processIssueXml objA', objA);
    MYP.log('processIssueXml objB', objB);
    return objB;
}


public static processIssueXml_OLD(url: string, xmlData: string) {
    const jqObj = cheerio.load(xmlData);
    let str: string;
    let elem: cheerio.CheerioAPI;

    //summary
    let summary: string = jqObj('channel > item > summary').text();

    //description
    str = jqObj('channel > item > description ').text(); // description contains html
    elem = cheerio.load(str);
    elem('div').remove()
    let descr: string = StringUtil.removeEmptyLines(elem.text(), true, true);


    let objA: IJiraIssue = {
        url: url,
        //summary: 'SUMMARY',
        summary: summary,
        description: descr,
        created: jqObj('channel > item > created').text(),
        updated: '',
        resolved: '',
    };
    MYP.log('processIssueXml objA', objA);
    return objA;
}    

 */
