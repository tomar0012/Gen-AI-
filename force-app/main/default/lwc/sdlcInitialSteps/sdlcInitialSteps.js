import { LightningElement } from 'lwc';
import getInstructions from '@salesforce/apex/SDLC_SoftwareEngOptimizerController.getInitialSteps';
export default class SdlcInitialSteps extends LightningElement {

    instructions = [];
    activeSections = [];

    connectedCallback() {
        this.getInitialSteps()
    }

    getInitialSteps() {
        getInstructions().then(result => {
            this.instructions = result;
            this.instructions.forEach(element => {
                this.activeSections.push(element.DeveloperName);
            });
        }).catch(error => {
            console.log('error', error);
        });
    }
}