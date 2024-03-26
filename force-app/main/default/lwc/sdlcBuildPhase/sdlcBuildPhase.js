import { LightningElement, api, track } from 'lwc';
import _executePrompt from '@salesforce/apex/SDLC_InfyAIForceUtility.executePrompt';
import getUserStoriesData from '@salesforce/apex/SDLC_BuildController.getUserStoriesData';
import {SAVED_USER_STORY_COLUMNS,CREATE_APEX_PROMPT,CREATE_LWC_PROMPT,CREATE_TRIGGER_PROMPT,CREATE_CONFIG_WORKBOOK_PROMPT,codeOptions,configWorkbookOptions,NO_INPUT_SELECTED_ERROR,NO_USER_STORY_SELECTED_ERROR,NO_BUILD_COMPONENTS_SELECTED_ERROR,ERROR_GENERATING_OUTPUT} from './constant';

export default class SdlcBuildPhase extends LightningElement {
    @api savedUserStories;
    CREATE_APEX_PROMPT =CREATE_APEX_PROMPT;
    CREATE_LWC_PROMPT=CREATE_LWC_PROMPT;
    CREATE_TRIGGER_PROMPT=CREATE_TRIGGER_PROMPT;
    CREATE_CONFIG_WORKBOOK_PROMPT = CREATE_CONFIG_WORKBOOK_PROMPT;
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

    get savedUserStorycolumns(){
        return SAVED_USER_STORY_COLUMNS;
    }

    activeSections = ['A', 'B'];

    /** fetch component specs. related to user stories from db */
     fetchUpdatedData() {
        this.isLoadingBuildTable = true;
        getUserStoriesData({epicId : this.receivedEpic})
        .then((result) => {
            let formattedData = [];
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
        this.isLoading = true;
    
        try {
            let CODE_GEN_PROMPT =  this.componentChange == 'Apex' ? CREATE_APEX_PROMPT : this.componentChange == 'LWC' ? CREATE_LWC_PROMPT : this.componentChange == 'Trigger' ? CREATE_TRIGGER_PROMPT : this.selectedWorkbook == 'configurationWorkbook' ? CREATE_CONFIG_WORKBOOK_PROMPT : null;

            if(((this.selectedRows!=null || this.selectedRows!=undefined|| !this.selectedRows=='') && (CODE_GEN_PROMPT!=null || !CODE_GEN_PROMPT=='' || !CODE_GEN_PROMPT==undefined)) || ((this.CREATE_CONFIG_WORKBOOK_PROMPT!=null || this.CREATE_CONFIG_WORKBOOK_PROMPT!=''|| this.CREATE_CONFIG_WORKBOOK_PROMPT!=undefined) && (this.selectedRows!=null || !this.selectedRows==''  || !this.selectedRows==undefined) && (CODE_GEN_PROMPT!=null || !CODE_GEN_PROMPT=='' || !CODE_GEN_PROMPT==undefined))){
                this.selRows = false;
                this.isCodeGenPromt=false;
                this.nothingSelected=false;

                _executePrompt({ prompt: CODE_GEN_PROMPT,inputType:'Custom', userInput:this.selectedRows, inputFile: null }).then(result => {
                    this.isGenResult = true
                    this.generatedLwcCode= result;
                    this.isLoading = false;
                }).catch(error => {
                    console.error(error);
                    this.generatedLwcCode = ERROR_GENERATING_OUTPUT;
                    this.isLoading = false;
                });
            }else if(!CODE_GEN_PROMPT && !this.selectedRows){
                this.isGenResult=false;
                this.nothingSelected = true;
                this.isCodeGenPromt = false;
                this.selRows = false;
                this.isLoading = false;
                 this.generatedLwcCode = NO_INPUT_SELECTED_ERROR;
            }else if(CODE_GEN_PROMPT && !this.selectedRows){
                this.isGenResult=false;
                this.isCodeGenPromt = true;
                this.selRows=false;
                this.nothingSelected=false
                this.isLoading = false;
                this.generatedLwcCode = NO_USER_STORY_SELECTED_ERROR;
            }
            else if(this.selectedRows && !CODE_GEN_PROMPT){
                this.isGenResult=false;
                this.isCodeGenPromt = false;
                this.selRows = true;
                this.nothingSelected=false;
                this.isLoading = false;
                this.generatedLwcCode = NO_BUILD_COMPONENTS_SELECTED_ERROR;
            }
        }catch(error){
            console.error(error);
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
        const selectedRow = event.detail.selectedRows;
        try {
             if(selectedRow && selectedRow.length>0){
                this.selectedRows = selectedRow[0].FormattedSpecification__c;
             }else{
                this.selectedRows=undefined;
                this.generatedLwcCode=undefined;
             }       
        } catch (error) {
            console.error(error);
        }
    }
}