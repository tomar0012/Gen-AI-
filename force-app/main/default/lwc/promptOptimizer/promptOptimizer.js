import { LightningElement,track } from 'lwc';
import _executePrompt from '@salesforce/apex/PromptLibraryController.executePrompt';
const prompt = 'Refine the input in the form of a prompt to get better output from LLM. Prompt should Start with a Verb. Do not include delimiters in the output.';

export default class PromptOptimizer extends LightningElement {
    inputText ="";
    optimizedText = "";
    sampleText1 = 'Develop apex class that can accept account data and then turn around and insert into object which is account';
    sampleText2 = 'Write Lightning component to display screen which will some fields , some input and some output';
    showSpinner = false;

    handleChange(event){
        this.inputText=event.target.value;
    }

    
    handleOptimize(event){
        console.log('Gokul ');
        this.showSpinner = true;
        this.handleExecutePrompt();
    }

    optimizeTextValue(){
        let text = this.inputText.toLowerCase();
        console.log(text);
        if(text == this.sampleText1.toLowerCase()){
            this.optimizedText = 'Create an Apex Class to insert account records that is bulkified';
        }
        if(text == this.sampleText2.toLowerCase()){
            this.optimizedText = 'Write Lightning Web Component that accepts certain input fields, complete upsert DML operation, and display the result';
        }
        console.log(this.optimizedText);
    }

    handleExecutePrompt(){
        _executePrompt({prompt:prompt,context:this.inputText})
        .then(result=>{
            this.optimizedText = result;
            this.showSpinner = false;
            console.log('Gokul Result '+result);    
        })
        .catch(error=>{
            console.log('Gokul Error '+error);
            this.showSpinner = false;
        });
    }
}