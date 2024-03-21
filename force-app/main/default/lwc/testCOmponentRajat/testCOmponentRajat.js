import { LightningElement, track } from 'lwc';
import IMAGE from '@salesforce/resourceUrl/ChatGPT';
import LightningAlert from 'lightning/alert';
import getDescription from '@salesforce/apex/CodeDescriptionController.getDescription';
import getClassNames from '@salesforce/apex/CodeDescriptionController.getClassNames';
import getFilteredApexClass from '@salesforce/apex/CodeDescriptionController.getFilteredApexClass';
import getClassBody from '@salesforce/apex/CodeDescriptionController.getClassBody';
import _executePrompt from '@salesforce/apex/SoftwateEngOptimizerUtilityController.executePrompt';
import { USER_STORY_PROMPT, USER_STORY_VALIDATION_PROMPT_CUSTOM, USER_STORY_VALIDATION_PROMPT_Text, PACKAGE_XML_PROMPT , RELEASE_NOTES_PROMPT ,CREATE_TEST_CLASS_PROMPT,GENERATE_FUNCTIONAL_DESCRIPTION,GENERATE_TECH_DESCRIPTION,EXTRACT_DML_OPERATIONS,EXTRACT_SOQL_OPERATIONS,CODE_QUALITY_ASSESSMENT } from './prompts';


export default class TestComponentRajat extends LightningElement {

    userStoryPromot = 'Write a user story for for the requirement given below';
    className;
    snippet;
    snippetForOptimization;
    snippetForTest;
    response;
    validatedResponse;
    classList;
    optimizeClassList;
    filteredClassList;
    prompt;
    elementId;
    testResponse;
    reverseResponse;
    optimizationResponse;
    csvResponse;
    releaseNoteResponse;
    buttonBrand1='brand';
    buttonBrand2='brand';
    buttonBrand3='brand';
    buttonBrand4='brand';
    buttonBrand5='brand';
    buttonBrand6='brand';
    buttonBrand7='brand';
    value = '';
    genUserStories='';
    valUserStories='';


    get options() {
        return [
            { label: 'Generate User Stories', value: 'option1' },
            { label: 'Validate User Stories', value: 'option2' },
        ];
    }

    connectedCallback() {
        this.classNames()
        this.filteredclassNames()
        this.optimizationClassNames()
    }

    handleRadioChange(event) {
        console.log({ event })

        this.value = event.detail.value;
        this.genUserStories = this.value === 'option1';
        this.valUserStories = this.value === 'option2';

    }

    classNames() {
        getClassNames().then(result => {
            console.log(result);
            let options = [];
            result.forEach(element => {
                options.push({ label: element.Name, value: element.Id });
            });
            this.classList = options;
        }).catch(error => {
            this.classList = error;
        });
    }

    optimizationClassNames() {
        getClassNames().then(result => {
            console.log(result);
            let options = [];
            result.forEach(element => {
                options.push({ label: element.Name, value: element.Id });
            });
            this.optimizeClassList = options;
        }).catch(error => {
            this.optimizeClassList = error;
        });
    }

    filteredclassNames() {
        getFilteredApexClass().then(result => {
            console.log(result);
            let options = [];
            result.forEach(element => {
                options.push({ label: element.Name, value: element.Id });
            });
            this.filteredClassList = options;
        }).catch(error => {
            this.filteredClassList = error;
        });
    }

    handleClassChange(event) {
        this.className = event.target.value;
        this.highlightedCode = '';
        this.snippet = '';
        console.log(this.className);
        getClassBody({ className: this.className }).then(result => {
            console.log('result', result);
            this.snippet = result;
        }).catch(error => {
            this.snippet = error;
        });
    }
    handleClassChangeForTest(event) {
        this.className = event.target.value;
        console.log(event);
        this.highlightedCode = '';
        this.snippetForTest = '';
        console.log(this.className);
        getClassBody({ className: this.className }).then(result => {
            console.log('result', result);
            this.snippetForTest = result;
        }).catch(error => {
            this.snippetForTest = error;
        });
    }

    handleClassChangeForOptimization(event) {
        this.className = event.target.value;
        this.highlightedCode = '';
        this.snippetForOptimization = '';
        console.log(this.className);
        getClassBody({ className: this.className }).then(result => {
            console.log('result', result);
            this.snippetForOptimization = result;
        }).catch(error => {
            this.snippetForOptimization = error;
        });
    }

    handleChange(event) {
        this.snippet = event.target.value;
    }

    showSpinner = false;
    handleClick() {
        console.log(this.snippet);
        if (this.snippet == null || this.snippet == '' || this.snippet == undefined) {
            LightningAlert.open({
                message: 'Please Select the code snippet',
                theme: 'error', // a red theme intended for error states
                label: 'Error!', // this is the header text
            });
        } else {
            let snippet;
            this.showSpinner = true;
            if (window.getSelection) {
                snippet = window.getSelection().toString();
            }
            else if (document.selection) {
                snippet = document.selection.createRange().text;
            }
            if (snippet == null || snippet == '') {
                snippet = this.snippet;
            }
            getDescription({ snippet: snippet, prompt: this.prompt }).then(result => {
                console.log(result);
                this.response = result;
                this.showSpinner = false;
            }).catch(error => {
                this.response = 'Sorry I\'m busy can you try later';
                this.showSpinner = false;
            });
        }
    }

    extractDML() {
        this.prompt = 'Where and what are the DML operations performed in this snippet?';
        this.handleClick();
    }

    extractSOQL() {
        this.prompt = 'Where and what are the SOQL queries performed in this snippet?';
        this.handleClick();
    }

    description() {
        this.prompt = 'Write Description of this code snippet as a developer can understand all technical details';
        this.handleClick();
    }

    bestPractices() {
        this.prompt = 'What are the best practices not followed in this code snippet?';
        this.handleClick();
    }

    testClass() {
        this.prompt = 'Write Apex test class for this code snippet ?';
        this.handleClick();
    }

    summary() {
        this.prompt = 'Write summary of this code snippet in less than 1000 words for a person who doesn\'t know how to code';
        this.handleClick();
    }


    customCode;
    customCodeResponse;

    handleCustomCodeChange(event) {
        this.customCode = event.target.value;
    }
    async handleCustomCodeClick(event) {
        const selectedItemValue = event.detail.value;
        let selectedItemLabel;
        console.log(selectedItemValue);
        this.menuOptions.find(item => {
            if (item.value === selectedItemValue) {
                selectedItemLabel = item.label;
            }
        });
        console.log(selectedItemLabel);
        switch (selectedItemLabel) {
            case 'Functional Description': {
                this.prompt = 'Write summary of this code snippet in less than 1000 words for a person who doesn\'t know how to code';
                this.handleCustomCode();
                break;
            }
            case 'Technical Description': {
                this.prompt = 'Write Description of this code snippet as a developer can understand all technical details';
                this.handleCustomCode();
                break;
            }

            case 'Extract DML Operations': {
                this.prompt = 'Where and what are the DML operations performed in this snippet?';
                this.handleCustomCode();
                break;
            }
            case 'Extract SOQL Queries': {
                this.prompt = 'Where and what are the SOQL queries performed in this snippet?';
                this.handleCustomCode();
                break;
            }
            case 'Write Test Class': {
                this.prompt = 'Write Apex test class for this code snippet ?';
                this.handleCustomCode();
                break;
            }
            case 'Code Quality Assessment': {
                this.prompt = 'What are the best practices not followed in this code snippet?';
                this.handleCustomCode();
                break;
            }
        }
    }
    handleCustomCode() {
        this.showSpinner = true;
        if (this.customCode == null || this.customCode == '' || this.customCode == undefined) {
            LightningAlert.open({
                message: 'Please add the code snippet',
                theme: 'error', // a red theme intended for error states
                label: 'Error!', // this is the header text
            });
        } else {
            console.log('customcode:', this.customCode);
            getDescription({ snippet: this.customCode }).then(result => {
                console.log(result);
                this.customCodeResponse = result;
                this.showSpinner = false;
            }).catch(error => {
                this.customCodeResponse = error;
                this.showSpinner = false;
            });
        }
    }

    imageUrl = IMAGE;
    menuOptions = [
        { label: 'Functional Description', value: 'Functional Description' },
        { label: 'Technical Description', value: 'Technical Description' },
        { label: 'Extract DML Operations', value: 'DML Operations' },
        { label: 'Extract SOQL Queries', value: 'SOQL Queries' },
        { label: 'Write Test Class', value: 'Test Class' },
        { label: 'Code Quality Assessment', value: 'Code Quality' },
    ];

    async handleMenuSelect(event) {
        // retrieve the selected item's value
        const selectedItemValue = event.detail.value;
        let selectedItemLabel;
        console.log(selectedItemValue);
        this.menuOptions.find(item => {
            if (item.value === selectedItemValue) {
                selectedItemLabel = item.label;
            }
        });
        console.log(selectedItemLabel);
        switch (selectedItemLabel) {
            case 'Functional Description': {
                this.prompt = 'Write summary of this code snippet in less than 1000 words for a person who doesn\'t know how to code';
                this.handleClick();
                break;
            }
            case 'Technical Description': {
                this.prompt = 'Write Description of this code snippet as a developer can understand all technical details';
                this.handleClick();
                break;
            }

            case 'Extract DML Operations': {
                this.prompt = 'Where and what are the DML operations performed in this snippet?';
                this.handleClick();
                break;
            }
            case 'Extract SOQL Queries': {
                this.prompt = 'Where and what are the SOQL queries performed in this snippet?';
                this.handleClick();
                break;
            }
            case 'Write Test Class': {
                this.prompt = 'Write Apex test class for this code snippet ?';
                this.handleClick();
                break;
            }
            case 'Code Quality Assessment': {
                this.prompt = 'What are the best practices not followed in this code snippet?';
                this.handleClick();
                break;
            }
        }
    }


    addToConversation(message) {
        this.conversation = [...this.conversation, message];
    }
    createAssistantMessage(message) {
        const assistantMessage = {
            role: 'AI Assistant',
            text: message,
            liClass: this.assistantInputStyle[0],
            containerClass: this.assistantInputStyle[1],
            textClass: this.assistantInputStyle[2],
            isBot: true
        };
        return assistantMessage;
    }
    createUserMessage(message) {
        const userMessage = {
            role: 'Agent',
            text: message,
            liClass: this.userInputStyle[0],
            containerClass: this.userInputStyle[1],
            textClass: this.userInputStyle[2],
            isBot: false
        };
        return userMessage;
    }

    @track
    fileUploaded ={};
   
    fileSelected;
    @track
    response;
    handleFileChanges(event) {
        this.filesUploaded=[];
        if(event.target.files!=undefined && event.target.files.length>0){
        this.fileSelected=true;    
        let file = event.target.files[0];

        let fileSize = Math.round(((file.size) / 1024));
       

        let freader = new FileReader();
        freader.onload = f => {
            let base64 = 'base64,';
            let content = freader.result.indexOf(base64) + base64.length;
            let fileContents = freader.result.substring(content);
            this.fileUploaded={
                Title: file.name,
                VersionData: fileContents
            }
          
        };
        freader.readAsDataURL(file);
        console.log('file uploaded::::'+ JSON.stringify(this.fileUploaded));
       }else{
         this.fileSelected=false;
       }
    }

    value = '';

    get inputFormatOptions() {
        return [
            { label: 'Text', value: 'Text' },
            { label: 'Audio', value: 'Audio' },
            { label: 'Video', value: 'Video' },
            { label: 'Chat Transcript', value: 'ChatTranscript' },
            { label: 'Custom', value: 'Custom' },
        ];
    }

    get inputFormatOptionsForValidation() {
        return [
            { label: 'File(.doc)', value: 'Text' },
            { label: 'Custom', value: 'Custom' },
        ];
    }


    selectedinputFormatOption='Text';
    userInput;

    handleinputFormatOptionChange(event) {
        this.selectedinputFormatOption = event.detail.value;
    }

    get isCustomInputFormat() {
        return this.selectedinputFormatOption === 'Custom';
    }

    get isFileFormat() {
        return this.selectedinputFormatOption === 'Audio' || this.selectedinputFormatOption === 'Text' || this.selectedinputFormatOption === 'ChatTranscript';
    }

    isLoading = false;

    executePrompt(event){
        console.log('event==>'+event.target.value);
        this.isLoading = true;
        this.elementId = event.target.id
        _executePrompt({ prompt: USER_STORY_PROMPT,userInput:this.userInput, inputType:this.selectedinputFormatOption,inputFile:this.fileUploaded }).then(result => {
            console.log(result);
            this.response = result;
            this.isLoading = false;
        }).catch(error => {
            this.response = 'Sorry I\'m busy can you try later';
            this.isLoading = false;
        });
    }

    userInputChanged(event){
        this.userInput = event.target.value;
        console.log(' this.userInput==>'+ this.userInput);
    }

    executeValidationPrompt(event){
        console.log('event==>'+event.target.value);
        this.isLoading = true;
        this.elementId = event.target.id
        // if(this.selectedinputFormatOption == 'Text'){
        //     _executePrompt({ prompt: USER_STORY_VALIDATION_PROMPT_Text,userInput:this.userInput, inputType:this.selectedinputFormatOption,inputFile:this.fileUploaded }).then(result => {
        //         console.log(result);
        //         this.response = result;
        //         this.validatedResponse = result;
        //         this.isLoading = false;
        //     }).catch(error => {
        //         this.validatedResponse = 'Sorry I\'m busy can you try later';
        //         this.isLoading = false;
        //     });
        // }else{
            _executePrompt({ prompt: USER_STORY_VALIDATION_PROMPT_CUSTOM,userInput:this.userInput, inputType:this.selectedinputFormatOption,inputFile:this.fileUploaded }).then(result => {
                console.log(result);
                console.log('this.selectedinputFormatOption==>'+this.selectedinputFormatOption);
                this.response = result;
                this.validatedResponse = result;
                this.isLoading = false;
            }).catch(error => {
                this.validatedResponse = 'Sorry I\'m busy can you try later';
                this.isLoading = false;
            });
        //}
       
    }

    executeCSVPrompt(event){
        console.log('event==>'+event.target.id);
        this.elementId = event.target.id
        this.isLoading = true;
        _executePrompt({ prompt: PACKAGE_XML_PROMPT,userInput:this.userInput, inputType:this.selectedinputFormatOption,inputFile:this.fileUploaded }).then(result => {
            console.log(result);
            //this.response = result;
            this.isLoading = false;
            this.csvResponse = result;
            this.releaseNoteResponse = '';
            this.buttonBrand1='neutral';
            this.buttonBrand2='brand';
        }).catch(error => {
            this.response = '';
            this.csvResponse ='';
            this.isLoading = false;
            console.log(error)
        });
    }
    executeReleaseNotesPrompt(event){
        console.log('event==>'+event.target.id);
        this.elementId = event.target.id

        this.isLoading = true;
        _executePrompt({ prompt: RELEASE_NOTES_PROMPT,userInput:this.userInput, inputType:this.selectedinputFormatOption,inputFile:this.fileUploaded }).then(result => {
            console.log(result);
           // this.response = result;
            console.log('fileName===>'+JSON.stringify(this.fileUploaded));
            this.isLoading = false;
            this.releaseNoteResponse = result;
            this.csvResponse = '';
            this.buttonBrand2='neutral';
            this.buttonBrand1='brand';
        }).catch(error => {
            this.response = '';
            this.releaseNoteResponse = '';
            this.isLoading = false;
            console.log(error)
        });
    }

    createDownloadlink(event){
        console.log('element==>'+this.elementId);
        // console.log('fileUploadd===>'+this.fileUploaded.Title.split(".")[0]);
        // console.log('fileupload2===>'+JSON.stringify(this.fileUploaded));
        
        // if(this.elementId == "element2-94" || this.elementId == "elementAnalysis-87" ||this.elementId == "elementValidate-95"||this.elementId == "elementValidate-88"||this.elementId == "elementAnalysis-94" || this.elementId == "elementValidate-94" || this.elementId == "elementValidate-87" || this.elementId == "element2-87"){
        //     console.log('element==>'+this.fileUploaded.Title.split(".")[0]);
        // let hiddenElement=document.createElement('a');
        // hiddenElement.href = 'data:application/msword;charset=utf-8,' + encodeURI(this.response);
        // hiddenElement.target = '_blank';
        // if(this.fileUploaded){
        //     hiddenElement.download =  this.fileUploaded.Title.split(".")[0];
        // }else{
        //     hiddenElement.download = 'analysisDoc';
        // }    //'releaseNotes' //this.fileName+this.format;
        // console.log('hiddenElement===>'+hiddenElement); 
        // hiddenElement.click();
        // }
        // else 


        if(this.elementId == "element1-94" || this.elementId == "element1-87"){
                let hiddenElement=document.createElement('a');
                hiddenElement.href = 'data:application/xml;charset=utf-8,' + encodeURI(this.response);
                hiddenElement.target = '_blank';
                hiddenElement.download = this.fileUploaded.Title.split(".")[0] //'package' //this.fileName+this.format; 
                hiddenElement.click();
        }
        else if(this.elementId == "elementTest-1-87" || this.elementId == "elementTest-1-94"){
                let hiddenElement=document.createElement('a');
                hiddenElement.href = 'data:text/plain;charset=utf-8,' + encodeURI(this.response);
                hiddenElement.target = '_blank';
                hiddenElement.download =  'testClass' //this.fileName+this.format; 
                console.log('hiddenElement===>'+hiddenElement); 

                hiddenElement.click();
                
        }else{
        let hiddenElement=document.createElement('a');
        //console.log('hiddenElement==>'+hiddenElement);
        hiddenElement.href = 'data:application/msword;charset=utf-8,' + encodeURI(this.response);
         console.log('hiddenElement.href1==>');
        hiddenElement.target = '_blank';
        if(this.selectedinputFormatOption!='Custom'){
            console.log('hiddenElement.href2==>');
            hiddenElement.download =  this.fileUploaded.Title.split(".")[0];
        }else{
            console.log('hiddenElement.href3==>');
            hiddenElement.download = 'analysisDoc.doc';
        }    //'releaseNotes' //this.fileName+this.format;
        console.log('hiddenElement.href4==>');

        hiddenElement.click();
        console.log('hiddenElement.href5==>');


        }
    }

    executeCreateTestClassPrompt(event){
        this.isLoading = true;
        this.elementId = event.target.id;
        _executePrompt({ prompt: CREATE_TEST_CLASS_PROMPT,userInput:this.snippetForTest, inputType:'custom',inputFile:this.fileUploaded }).then(result => {
            console.log(result);
            console.log("====>"+JSON.stringify(this.snippetForTest));
            console.log("====>a"+JSON.stringify(this.fileUploaded ));
            this.testResponse = result;
            this.isLoading = false;
        }).catch(error => {
            this.response = 'Sorry I\'m busy can you try later';
            this.isLoading = false;
        });
    }

    createFunctionalDescriptionPrompt(){
        this.isLoading = true;
        _executePrompt({ prompt: GENERATE_FUNCTIONAL_DESCRIPTION,userInput:this.snippet, inputType:'custom',inputFile:this.fileUploaded }).then(result => {
            console.log(result);
            this.reverseResponse = result;
            this.isLoading = false;
            this.buttonBrand3 = 'neutral';
            this.buttonBrand4='brand';
        }).catch(error => {
            this.response = 'Sorry I\'m busy can you try later';
            this.isLoading = false;
        });
    }

    createTechDescriptionPrompt(){
        this.isLoading = true;
        _executePrompt({ prompt: GENERATE_TECH_DESCRIPTION,userInput:this.snippet, inputType:'custom',inputFile:this.fileUploaded }).then(result => {
            this.reverseResponse = result;
            this.isLoading = false;
            this.buttonBrand4 = 'neutral';
            this.buttonBrand3='brand';
        }).catch(error => {
            this.response = 'Sorry I\'m busy can you try later';
            this.isLoading = false;
        });
    }

    codeQualityAssessment(){
        this.isLoading = true;
        _executePrompt({ prompt: CODE_QUALITY_ASSESSMENT,userInput:this.snippetForOptimization, inputType:'custom',inputFile:this.fileUploaded }).then(result => {
            this.optimizationResponse = result;
            this.isLoading = false;
            this.buttonBrand5 = 'neutral';
            this.buttonBrand6 = 'brand';
            this.buttonBrand7 ='brand';
        }).catch(error => {
            this.response = 'Sorry I\'m busy can you try later';
            this.isLoading = false;
        });
    }

    extractDML(){
        this.isLoading = true;
        _executePrompt({ prompt: EXTRACT_DML_OPERATIONS,userInput:this.snippetForOptimization, inputType:'custom',inputFile:this.fileUploaded }).then(result => {
            this.optimizationResponse = result;
            this.isLoading = false;
            this.buttonBrand5 = 'brand';
            this.buttonBrand6 = 'neutral';
            this.buttonBrand7 ='brand';
        }).catch(error => {
            this.response = 'Sorry I\'m busy can you try later';
            this.isLoading = false;
        });
    }

    extractSOQL(){
        this.isLoading = true;
        _executePrompt({ prompt: EXTRACT_SOQL_OPERATIONS,userInput:this.snippetForOptimization, inputType:'custom',inputFile:this.fileUploaded }).then(result => {
            this.optimizationResponse = result;
            this.isLoading = false;
            this.buttonBrand5 ='brand';
            this.buttonBrand6 = 'brand';
            this.buttonBrand7 = 'neutral';
        }).catch(error => {
            this.response = 'Sorry I\'m busy can you try later';
            this.isLoading = false;
        });
    }
}