/*******************************
*@name          SdlcBuildPhase
*@description   LWC component for AI Force App's Build Tab
*@author        COE
*@created Date  2024
**********************************/

import { LightningElement, api, track, wire } from 'lwc';
import callLLM from '@salesforce/apex/SDLC_SoftwareEngOptimizerController.callLLM';
import getUserStoriesData from '@salesforce/apex/SDLC_BuildController.getUserStoriesData';
import {CREATE_APEX_CLASS,CREATE_LWC,CREATE_APEX_TRIGGER,CREATE_CONFIGURATION_WORKBOOK,SAVED_USER_STORY_COLUMNS,codeOptions,configWorkbookOptions,NO_INPUT_SELECTED_ERROR,NO_USER_STORY_SELECTED_ERROR,NO_BUILD_COMPONENTS_SELECTED_ERROR,ERROR_GENERATING_OUTPUT} from './constant';

export default class SdlcBuildPhase extends LightningElement {
    @api savedUserStories;
    CREATE_APEX_CLASS=CREATE_APEX_CLASS;
    CREATE_LWC=CREATE_LWC;
    CREATE_APEX_TRIGGER=CREATE_APEX_TRIGGER;
    CREATE_CONFIGURATION_WORKBOOK=CREATE_CONFIGURATION_WORKBOOK;
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
        console.log('BUILD refreshData --> START');
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
            let CODE_GEN_PROMPT_ACTION =  this.componentChange == 'Apex' ? CREATE_APEX_CLASS : this.componentChange == 'LWC' ? CREATE_LWC : this.componentChange == 'Trigger' ? CREATE_APEX_TRIGGER : this.selectedWorkbook == 'configurationWorkbook' ? CREATE_CONFIGURATION_WORKBOOK : null;
            //this.assignPromptAndLLM();
            if(((this.selectedRows!=null || this.selectedRows!=undefined|| !this.selectedRows==''))){
                this.selRows = false;
                this.isCodeGenPromt=false;
                this.nothingSelected=false;

                let parameterDetails = this.generateParameterWrapperDetails('Custom'
                                    , this.selectedRows
                                    , null
                                    , CODE_GEN_PROMPT_ACTION
                                    , 'Text'
                                    , false);
                console.log('parameter '+JSON.stringify(parameterDetails));    
                callLLM({parameterDetails:JSON.stringify(parameterDetails)})
                .then(result=>{
                    this.isGenResult = true
                    this.generatedLwcCode= result;
                    this.isLoading = false;
                }).catch(error => {
                    console.log('error==>'+JSON.stringify(error));
                    this.generatedLwcCode = 'Sorry I\'m busy can you try later';
                    this.isLoading = false;
                });
            }else if(!CODE_GEN_PROMPT_ACTION && !this.selectedRows){
                this.isGenResult=false;
                this.nothingSelected = true;
                this.isCodeGenPromt = false;
                this.selRows = false;
                this.isLoading = false;
                 this.generatedLwcCode = NO_INPUT_SELECTED_ERROR;
            }else if(CODE_GEN_PROMPT_ACTION && !this.selectedRows){
                this.isGenResult=false;
                this.isCodeGenPromt = true;
                this.selRows=false;
                this.nothingSelected=false
                this.isLoading = false;
                this.generatedLwcCode = NO_USER_STORY_SELECTED_ERROR;
            }
            else if(this.selectedRows && !CODE_GEN_PROMPT_ACTION){
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
    //Generate input wrapper
    generateParameterWrapperDetails(_inputType, _userInput, _inputFile, _actionName, _subActionName, _isExplain){
        const utilityComp = this.template.querySelector('c-sdlc-utility');
        return utilityComp.setParameterWrapperDetails(_inputType, _userInput, _inputFile, _actionName, _subActionName, _isExplain);
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