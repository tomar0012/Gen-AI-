import { LightningElement,api,wire,track } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import PROMPT_TYPE_FIELD from '@salesforce/schema/PromptLibrary__c.PromptType__c';
import PHASE_FIELD from '@salesforce/schema/PromptLibrary__c.Phase__c';
import ENTITY_FIELD from '@salesforce/schema/PromptLibrary__c.Entity__c';
import INDUSTRY_FIELD from '@salesforce/schema/PromptLibrary__c.Industry__c';
import OUTPUT_TYPE_FIELD from '@salesforce/schema/PromptLibrary__c.OutputType__c';
import MODEL_NAME_FIELD from '@salesforce/schema/PromptLibrary__c.ModelName__c';
import getPromptListWithFilters from '@salesforce/apex/PromptLibraryController.getPromptListWithFilters';
import {SOFTWARE_ENGINEERING_COLUMNS,BUSINESSS_CAPABILITY_COLUMNS} from './promptLibraryConstants';

export default class PromptLibrarySearch extends LightningElement {
    searchValue;
    showTable = false;
    showSEBox = false;
    showBABox = false;
    @track tableData;
    @track filterVariables = {};
    columns;
    selectedPromptType = "";
    selectedEntity="";
    selectedModelName="";
    selectedIndustry="";
    selectedOutputType="";
    selectedPhaseType="";
    filterPromptTypeValues;
    filterPhaseTypeValues;
    filterIndustryValues;
    filterEntityValues;
    filterModelNameValues;
    filterOutputTypeValues;
    noOfRecords;
    status = 'All';

    searchKeyword(event){
        this.searchValue = event.target.value;
    }

    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: PROMPT_TYPE_FIELD })
    getPicklistValuesForPromptType({ data, error }) {
        if (data) {
            this.filterPromptTypeValues = [...data.values];
        } else if (error) {
            console.error('error from picklist: ' + error);
        }
    }
    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: PHASE_FIELD })
    getPicklistValuesForPhaseType({ data, error }) {
        if (data) {
            this.filterPhaseTypeValues = [...data.values];
            this.filterPhaseTypeValues.unshift({ label: 'All', value: 'All' });
        } else if (error) {
            console.error('error from picklist: ' + error);
        }
    }
    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: ENTITY_FIELD })
    getPicklistValuesForEntity({ data, error }) {
        if (data) {
            this.filterEntityValues = [...data.values];
            this.filterEntityValues.unshift({ label: 'All', value: 'All' });
        } else if (error) {
            console.error('error from picklist: ' + error);
        }
    }
    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: INDUSTRY_FIELD })
    getPicklistValuesForIndustry({ data, error }) {
        if (data) {
            this.filterIndustryValues = [...data.values];
            this.filterIndustryValues.unshift({ label: 'All', value: 'All' });
        } else if (error) {
            console.error('error from picklist: ' + error);
        }
    }
    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: MODEL_NAME_FIELD })
    getPicklistValuesForModelName({ data, error }) {
        if (data) {
            this.filterModelNameValues = [...data.values];
            this.filterModelNameValues.unshift({ label: 'All', value: 'All' });
        } else if (error) {
            console.error('error from picklist: ' + error);
        }
    }
    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: OUTPUT_TYPE_FIELD })
    getPicklistValuesForOutputType({ data, error }) {
        if (data) {
            this.filterOutputTypeValues = [...data.values];
            this.filterOutputTypeValues.unshift({ label: 'All', value: 'All' });
        } else if (error) {
            console.error('error from picklist: ' + error);
        }
    }

    handleModelName(event){
        this.selectedModelName=event.target.value;
        this.filterVariables['ModelName__c'] = this.selectedModelName;
    }
    handleIndustry(event){
        this.selectedIndustry=event.target.value;
        this.filterVariables['Industry__c'] = this.selectedIndustry;
    }
    handleEntity(event){
        this.selectedEntity=event.target.value;
        this.filterVariables['Entity__c'] = this.selectedEntity;

    }
    handlePromptType(event){
        this.selectedPromptType = event.target.value;
        this.filterVariables = {};
        this.filterVariables['PromptType__c'] = this.selectedPromptType;
        if(this.selectedPromptType == 'Software Engineering' ){
            this.showSEBox = true;
            this.showBABox = false;
            this.showTable = false;
            this.columns = SOFTWARE_ENGINEERING_COLUMNS;
        }
        if(this.selectedPromptType == 'Business Capability' ){
            this.showBABox = true;
            this.showSEBox = false;
            this.showTable = false;
            this.columns = BUSINESSS_CAPABILITY_COLUMNS;
        }
    }
    handleOutputType(event){
        this.selectedOutputType=event.target.value;
            this.filterVariables['OutputType__c'] = this.selectedOutputType;
            console.log('JSON '+JSON.stringify(this.filterVariables));
    }
    handlePhaseType(event){
        this.selectedPhaseType = event.target.value;
        this.filterVariables['Phase__c'] = this.selectedPhaseType;
    }

    //This method is used to action on onclick button
    handleSearch(){
        console.log('Gokul params  '+JSON.stringify(this.filterVariables));
        getPromptListWithFilters({filterVariables:this.filterVariables})
        .then(result=>{
            this.tableData = result;
            this.showTable = true;
            this.noOfRecords = Object.keys(result).length;
            console.log('sddd Gokul '+JSON.stringify(result) +' Sixe '+Object.keys(result).length);
        })
        .catch(error=>{
            console.log('Gokul '+error);
        });

    }

    //This method handles the export of CSV file from prompt import
    handleExport(){
        let comp = this.template.querySelector('c-prompt-manager-utility');
        comp.handleExport(this.tableData);
    }
}