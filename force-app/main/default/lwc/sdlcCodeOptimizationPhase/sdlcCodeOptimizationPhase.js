import { LightningElement,api,track,wire } from 'lwc';
import _executePrompt from '@salesforce/apex/SDLC_InfyAIForceUtility.executePrompt';
import callLLM from '@salesforce/apex/SDLC_SoftwareEngOptimizerController.callLLM';
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



    executeCodeQualityAssessmentPrompt(event){

        console.log('event==>'+event.target.value);
        this.isLoading = true;
        if (!this.snippetForOptimization) {
            throw new Error('Snippet for optimization is empty.');
        }

        let parameterDetails = this.generateParameterWrapperDetails( 'custom'
                                                                    , this.snippetForOptimization
                                                                    , null
                                                                    , 'Generate Code quality assessment'
                                                                    , 'Text'
                                                                    , false);

        console.log('parameter--> '+JSON.stringify(parameterDetails));    

        callLLM({parameterDetails:JSON.stringify(parameterDetails)})
        .then(result=>{
            console.log(result);
            this.optimizationResponse = result;
            this.isLoading = false;
            this.createFeedback('Generate Code quality assessment','Text');
            this.buttons.qualityCheckButton = 'neutral';
            this.buttons.dmlCheckButton = 'brand';
            this.buttons.soqlCheckButton = 'brand';
        })
        .catch(error => {
            console.error('error-->'+error);
            this.optimizationResponse = this.errorMessage;
            this.isLoading = false;
        });
    }
    generateParameterWrapperDetails(_inputType, _userInput, _inputFile, _actionName, _subActionName, _isExplain){
        console.log('Set parameter -->');
        const utilityComp = this.template.querySelector('c-sdlc-utility');
        console.log('Set utilityComp -->'+utilityComp);
        return utilityComp.setParameterWrapperDetails(_inputType, _userInput, _inputFile, _actionName, _subActionName, _isExplain);
    }



    // codeQualityAssessment() {
    //     try {
    //         this.isLoading = true;
    //         if (!this.snippetForOptimization) {
    //             throw new Error('Snippet for optimization is empty.');
    //         }
    //         _executePrompt({ prompt: CODE_QUALITY_ASSESSMENT, userInput: this.snippetForOptimization, inputType: 'custom', inputFile: this.fileUploaded }).then(result => {
             
    //              console.log('userInput -- >'+this.snippetForOptimization); // class 
    //              console.log('inputType -- >'+this.fileUploaded);// undefiend 
    //              console.log('prompt -- >'+this.CODE_QUALITY_ASSESSMENT); // undefiend
    //             this.optimizationResponse = result;
    //             this.isLoading = false;
    //             this.buttons.qualityCheckButton = 'neutral';
    //             this.buttons.dmlCheckButton = 'brand';
    //             this.buttons.soqlCheckButton = 'brand';
    //         }).catch(error => {
    //             console.error(error);
    //             this.optimizationResponse = this.errorMessage;
    //             this.isLoading = false;
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         this.optimizationResponse = this.errorMessage;
    //         this.isLoading = false;
    //     }
    // }

    extractDML() {
        
            this.isLoading = true;
            if (!this.snippetForOptimization) {
                throw new Error('Snippet for optimization is empty.');
            }
        let parameterDetails = this.generateParameterWrapperDetails( 'custom'
                                                                    , this.snippetForOptimization
                                                                    , null
                                                                    , 'Generate DML'
                                                                    , 'Text'
                                                                    , false);

        console.log('parameter--> '+JSON.stringify(parameterDetails));    
        
        callLLM({parameterDetails:JSON.stringify(parameterDetails)})
        .then(result=>{
            this.optimizationResponse = result;
            this.isLoading = false;
            this.createFeedback('Generate DML','Text');
            this.buttons.qualityCheckButton = 'brand';
            this.buttons.dmlCheckButton = 'neutral';
            this.buttons.soqlCheckButton = 'brand';
        })
        .catch(error => {
            console.error(error);
            this.optimizationResponse = this.errorMessage;
            this.isLoading = false;
        });
    }

    extractSOQL() {
       
            this.isLoading = true;
            if (!this.snippetForOptimization) {
                throw new Error('Snippet for optimization is empty.');
            }
           let parameterDetails = this.generateParameterWrapperDetails( 'custom'
                , this.snippetForOptimization
                , null
                , 'Generate SOQL'
                , 'Text'
                , false);

                console.log('parameter--> '+JSON.stringify(parameterDetails));    

                callLLM({parameterDetails:JSON.stringify(parameterDetails)})
                .then(result=>{
                    this.optimizationResponse = result;
                    this.isLoading = false;
                    this.createFeedback('Generate SOQL','Text');
                    this.buttons.qualityCheckButton = 'brand';
                    this.buttons.dmlCheckButton = 'brand';
                    this.buttons.soqlCheckButton = 'neutral';
                })
                .catch(error => {
                    console.error(error);
                    this.optimizationResponse = this.errorMessage;
                    this.isLoading = false;
                });
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
    }

    async createFeedback(_actionName,_subActionName){
        const utilityComp = this.template.querySelector('c-sdlc-utility');
        let result = await utilityComp.createFeedback(_actionName,_subActionName);
        console.log('FEEDBACK cREATED '+result);
    }
}