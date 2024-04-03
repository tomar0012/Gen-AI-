import { LightningElement, api } from 'lwc';
import _executePrompt from '@salesforce/apex/SDLC_InfyAIForceUtility.executePrompt';
import callLLM from '@salesforce/apex/SDLC_SoftwareEngOptimizerController.callLLM';
import { PACKAGE_XML_PROMPT, RELEASE_NOTES_PROMPT, BUTTONS } from './deployConstant';

export default class SdlcDeployPhase extends LightningElement {
    releaseNoteResponse;
    response;
    csvResponse;
    buttons = BUTTONS;
    userInput;
    selectedinputFormatOption = 'Text';
    fileUploaded;
    fileSelected;
    elementId;
    isLoading = false;

    get isFileFormat() {
        return this.selectedinputFormatOption;
    }

    handleFileChanges(event) {
        this.fileUploaded = [];
        if (event.target.files != undefined && event.target.files.length > 0) {
            this.fileSelected = true;
            let file = event.target.files[0];
            let fileSize = Math.round(((file.size) / 1024));
            let freader = new FileReader();
            freader.onload = f => {
                let base64 = 'base64,';
                let content = freader.result.indexOf(base64) + base64.length;
                let fileContents = freader.result.substring(content);
                this.fileUploaded = {
                    Title: file.name,
                    VersionData: fileContents
                }
            };
            freader.readAsDataURL(file);
            console.log('file uploaded::::'+ this.fileUploaded);
        } else {
            this.fileSelected = false;
        }
    }

    executeCSVPrompt(event) {
            this.elementId = event.target.id.split('-')[0];
            this.isLoading = true;
            if ( !this.fileUploaded) {
                throw new Error('User input or file is missing.');
            }

            let parameterDetails = this.generateParameterWrapperDetails('Text'
                                                                        , this.userInput
                                                                        , this.fileUploaded
                                                                        , 'Generate Manifest files'
                                                                        , 'Text'
                                                                        , false);
            console.log('parameter: '+JSON.stringify(parameterDetails));    
            callLLM({parameterDetails:JSON.stringify(parameterDetails)})
            .then(result=>{
                console.log('result '+JSON.stringify(result));
                this.releaseNoteResponse = '';
                this.csvResponse = result;
                this.isLoading = false;
                this.createFeedback('Generate Manifest files','Text');
                this.buttons.manifestButton = 'neutral';
                this.buttons.releasenoteButton = 'brand';
            }).catch(error => {
                console.log(' error==>'+JSON.stringify(error));
                this.csvResponse = 'Sorry I\'m busy can you try later';
                this.isLoading = false;
            });


            // _executePrompt({ prompt: PACKAGE_XML_PROMPT, userInput: this.userInput, inputType: this.selectedinputFormatOption, inputFile: this.fileUploaded }).then(result => {
            //     console.log(result);
            //     this.isLoading = false;
            //     this.csvResponse = result;
            //     this.releaseNoteResponse = '';
            //     this.buttons.manifestButton = 'neutral';
            //     this.buttons.releasenoteButton = 'brand';
            // }).catch(error => {
            //     console.error(error);
            //     this.response = '';
            //     this.csvResponse = '';
            //     this.isLoading = false;
            // });
    }

    executeReleaseNotesPrompt(event) {
            this.elementId = event.target.id.split('-')[0];
            this.isLoading = true;
            if (!this.fileUploaded) {
                throw new Error('Input file is missing.');
            }

            let parameterDetails = this.generateParameterWrapperDetails('Text'
                                                                        , this.userInput
                                                                        , this.fileUploaded
                                                                        , 'Generate Release notes'
                                                                        , 'Text'
                                                                        , false);
            console.log('parameter: '+JSON.stringify(parameterDetails));    
            callLLM({parameterDetails:JSON.stringify(parameterDetails)})
            .then(result=>{
                console.log('result '+JSON.stringify(result));
                this.csvResponse = '';
                this.releaseNoteResponse = result;
                this.createFeedback('Generate Release notes','Text');
                this.isLoading = false;
                this.buttons.releasenoteButton = 'neutral';
                this.buttons.manifestButton = 'brand';
            }).catch(error => {
                console.log(' error==>'+JSON.stringify(error));
                this.releaseNoteResponse = 'Sorry I\'m busy can you try later';
                this.isLoading = false;
            });

            // _executePrompt({ prompt: RELEASE_NOTES_PROMPT, userInput: this.userInput, inputType: this.selectedinputFormatOption, inputFile: this.fileUploaded }).then(result => {
            //     console.log(result);
            //     this.response = result;
            //     this.isLoading = false;
            //     this.releaseNoteResponse = result;
            //     this.csvResponse = '';
            //     this.buttons.releasenoteButton = 'neutral';
            //     this.buttons.manifestButton = 'brand';
            // }).catch(error => {
            //     console.error(error);
            //     this.response = '';
            //     this.releaseNoteResponse = '';
            //     this.isLoading = false;
            // });
    }

    //eport file as .doc and .xml
    createDownloadlink(event) {
        if (this.elementId == "element1") {
            let hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:application/xml;charset=utf-8,' + encodeURI(this.csvResponse);
            hiddenElement.target = '_blank';
            hiddenElement.download = this.fileUploaded.Title.split(".")[0];
            hiddenElement.click();
        } else {
            let hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:application/msword;charset=utf-8,' + encodeURI(this.response);
            hiddenElement.target = '_blank';
            if (this.selectedinputFormatOption != 'Custom') {
                hiddenElement.download = this.fileUploaded.Title.split(".")[0];
            } else {
                hiddenElement.download = 'analysisDoc.doc';
            }
            hiddenElement.click();
        }
    }

    @api
    refreshData() {
        try{
            this.fileUploaded = [];
            this.releaseNoteResponse = '';
            this.csvResponse = '';
            this.buttons.manifestButton = 'brand';
            this.buttons.releasenoteButton = 'brand';
        }catch(error){
            console.error(error);
        }
    }

    generateParameterWrapperDetails(_inputType, _userInput, _inputFile, _actionName, _subActionName, _isExplain){
        const utilityComp = this.template.querySelector('c-sdlc-utility');
        return utilityComp.setParameterWrapperDetails(_inputType, _userInput, _inputFile, _actionName, _subActionName, _isExplain);
    }

    async createFeedback(_actionName,_subActionName){
        const utilityComp = this.template.querySelector('c-sdlc-utility');
        let result = await utilityComp.createFeedback(_actionName,_subActionName);
        console.log('FEEDBACK cREATED '+result);
    }
}