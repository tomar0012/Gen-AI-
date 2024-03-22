import { LightningElement, api } from 'lwc';
import _executePrompt from '@salesforce/apex/SoftwateEngOptimizerUtilityController.executePrompt';
import { PACKAGE_XML_PROMPT, RELEASE_NOTES_PROMPT, BUTTONS } from './deployConstant';

export default class DeployPhase extends LightningElement {
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
        } else {
            this.fileSelected = false;
        }
    }

    executeCSVPrompt(event) {
        try {
            this.elementId = event.target.id.split('-')[0];
            this.isLoading = true;
            if ( !this.fileUploaded) {
                throw new Error('User input or file is missing.');
            }
            _executePrompt({ prompt: PACKAGE_XML_PROMPT, userInput: this.userInput, inputType: this.selectedinputFormatOption, inputFile: this.fileUploaded }).then(result => {
                console.log(result);
                this.isLoading = false;
                this.csvResponse = result;
                this.releaseNoteResponse = '';
                this.buttons.manifestButton = 'neutral';
                this.buttons.releasenoteButton = 'brand';
            }).catch(error => {
                console.error(error);
                this.response = '';
                this.csvResponse = '';
                this.isLoading = false;
            });
        } catch (error) {
            console.error(error);
            this.response = '';
            this.csvResponse = '';
            this.isLoading = false;
        }
    }

    executeReleaseNotesPrompt(event) {
        try {
            this.elementId = event.target.id.split('-')[0];
            this.isLoading = true;
            if (!this.fileUploaded) {
                throw new Error('Input file is missing.');
            }
            _executePrompt({ prompt: RELEASE_NOTES_PROMPT, userInput: this.userInput, inputType: this.selectedinputFormatOption, inputFile: this.fileUploaded }).then(result => {
                console.log(result);
                this.response = result;
                this.isLoading = false;
                this.releaseNoteResponse = result;
                this.csvResponse = '';
                this.buttons.releasenoteButton = 'neutral';
                this.buttons.manifestButton = 'brand';
            }).catch(error => {
                console.error(error);
                this.response = '';
                this.releaseNoteResponse = '';
                this.isLoading = false;
            });
        } catch (error) {
            console.error(error);
            this.response = '';
            this.releaseNoteResponse = '';
            this.isLoading = false;
        }
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
}