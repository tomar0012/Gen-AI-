import { LightningElement, api, track, wire } from 'lwc';
import _executePrompt from '@salesforce/apex/SoftwateEngOptimizerUtilityController.executePrompt';
import getUserStoriesData from '@salesforce/apex/SDLC_BuildController.getUserStoriesData';
import {SAVED_USER_STORY_COLUMNS,CREATE_APEX_PROMPT,CREATE_LWC_PROMPT,CREATE_TRIGGER_PROMPT,CREATE_CONFIG_WORKBOOK_PROMPT,codeOptions,configWorkbookOptions} from './buildPhaseConstant';
export default class BuildPhase extends LightningElement {

    @api savedUserStories;
    CREATE_APEX_PROMPT =CREATE_APEX_PROMPT;
    CREATE_LWC_PROMPT=CREATE_LWC_PROMPT;
    CREATE_TRIGGER_PROMPT=CREATE_TRIGGER_PROMPT;
    CREATE_CONFIG_WORKBOOK_PROMPT = CREATE_CONFIG_WORKBOOK_PROMPT;
    savedUserStorycolumns=SAVED_USER_STORY_COLUMNS;
    showCodeSection=false;
    codeGenerated=false;
    generatedCode = '';
    componentChange='';
    isLoading;
    isLoadingBuildTable = false;
    generatedLwcCode='';
    isGenResult=false
    selectedRows;
    isCodeGenPromt=false;
    selRows=false;
    nothingSelected=false;  
    @api projectContext;
    @api receivedEpic;

    @track data=[];

    /** fetch component specs. related to user stories from db */
     fetchUpdatedData() {
        this.isLoadingBuildTable = true;
        getUserStoriesData({epicId : this.receivedEpic})
        .then((result) => {
            let formattedData = [];
            console.log('result -->'+JSON.stringify(result));
            result.forEach(record =>{
                formattedData.push({
                    id: Math.random(),
                    name:record.name,
                    FormattedSpecification__c: record.FormattedSpecification__c,
                    Component_Spec_Link: record.Component_Spec_Link
                });
            });
           this.data = formattedData;
           this.isLoadingBuildTable = false;
        })
        .catch((error) => {
            this.isLoadingBuildTable = false;
            console.log('error==>'+error);
        });
    }

    connectedCallback(){
        this.fetchUpdatedData();
    }
    
    @api 
    refreshData(){
        this.template.querySelector('c-sdlc-datatable').selectedRows=[];
        this.componentChange=undefined;
        this.generatedLwcCode='';
        this.template.querySelector('lightning-radio-group').value='';
        this.fetchUpdatedData();
        this.selectedRows=undefined;
        this.selectedWorkbook=undefined;
        this.nothingSelected = true;
        this.isCodeGenPromt = false;
        this.selRows = false;
    }

    get codeOptions() {
        return codeOptions();
    }
    get configWorkbookOptions(){
        return configWorkbookOptions();
    }
    
    /* generate build component based on user selection */
    generateBuildComponents(event){
        this.codeGenerated=true;
        this.isLoading = true;

        console.log('this.selectedRows' + this.selectedRows);
        console.log('this.componentChange' + this.componentChange);
        console.log('this.selectedWorkbook' + this.selectedWorkbook);
    
        try {
            let CODE_GEN_PROMPT =  this.componentChange == 'Apex' ? CREATE_APEX_PROMPT : this.componentChange == 'LWC' ? CREATE_LWC_PROMPT : this.componentChange == 'Trigger' ? CREATE_TRIGGER_PROMPT : this.selectedWorkbook == 'configurationWorkbook' ? CREATE_CONFIG_WORKBOOK_PROMPT : null;

            console.log('this.CODE_GEN_PROMPT' + CODE_GEN_PROMPT);

            if(((this.selectedRows!=null || this.selectedRows!=undefined|| !this.selectedRows=='') && (CODE_GEN_PROMPT!=null || !CODE_GEN_PROMPT=='') && (this.generatedLwcCode!=null || !this.generatedLwcCode==undefined || !this.generatedLwcCode=='')) || ((this.CREATE_CONFIG_WORKBOOK_PROMPT!=null || this.CREATE_CONFIG_WORKBOOK_PROMPT=='') && (this.selectedRows!=null || !this.selectedRows=='') && (CODE_GEN_PROMPT!=null || !CODE_GEN_PROMPT==''))){
                this.selRows = false;
                this.isCodeGenPromt=false;
                this.nothingSelected=false;

                _executePrompt({ prompt: CODE_GEN_PROMPT,inputType:'Custom', userInput:this.selectedRows, inputFile: null }).then(result => {
                    console.log('result==>'+result);
                    this.isGenResult = true
                    this.generatedLwcCode=result;
                    this.isLoading = false;
                }).catch(error => {
                    console.log('error==>'+JSON.stringify(error));
                    this.generatedLwcCode = 'Sorry I\'m busy can you try later';
                    this.isLoading = false;
                });
            }else if((CODE_GEN_PROMPT!=null || !CODE_GEN_PROMPT=='') && (this.selectedRows==null || this.selectedRows=='')&&(this.selectedWorkbook==null || this.selectedWorkbook=='')){
                console.log('result1==>');

                this.isCodeGenPromt = true
                this.selRows=false;
                this.nothingSelected=false
                this.generatedLwcCode = '<div style="color:red; font-weight:bold">Please Select User Story for Generating Code or Workbook</div>';
                this.isLoading = false;
            }else if((this.selectedRows!=null || this.selectedRows!=undefined ||  this.selectedRows!='') && (CODE_GEN_PROMPT==null || !CODE_GEN_PROMPT=='')&&(this.selectedWorkbook==null || this.selectedWorkbook=='')){
                console.log('result2==>');

                this.selRows = true
                this.nothingSelected=false;
                this.generatedLwcCode = '<div style="color:red; font-weight:bold">Please Select your component type (Apex, Trigger, LWC) or Workbook</div>';
                this.isLoading = false;
            }else if(this.selectedWorkbook && (this.selectedRows==undefined || this.selectedRows=='' || this.selectedRows==null)&&(CODE_GEN_PROMPT==null || !CODE_GEN_PROMPT=='')){
                console.log('result3==>');

                this.generatedLwcCode = '<div style="color:red; font-weight:bold">Please Select USER STORY to generate Workbook</div>';
                this.selRows = true
                this.nothingSelected=false;
                this.isLoading = false;
            }else {
                console.log('result4==>');

                this.nothingSelected = true;
                this.isCodeGenPromt = false;
                this.selRows = false;
                this.generatedLwcCode = '<div style="color:red; font-weight:bold">Please Select your User Story and Component Type or Workbook for generating desired output.</div>';
                this.isLoading = false;
            }
        }catch(error){
            console.log('Error in genrating workbook/code: '+error);
            this.isLoading=false;
        }
    }
    
    handleComponentChange(event){
        this.componentChange = event.target.value;
        this.selectedWorkbook=undefined;
    }

    handleWorkbookSelection(event){
        this.selectedWorkbook = event.target.value;
        this.componentChange=undefined;
    }

    /* get user selected row details */
    getSelectedRows(event) {
        try {
            const selectedRow = event.detail.selectedRows;
             if(selectedRow && selectedRow.length>0){
                this.selectedRows = selectedRow[0].FormattedSpecification__c;
             }else{
                this.selectedRows=undefined;
                this.generatedLwcCode=undefined;
             }       
        } catch (error) {
            console.log('error'+error);
        }
    }
}