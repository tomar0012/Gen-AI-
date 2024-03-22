import { LightningElement, api } from 'lwc';
import getFilteredApexClass from '@salesforce/apex/CodeDescriptionController.getFilteredApexClass';
import getClassBody from '@salesforce/apex/CodeDescriptionController.getClassBody';
import _executePrompt from '@salesforce/apex/SoftwateEngOptimizerUtilityController.executePrompt';
import { GENERATE_FUNCTIONAL_DESCRIPTION, GENERATE_TECH_DESCRIPTION, BUTTONS, ERROR_MESSAGE } from './bpeConstant';

export default class BusinessProcessExtractionPhase extends LightningElement {
    snippet;
    buttons = BUTTONS;
    reverseResponse;
    apexClassName;
    filteredClassList;
    isLoading = false;
    errorMessage = ERROR_MESSAGE;

    connectedCallback() {
        this.filteredclassNames();
    }

    //get filtered classes (excluding test class)
    filteredclassNames() {
        try {
            getFilteredApexClass().then(result => {
                console.log(result);
                if (result && result.length > 0) {
                    let options = [];
                    result.forEach(element => {
                        options.push({ label: element.Name, value: element.Id });
                    });
                    this.filteredClassList = options;
                } else {
                    throw new Error('No filtered class names found.');
                }
            }).catch(error => {
                console.error(error);
                this.filteredClassList = this.errorMessage;
            });
        } catch (error) {
            console.error(error);
            this.filteredClassList = this.errorMessage;
        }
    }

    handleClassChange(event) {
        try {
            this.apexClassName = event.target.value;
            this.snippet = '';
            console.log(this.apexClassName);
            getClassBody({ className: this.apexClassName }).then(result => {
                console.log('result', result);
                this.snippet = result;
            }).catch(error => {
                console.error(error);
                this.snippet = this.errorMessage;
            });
        } catch (error) {
            console.error(error);
            this.snippet = this.errorMessage;
        }
    }

    createFunctionalDescriptionPrompt() {
        try {
            this.isLoading = true;
            if (!this.snippet) {
                throw new Error('Snippet is empty.');
            }
            _executePrompt({ prompt: GENERATE_FUNCTIONAL_DESCRIPTION, userInput: this.snippet, inputType: 'custom', inputFile: this.fileUploaded }).then(result => {
                console.log(result);
                this.reverseResponse = result;
                this.isLoading = false;
                this.buttons.fdsButton = 'neutral';
                this.buttons.tdsButton = 'brand';
            }).catch(error => {
                console.error(error);
                this.reverseResponse = this.errorMessage;
                this.isLoading = false;
            });
        } catch (error) {
            console.error(error);
            this.reverseResponse = this.errorMessage;
            this.isLoading = false;
        }
    }

    createTechDescriptionPrompt() {
        try {
            this.isLoading = true;
            if (!this.snippet) {
                throw new Error('Snippet is empty.');
            }
            _executePrompt({ prompt: GENERATE_TECH_DESCRIPTION, userInput: this.snippet, inputType: 'custom', inputFile: this.fileUploaded }).then(result => {
                this.reverseResponse = result;
                this.isLoading = false;
                this.buttons.tdsButton = 'neutral';
                this.buttons.fdsButton = 'brand';
            }).catch(error => {
                console.error(error);
                this.reverseResponse = this.errorMessage;
                this.isLoading = false;
            });
        } catch (error) {
            console.error(error);
            this.reverseResponse = this.errorMessage;
            this.isLoading = false;
        }
    }

    @api refreshData() {
        try {
            this.reverseResponse = '';
            this.snippet = '';
            this.buttons.tdsButton = 'brand';
            this.buttons.fdsButton = 'brand';
            const bpeComboBox = this.template.querySelector('[data-id="businessProcess"]');
            if (bpeComboBox) {
                bpeComboBox.value = '';
            }
        } catch (error) {
            console.error(error);
            this.reverseResponse = this.errorMessage;
            this.isLoading = false;
        }
    }
}