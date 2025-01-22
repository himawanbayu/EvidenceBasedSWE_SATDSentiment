import model from 'wink-eng-lite-web-model'
import WinkFn from 'wink-nlp'

//import sentiment from 'wink-sentiment'
 

import { MYP } from '../app/MyApp';

export class WinkUtil {
    protected static NLP = WinkFn(model);

    public static determineSentiment(text: string) {
        const nlp = WinkUtil.NLP;
        const doc = nlp.readDoc(text);
        return doc.out(nlp.its.sentiment);
    }

    public static testFuncA() {
        //nlp.readDoc()
        const text = 'Anonymized, secure, and free Terraform cost estimation based on Terraform plan (0.12+) or Terraform state (any version).';
        //const nlp = WinkFn(model);
        const nlp = WinkUtil.NLP;
        const doc = nlp.readDoc(text);        
        MYP.log('WinkUtil.testFuncA()', doc.entities());
    }

    public static testFuncB(text: string = 'Anonymized, secure, and free Terraform cost estimation based on Terraform plan (0.12+) or Terraform state (any version).') {
        //nlp.readDoc()

        const nlp = WinkUtil.NLP;
        const doc = nlp.readDoc(text);
        let senti = doc.out(nlp.its.sentiment);
        //doc.out(i);
        //sentimen
        //doc.se
        //WinkFn

        MYP.log('WinkUtil.testFuncB()', senti);
    }


}