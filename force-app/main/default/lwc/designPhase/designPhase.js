import { LightningElement,api,track,wire} from 'lwc';
import _executePrompt from '@salesforce/apex/SoftwateEngOptimizerUtilityController.executePrompt';
import insertComponentSpecificationRecord from '@salesforce/apex/SDLC_DesignController.insertComponentSpecificationRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getConfigurationDetails from '@salesforce/apex/SDLC_AnalysisController.getConfigurationDetails';
import callLLM from '@salesforce/apex/SoftwareEngOptimizerController.callLLM';
import { SAVEDUSERSTORYCOLUMNS } from './designConstants';
export default class DesignPhase extends LightningElement {

    @api tabLabel;
    selectedRows;
    errorMessage;
    isLoading = false;
    componentSpecInput ='';
    formattedText;
    inputType = 'Custom';
    inputFile;
    savedUserStorycolumns = SAVEDUSERSTORYCOLUMNS;
    @track mapOfStoryIdWithUserInput = {};
    @track selectedRowIds = [];
    @api savedUserStories;
    @track componentSpecStories;
    @track userStoryIdWithTitle;
    @track explainChecked;
    @track configurationRecords = [];
    prompt;
    showDesignTable=false;
    explainText='';
    showFeedback = false;
    designPromptId;
    designLLMId;
    feedbackRecordId;
    configId;
    llmClassName;

    @api 
    refreshData(){
        this.showDesignTable = false;
        this.template.querySelector('c-sdlc-datatable').selectedRows=[];
        this.showFeedback = false;
    }
    
    @wire(getConfigurationDetails,{phase:'$tabLabel'})
    wiredConfigurationDetails({data,error}){
        if(data){
            this.configurationRecords = data;
            console.log('Configuration records '+JSON.stringify(data));
        }
        else if(error){
            console.log('ERROR '+error)
        }
    }

    getSelectedRows(event) {
        this.selectedRows = event.detail.selectedRows;
        this.selectedRowIds = [];
        console.log('this.selectedRows =>',JSON.stringify(this.selectedRows));
        if(Object.keys(this.selectedRows).length > 0){
            this.componentSpecInput='';
            var i = 1;
            this.selectedRows.forEach(currentRow => {
                this.componentSpecInput += 'UserStory '+i+': ';
                this.componentSpecInput += currentRow.userStory;
                this.componentSpecInput += ' and it\'s acceptance criteria is '+currentRow.acceptanceCriteria;
                i+=1;
                this.selectedRowIds.push(currentRow.id);
            });
            console.log('Input => '+this.componentSpecInput);
            console.log('Input ID => '+this.selectedRowIds);
        }

        if(this.selectedRowIds.length == 0){
            this.formattedText = '';
        }
    }
    
    createDesign(){
        console.log('STARTING DESIGN SPEC');
        this.assignPromptAndLLM();
        this.executeComponentSpecificationPrompt();
        //this.createFeedbackRecord();
    }

    assignPromptAndLLM(){
        console.log('INTO ASSIGN PROMPT & LLM')
        
        this.configurationRecords.forEach(record=>{
            if(this.explainChecked && record.configName.includes('Explanation')){
                this.designLLMId = record.llmId;
                this.designPromptId = record.promptId;
                this.configId = record.configId;
                this.llmClassName = record.llmClassName;
            }
            else if(!this.explainChecked && !record.configName.includes('Explanation')){
                this.designLLMId = record.llmId;
                this.designPromptId = record.promptId;
                this.configId = record.configId;
                this.llmClassName = record.llmClassName;
            }
        });
        console.log(this.compspec_prompt);
    }

    

    executeComponentSpecificationPrompt(){
        console.log('PROMPT BEFORE EXECUTING '+this.compspec_prompt);
        this.isLoading = true;
       /* _executePrompt({prompt:this.compspec_prompt,inputType:this.inputType,userInput:this.componentSpecInput,inputFile:this.inputFile})
        .then(result=>{
            console.log('result '+result);
            let richTextHTML = '';
            let responseObject = JSON.parse(result);
            let ObjectKeys = Object.keys(responseObject[0]);
            console.log('Gokul Keys '+ ObjectKeys);
            let explanation;
            this.showDesignTable = true;
            this.isLoading = false;
            this.showFeedback = true;
            
        })
        .catch(error=>{
            console.log('ERRO '+error.message);
            this.formattedText = '<b style="color:red;">'+'Error Occured. Try Again.</b>'
            this.showDesignTable = true;
            this.isLoading = false;
            this.showFeedback = true;
        })*/
        callLLM({inputType:this.inputType,userInput:this.componentSpecInput,inputFile:this.inputFile,configId:this.configId,className:this.llmClassName})
        .then(result=>{
            console.log('result '+result);
            let richTextHTML = '';
            let responseObject = JSON.parse(result);
            let ObjectKeys = Object.keys(responseObject[0]);
            console.log('Gokul Keys '+ ObjectKeys);
            this.formatComponentSpecResponse(responseObject);
            this.showDesignTable = true;
            this.isLoading = false;
            this.showFeedback = true;
            
        })
        .catch(error=>{
            console.log('ERRO '+error.message);
            this.formattedText = '<b style="color:red;">'+'Error Occured. Try Again.</b>'
            this.showDesignTable = true;
            this.isLoading = false;
            this.showFeedback = true;
        })
    }

    handleExplain(event){
        this.explainChecked = !this.explainChecked;
        console.log('TOGGLE EXP '+this.explainChecked);
        this.prompt = this.explainChecked ? this.compspec_prompt_explanation : this.compspec_prompt;
    }

    saveComponentSpec(){
        this.isLoading = true;
        console.log('Input values --> '+this.selectedRowIds +'  --- '+this.formattedText);
        insertComponentSpecificationRecord({userStoryIds:this.selectedRowIds,formattedResponse:this.formattedText})
        .then(result=>{
            console.log('RESULT --> '+result);
            const evt = new ShowToastEvent({
                title: 'Success',
                message: 'Component Specification is Saved',
                variant: 'success'
            });
            this.dispatchEvent(evt);
            this.isLoading = false;
        })
        .catch(error=>{
            console.log('ERROR -->'+error.message);
        });
    }

    formatComponentSpecResponse(responseObject){
        let richTextHTML = '';
        responseObject.forEach(componentSpec =>{
            richTextHTML +='<b style="font-size:15px;">Configurations:</b><br/>';
            richTextHTML +='<ul>';
            if(componentSpec['Configurations'].length > 0){
                Array.from(componentSpec['Configurations'], config=>{
                    richTextHTML += '<li>'+config+'</li>';
                });
            }
            else{
                richTextHTML+='<li>No Configurations are suggest for this user story</li>'
            }
            richTextHTML+='</ul><br/>';
            richTextHTML +='<b style="font-size:15px;">Customizations:</b><br/>';
            let keyArray = Object.keys(componentSpec['Customizations']);
            console.log('keyArray' +keyArray);
            let isAllEmpty = false;
            for(let key of keyArray){
                console.log('keyArray 1' +key);
                console.log('values '+componentSpec['Customizations'][key]);
                if(componentSpec['Customizations'][key].length>0){
                    richTextHTML +='<b>'+key+'</b><br/>';
                    richTextHTML +='<ul>';
                    Array.from(componentSpec['Customizations'][key], value=>{
                        richTextHTML += '<li>'+value+'</li>';
                    });
                    richTextHTML+='</ul>';
                    isAllEmpty = true;
                }
                
            }
            if(!isAllEmpty){
                richTextHTML +='<ul><li>No Customisation sugguessted for this user story</li></ul><br/>';
            }
            richTextHTML +='<b style="font-size:15px;">AppExchange:</b><br/>';
            richTextHTML +='<ul>';
            if(Array.isArray(componentSpec['AppExchange']) && componentSpec['AppExchange'].length > 0){
                Array.from(componentSpec['AppExchange'], sol=>{
                    richTextHTML += '<li>'+sol+'</li>';
                });
            }
            else {
                richTextHTML+='<li>No AppExchange Solutions to suggest for this user story</li>';
            }
            richTextHTML+='</ul><br/>';
            console.log('Obj keys '+Object.keys(componentSpec));
            if(componentSpec['Explanation']){
                richTextHTML +='<b style="font-size:15px;">Explanation:</b><br/>';
                richTextHTML += componentSpec['Explanation'];
            }
            
        });
        this.formattedText = richTextHTML;
    }

}