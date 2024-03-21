import { LightningElement } from 'lwc';
import getUsefulTips from '@salesforce/apex/SoftwareEngOptimizerController.getUsefulTips';
export default class SdlcTips extends LightningElement {
    Tips = [];
    
    connectedCallback() {
        this.getTips();
    }

    getTips() {
        getUsefulTips().then(result => {
            this.Tips = result;
        }).catch(error => {
            console.log('error', error);
        });
    }
}