import { LightningElement,api,track,wire } from 'lwc';
import getConfigurationDetails from '@salesforce/apex/SDLC_AnalysisController.getConfigurationDetails';
import callLLM from '@salesforce/apex/SoftwareEngOptimizerController.callLLM';
import insertUserStories from '@salesforce/apex/SDLC_AnalysisController.insertUserStories';
import _executePrompt from '@salesforce/apex/SoftwareEngOptimizerController.executePrompt';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import 	sdlc_analysis_error from '@salesforce/label/c.sdlc_analysis_error';
import {GENERTATEDUSERSTORYCOLUMNS,EXPLAINUSERSTORYCOLUMNS,SAVEDUSERSTORYCOLUMNS,inputFormatOptionsForValidation,analysisOption,inputFormatOptions} from './analysisConstants';
export default class AnalysisPhase extends LightningElement {

    @api
    generatedUserStories;
    @api
    savedUserStories;
    genUserStories;
    valUserStories;
    explainUserStorycolumns = EXPLAINUSERSTORYCOLUMNS;
    savedUserStorycolumns=SAVEDUSERSTORYCOLUMNS;
    @track generatedUserStorycolumns=GENERTATEDUSERSTORYCOLUMNS;
    inputFormatOptionsForValidation = inputFormatOptionsForValidation();
    inputFormatOptions = inputFormatOptions();
    analysisOption = analysisOption();
    userstory_prompt;
    validation_prompt;
    selectedRows;
    selectedinputFormatOption='Text';
    userInput;
    response;
    isLoading;
    elementId;
    disableExport = true;
    lenGeneratedUserStories;
    @api tabLabel;
    @track
    fileUploaded ={};
    trimmedValue=[];
    storyGenerated = false;
    @track explainChecked = false;
    @track isValidateExplain = false;
    selectedPrompt;
    showFeedback = false;
    @api epicId;
    value;
    @track configurationRecords = [];
    analysisLLMId;
    analysisPromptId;
    llmClassName;
    configId;
    analysisError = sdlc_analysis_error;

    @api refreshData(){
        this.template.querySelector('c-sdlc-datatable').selectedRows=[];
        this.storyGenerated=false;
        this.generatedUserStories = '';
        this.testResponse = '';
        this.fileUploaded =[];
        this.selectedRows='';
        this.userInput='';
        this.validatedResponse = '';
        this.showFeedback = false;
    }

    get trimmedSavedUserStories(){
        this.trimmedValue = [...this.savedUserStories];
        return this.trimmedValue.slice(0,10);
    }

    /*get inputFormatOptions() {
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
            { label: 'File(.txt)', value: 'Text' },
            { label: 'Custom', value: 'Custom' },
        ];
    }

    get analysisOption() {
        return [
            { label: 'Generate User Stories', value: 'Generate User Stories' },
            { label: 'Validate User Stories', value: 'Validate User Stories' },
        ];
    }*/

    @wire(getConfigurationDetails,{phase:'$tabLabel'})
    wiredConfigurationDetails({data,error}){
        if(data){
            //console.log('DATA PARSE '+JSON.parse(data))
            this.configurationRecords = data;
            
        }
        else if(error){
            console.log('ERR '+error)
        }
    }

    assignPromptAndLLM(){
        this.configurationRecords.forEach(record=>{
            if(this.genUserStories && !record.configName.includes('Validation')){
                if(this.explainChecked && record.configName.includes('Explanation')){
                    this.analysisLLMId = record.llmId;
                    this.analysisPromptId = record.promptId;
                    this.configId = record.configId;
                    this.llmClassName = record.llmClassName;
                }
                else if(!this.explainChecked && !record.configName.includes('Explanation')){
                    this.analysisLLMId = record.llmId;
                    this.analysisPromptId = record.promptId;
                    this.configId = record.configId;
                    this.llmClassName = record.llmClassName;
                }
            }
            else if(this.valUserStories && record.configName.includes('Validation')){
                this.analysisLLMId = record.llmId;
                this.analysisPromptId = record.promptId;
                this.configId = record.configId;
                this.llmClassName = record.llmClassName;
            }
        });
    }
    analysisOptionChange(event) {
        console.log({ event })

        this.value = event.detail.value;
        this.genUserStories = this.value === 'Generate User Stories';
        this.valUserStories = this.value === 'Validate User Stories';
        this.validatedResponse = '';
        this.showFeedback = false;

    }

     hasUserStoryGenerated(){
        if(this.generatedUserStories!=undefined && this.generatedUserStories.length > 0){
            this.storyGenerated = true;
        }else{

            this.storyGenerated = false;
        }
    }

    get hasSavedUserStories(){
        return this.savedUserStories!=undefined && this.savedUserStories.length > 0;
    }

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
        console.log('file uploaded::::'+ this.fileUploaded);
       }else{
         this.fileSelected=false;
       }
       
    }

    handleinputFormatOptionChange(event) {
        this.selectedinputFormatOption = event.detail.value;
        this.generatedUserStories=''
        this.storyGenerated=false;
        this.validatedResponse = '';

    }

    get isCustomInputFormat() {
        return this.selectedinputFormatOption === 'Custom';
    }

    get isFileFormat() {
        return this.selectedinputFormatOption === 'Audio' || this.selectedinputFormatOption === 'Text' || this.selectedinputFormatOption === 'ChatTranscript' || this.selectedinputFormatOption === 'Video';
    }

    createDownloadlink(rowSelectionVal){
       let htmlContent = `<html><head><h2 style="text-align:center;">User Story(ies)</h2></head><body><table><table border="1"><thead><tr>`;
        this.savedUserStorycolumns.forEach(column =>{
            htmlContent += `<th>${column.label}</th>`;
        });
        htmlContent += `</tr></thead></tbody>`;
            rowSelectionVal.forEach(record => {
                        htmlContent += `<tr>`;
            
                        this.savedUserStorycolumns.forEach(column=>{
                            if(column.label==='Title'){
                                htmlContent += `<td>${record[column.typeAttributes.label.fieldName]}</td>`;
                            }else{
                                htmlContent += `<td>${record[column.fieldName]}</td>`;
                            }
                        });
                        htmlContent += `</tr>`;
                    });
           
        htmlContent += `</tbody></table></body></html>`;
        let htmlFOrmattedContent = htmlContent.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&#39;', "'").replaceAll('&quot;', '"');
        let hiddenElement=document.createElement('a');
        hiddenElement.href = 'data:application/msword;charset=utf-8,' + encodeURI(htmlFOrmattedContent);
        console.log('hiddenElement.href==>'+hiddenElement.href);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'savedUserStory';     //this.fileUploaded.Title.split(".")[0] //'package' //this.fileName+this.format; 
        hiddenElement.click();        
        console.log('hiddenElement.href5==>');
    }
		
	exportSavedUserStory() {
        if (this.selectedRows!='') {
            this.createDownloadlink(this.selectedRows);
        }
    }

    exportValidatedResponse(event){
        console.log('hiddenElement.href==>');
        let hiddenElement=document.createElement('a');
        hiddenElement.href = 'data:application/msword;charset=utf-8,' + encodeURI(this.validatedResponse);
         console.log('hiddenElement.href1==>');
        hiddenElement.target = '_blank';
        if(this.selectedinputFormatOption!='Custom'){
            console.log('hiddenElement.href2==>');
            hiddenElement.download =  this.fileUploaded.Title.split(".")[0];
        }else{
            console.log('hiddenElement.href3==>');
            hiddenElement.download = 'validateUserStories.doc';
        } 
        console.log('hiddenElement.href4==>');

        hiddenElement.click();
        console.log('hiddenElement.href5==>');
    }

    saveSelectedUserStories(){
        /**Get selected user stories from table */
        if(this.selectedRows){
            console.log('selectedrowsEpic'+ this.epicId);
            insertUserStories({userStoryList: this.selectedRows, epicId: this.epicId})
            .then(result => {
                console.log('result',result);
                this.showNotification('Success','User Stories Saved Successfully','success');
                this.fireUserStorySavedEvent();
            })
            .catch(error => {
                console.log('error',error);
            });
        }else{
            this.showNotification('Error Saving','Select User Stories to be Saved','error');

        }
        this.selectedRows='';
        this.storyGenerated=false;
    }

    showNotification(_title, _message, _variant) {
        const evt = new ShowToastEvent({
            title: _title,
            message: _message,
            variant: _variant
        });
        this.dispatchEvent(evt);
    }

    getSelectedRows(event) {
        this.selectedRows = event.detail.selectedRows;
        console.log('this.selectedRows',JSON.stringify(this.selectedRows));
    }

    getSavedSelectedRows(event) {
        if(event.detail.selectedRows!=''){
            this.disableExport = false;
            this.selectedRows = event.detail.selectedRows;
        console.log('this.selectedRows',JSON.stringify(this.selectedRows));
        }else{
            this.disableExport = true;
            this.selectedRows='';
        }
    }


    executeUserStoryGenerationPrompt(event){
        this.isLoading = true;
        this.elementId = event.target.id;
        this.assignPromptAndLLM();

        console.log('PROMPT --> '+this.userstory_prompt);
        callLLM({inputType:this.selectedinputFormatOption,userInput:this.userInput, inputFile:this.fileUploaded,configId:this.configId,className:this.llmClassName })
        .then(result => {
            console.log(result);
            this.response = result;
            this.generatedUserStories=JSON.parse(result);
            this.storyGenerated = true
            this.lenGeneratedUserStories='Generated Use Cases - '+ '('+ (this.generatedUserStories.length) +')';
            if(this.explainChecked){
                this.generatedUserStorycolumns = this.explainUserStorycolumns;
            }
            this.isLoading = false;
        })
        .catch(error => {
            this.response = this.analysisError;
            this.isLoading = false;
            console.log("error generating user stories"+ error.message);
        });

       /* _executePrompt({ prompt: this.userstory_prompt,userInput:this.userInput, inputType:this.selectedinputFormatOption,inputFile:this.fileUploaded })
        .then(result => {
            console.log(result);
            console.log('Generated response '+result);
            this.response = result;
            this.generatedUserStories=JSON.parse(result);
            this.storyGenerated = true
            this.lenGeneratedUserStories='Generated Use Cases - '+ '('+ (this.generatedUserStories.length) +')';
            if(this.explainChecked){
                this.generatedUserStorycolumns = this.explainUserStorycolumns;
            }
            this.isLoading = false;
        })
        .catch(error => {
            this.response = 'Sorry I\'m busy can you try later';
            this.isLoading = false;
        });*/
    }

    userInputChanged(event){
        this.userInput = event.target.value;
    }

    executeValidationPrompt(event){
        console.log('event==>'+event.target.value);
        this.isLoading = true;
        this.elementId = event.target.id;
        this.assignPromptAndLLM();
        console.log('VALIDATION PROMPT '+this.validation_prompt)
        /*_executePrompt({ prompt: this.validation_prompt,userInput:this.userInput, inputType:this.selectedinputFormatOption,inputFile:this.fileUploaded }).then(result => {
            console.log(result);
            this.response = result;
            console.log('GOKUL RESP '+result);
            this.formatValidateResponse(result);
            this.isLoading = false;
            this.showFeedback = true;
        }).catch(error => {
            this.validatedResponse = 'Sorry I\'m busy can you try later';
            this.isLoading = false;
            this.showFeedback = true;
            console.log('valiation error==>'+JSON.stringify(error));
        });*/
        callLLM({inputType:this.selectedinputFormatOption,userInput:this.userInput, inputFile:this.fileUploaded,configId:this.configId,className:this.llmClassName })
        .then(result => {
            console.log(result);
            this.response = result;
            console.log('GOKUL RESP '+result);
            this.formatValidateResponse(result);
            this.isLoading = false;
            this.showFeedback = true;
        }).catch(error => {
            this.validatedResponse = this.analysisError;
            this.isLoading = false;
            this.showFeedback = true;
            console.log('valiation error==>'+JSON.stringify(error));
        });
    }
    getSelectedSavedUserStories(event){
    }

    fireUserStorySavedEvent(){
        const evt=new CustomEvent('userstorysave');
        this.dispatchEvent(evt);
    }

    handleExplain(event){
        console.log('Gokul toggle '+!this.explainChecked);
        this.explainChecked = !this.explainChecked;
        if(!this.response){
            console.log('Gokul inside resp')
            this.generatedUserStorycolumns = this.explainUserStorycolumns;
        }
        else {
            if(!this.explainChecked){
                this.generatedUserStorycolumns = GENERTATEDUSERSTORYCOLUMNS;
            }
            else{
                console.log(Object.keys(JSON.parse(this.response)[0]));
                this.generatedUserStorycolumns = (Object.keys(JSON.parse(this.response)[0]).length == 4) ? this.explainUserStorycolumns : GENERTATEDUSERSTORYCOLUMNS;
            }
        }
    }

    handleValidateExplain(event){
        this.isValidateExplain = !this.isValidateExplain;
    }

    formatValidateResponse(response){
        console.log('INside validate format')
        this.validatedResponse = ''
        let richTextHTML = '';
        let isValid = false;
        JSON.parse(response).forEach(record=>{
            if(record['Result'].includes('Yes')){
                isValid = true;
                richTextHTML += '<b style="font-size:15px;color:Green">'+record['Result']+'</b><br/>';
            }
            else{
                richTextHTML += '<b style="font-size:15px;color:Red">'+record['Result']+'</b><br/>';
            }
            richTextHTML += '<html><table border="1">';
            richTextHTML += '<tr><td><b>'+ record['title']+'</b></td></tr>';
            richTextHTML += '<tr><td><b>'+ 'User Story: '+'</b><br/>'+record['userstory']+'</td></tr>';
            richTextHTML += '<tr><td><b>'+ 'Acceptance Criteria: '+'</b><br/>';
            richTextHTML += '<ul>'
            Array.from(record['acceptanceCriteria'], logic=>{
                richTextHTML+='<li>'+logic+'</li>';
            });
            richTextHTML += '</ul></th></tr>';
            if(this.isValidateExplain){
                richTextHTML += '<tr><td><b>'+ 'Explanation: '+'</b><br/>'+record['explanation']+'</td></tr>';
            }
            richTextHTML += '</table></html>';
        });
        this.validatedResponse = richTextHTML;
    }
}