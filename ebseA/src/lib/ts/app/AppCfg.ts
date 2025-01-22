//import { DatasetType, type IDatasetCollection } from "$lib/ts/types/AppTypes"; //$lib/ts/types/AppTypes
//import { AppConst } from "$lib/ts/app/AppConst";
import { SheetType } from "$lib/ts/types/AppTypes";
import { SheetItem } from "$lib/ts/structs/SheetItem";

export class AppCfg {
    public static TEST_ABC = 'abc 123 999';

    public static MY_SHEETS: SheetItem[] = [
        new SheetItem('code_comments', '/csv/satd-dataset-code_comments.csv', SheetType.CodeComment),
        new SheetItem('commit_messages', '/csv/satd-dataset-commit_messages.csv', SheetType.CommitMsg),
        new SheetItem('issues', '/csv/satd-dataset-issues.csv', SheetType.Issue),
        new SheetItem('pull_requests', '/csv/satd-dataset-pull_requests.csv', SheetType.PullReq),
    ];

    


    public static URLS = {
        ext: {
            // i.e. https://issues.apache.org/jira/browse/CAMEL-10009
            jiraPageA: 'https://issues.apache.org/jira/browse/{id}',

            // i.e. https://issues.apache.org/jira/si/jira.issueviews:issue-xml/CAMEL-10009/CAMEL-10009.xml
            jiraDataXmlA: 'https://issues.apache.org/jira/si/jira.issueviews:issue-xml/{id}/{id}.xml',

            // i.e. https://issues.apache.org/jira/si/jira.issueviews:issue-html/CAMEL-10009/CAMEL-10009.html 
            jiraDataHtmlA: 'https://issues.apache.org/jira/si/jira.issueviews:issue-html/{id}/{id}.html',

            // i.e. https://issues.apache.org/jira/si/com.atlassian.jira.plugins.jira-importers-plugin:issue-json/CAMEL-10009/CAMEL-10009.json
            jiraDataJsonA: 'https://issues.apache.org/jira/si/com.atlassian.jira.plugins.jira-importers-plugin:issue-json/{id}/{id}.json',

            // i.e.  https://issues.apache.org/jira/si/jira.issueviews:issue-word/CAMEL-10009/CAMEL-10009.doc
            jiraDataWordA: 'https://issues.apache.org/jira/si/jira.issueviews:issue-word/{id}/{id}.doc',

        },
        local: {
            root: '/',
        }
    }
}


