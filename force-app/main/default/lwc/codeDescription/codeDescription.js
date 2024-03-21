import { LightningElement, track } from 'lwc';
import IMAGE from '@salesforce/resourceUrl/ChatGPT';
import LightningAlert from 'lightning/alert';
import getDescription from '@salesforce/apex/CodeDescriptionController.getDescription';
import getClassNames from '@salesforce/apex/CodeDescriptionController.getClassNames';
import getClassBody from '@salesforce/apex/CodeDescriptionController.getClassBody';

export default class CodeDescription extends LightningElement {
    snippet;
    response;
    classList;
    prompt;
    connectedCallback() {
        this.classNames()
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


}