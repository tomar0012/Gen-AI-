import { LightningElement, api } from 'lwc';
import _executePrompt from '@salesforce/apex/SDLC_InfyAIForceUtility.executePrompt';
import getClassNames from '@salesforce/apex/SDLC_CodeDescriptionController.getClassNames';
import getClassBody from '@salesforce/apex/SDLC_CodeDescriptionController.getClassBody';
import { EXTRACT_DML_OPERATIONS, EXTRACT_SOQL_OPERATIONS, CODE_QUALITY_ASSESSMENT, BUTTONS, ERROR_MESSAGE } from './constant';

export default class SdlcCodeOptimizationPhase extends LightningElement { isLoading = false;
    apexClassName;
    optimizeClassList;
    snippetForOptimization;
    optimizationResponse;
    buttons = BUTTONS;
    errorMessage = ERROR_MESSAGE;

    connectedCallback() {
        this.optimizationClassNames();
    }

    //get all class names from the org.
    optimizationClassNames() {
        getClassNames().then(result => {
            console.log(result);
            if (result && result.length > 0) {
                let options = [];
                result.forEach(element => {
                    options.push({ label: element.Name, value: element.Id });
                });
                this.optimizeClassList = options;
            } else {
                throw new Error('No class names found.');
            }
        }).catch(error => {
            console.error(error);
            this.optimizeClassList = [];
        });
    }

    handleClassChangeForOptimization(event) {
        this.apexClassName = event.target.value;
        this.snippetForOptimization = '';
        console.log(this.apexClassName);
        getClassBody({ className: this.apexClassName }).then(result => {
            console.log('result', result);
            this.snippetForOptimization = result;
        }).catch(error => {
            console.error(error);
            this.snippetForOptimization = '';
        });
    }

    codeQualityAssessment() {
        try {
            this.isLoading = true;
            if (!this.snippetForOptimization) {
                throw new Error('Snippet for optimization is empty.');
            }
            _executePrompt({ prompt: CODE_QUALITY_ASSESSMENT, userInput: this.snippetForOptimization, inputType: 'custom', inputFile: this.fileUploaded }).then(result => {
                this.optimizationResponse = result;
                this.isLoading = false;
                this.buttons.qualityCheckButton = 'neutral';
                this.buttons.dmlCheckButton = 'brand';
                this.buttons.soqlCheckButton = 'brand';
            }).catch(error => {
                console.error(error);
                this.optimizationResponse = this.errorMessage;
                this.isLoading = false;
            });
        } catch (error) {
            console.error(error);
            this.optimizationResponse = this.errorMessage;
            this.isLoading = false;
        }
    }

    extractDML() {
        try {
            this.isLoading = true;
            if (!this.snippetForOptimization) {
                throw new Error('Snippet for optimization is empty.');
            }
            _executePrompt({ prompt: EXTRACT_DML_OPERATIONS, userInput: this.snippetForOptimization, inputType: 'custom', inputFile: this.fileUploaded }).then(result => {
                this.optimizationResponse = result;
                this.isLoading = false;
                this.buttons.qualityCheckButton = 'brand';
                this.buttons.dmlCheckButton = 'neutral';
                this.buttons.soqlCheckButton = 'brand';
            }).catch(error => {
                console.error(error);
                this.optimizationResponse = this.errorMessage;
                this.isLoading = false;
            });
        } catch (error) {
            console.error(error);
            this.optimizationResponse = this.errorMessage;
            this.isLoading = false;
        }
    }

    extractSOQL() {
        try {
            this.isLoading = true;
            if (!this.snippetForOptimization) {
                throw new Error('Snippet for optimization is empty.');
            }
            _executePrompt({ prompt: EXTRACT_SOQL_OPERATIONS, userInput: this.snippetForOptimization, inputType: 'custom', inputFile: this.fileUploaded }).then(result => {
                this.optimizationResponse = result;
                this.isLoading = false;
                this.buttons.qualityCheckButton = 'brand';
                this.buttons.dmlCheckButton = 'brand';
                this.buttons.soqlCheckButton = 'neutral';
            }).catch(error => {
                console.error(error);
                this.optimizationResponse = this.errorMessage;
                this.isLoading = false;
            });
        } catch (error) {
            console.error(error);
            this.optimizationResponse = this.errorMessage;
            this.isLoading = false;
        }
    }

    @api
    refreshData() {
        try {
            this.snippetForOptimization = '';
            this.optimizationResponse = '';
            this.buttons.qualityCheckButton = 'brand';
            this.buttons.dmlCheckButton = 'brand';
            this.buttons.soqlCheckButton = 'brand';
            const codeOptiComboBox = this.template.querySelector('[data-id="codeOpti"]');
            if (codeOptiComboBox) {
                codeOptiComboBox.value = '';
            }
        } catch (error) {
            console.error(error);
            this.optimizationResponse = this.errorMessage;
            this.isLoading = false;
        }
    }}