import { LightningElement } from 'lwc';
import allFAQs from '@salesforce/apex/SDLC_SoftwareEngOptimizerController.getallFAQs';

export default class SdlcHomePageFAQ extends LightningElement {
    FAQs = [];
    
    connectedCallback() {
        this.getallFAQs();
    }

    getallFAQs() {
        allFAQs().then(result => {
            this.FAQs = result;
        }).catch(error => {
            console.log('error', error);
        });
    }
}