import { LightningElement,api,track } from 'lwc';
import _executePrompt from '@salesforce/apex/SoftwateEngOptimizerUtilityController.executePrompt';
import getClassNames from '@salesforce/apex/CodeDescriptionController.getClassNames';
import getFilteredApexClass from '@salesforce/apex/CodeDescriptionController.getFilteredApexClass';
import getClassBody from '@salesforce/apex/CodeDescriptionController.getClassBody';
import callLLM from '@salesforce/apex/SDLC_SoftwareEngOptimizerController.callLLM';
import {CREATE_TEST_CLASS_PROMPT, TEST_PLAN_PROMPT,SAVED_USERSTORY_COLUMNS,TEST_PLAN_COLUMNS,testOptions} from './testConstants';

export default class TestPhase extends LightningElement {
    @api savedUserStories;
    classList;
    filteredClassList;
    testResponse;
    snippetForTest;
    testPlanInput;
    selectedRows;
    selectedRowIds;
    showTestCases = false;
    isLoading = false;
    errorMessage = '';
    @track testCSVData = [];
    @track testCaseData;
    showTestClassCreation = false;
    showTestPlanCreation = false;
    showErrorMessage = false;
    showGeneratedTable = false;
    testOptions = testOptions();
    testPrompt = CREATE_TEST_CLASS_PROMPT;
    savedUserStorycolumns = SAVED_USERSTORY_COLUMNS;
    testCaseColumns = TEST_PLAN_COLUMNS;
    explainChecked = false;

    @api refreshData(){
        this.template.querySelector('c-sdlc-datatable').selectedRows=[];
        this.showGeneratedTable = false;
        this.snippetForTest = '';
        this.testResponse = '';
    }

    connectedCallback() {
        this.classNames()
        this.filteredclassNames();
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


    testOptionChange(event){
        this.showTestClassCreation = event.detail.value === 'Create Test Class';
        this.showTestPlanCreation = event.detail.value === 'Create Test Plan';
        this.testPrompt = this.showTestPlanCreation ? TEST_PLAN_PROMPT : CREATE_TEST_CLASS_PROMPT;
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

    executeCreateTestClassPrompt(event){
        this.isLoading = true;
        this.elementId = event.target.id.split('-')[0];;
        /*_executePrompt({ prompt: this.testPrompt,userInput:this.snippetForTest, inputType:'custom',inputFile:this.fileUploaded }).then(result => {
            console.log(result);
            console.log("====>"+JSON.stringify(this.snippetForTest));
            console.log("====>a"+JSON.stringify(this.fileUploaded ));
            this.testResponse = result;
            this.isLoading = false;
        }).catch(error => {
            this.response = 'Sorry I\'m busy can you try later';
            this.isLoading = false;
        });*/
        let parameterDetails = this.generateParameterWrapperDetails('Custom'
                                                                    , this.snippetForTest
                                                                    , null
                                                                    , 'Create Test Class'
                                                                    , 'Custom'
                                                                    , this.explainChecked);
        console.log('parameter '+JSON.stringify(parameterDetails));    
        callLLM({parameterDetails:JSON.stringify(parameterDetails)})
        .then(result=>{
            console.log('result '+JSON.stringify(result));    

            this.testResponse = result;
            this.isLoading = false;
        }).catch(error => {
            console.log('test class error==>'+JSON.stringify(error));
            this.response = 'Sorry I\'m busy can you try later';
            this.isLoading = false;
        });
    }

    getSelectedRows(event) {
        this.selectedRows = event.detail.selectedRows;
        this.selectedRowIds = [];
        console.log('this.selectedRows =>',JSON.stringify(this.selectedRows));
        if(Object.keys(this.selectedRows).length > 0){
            this.testPlanInput='';
            var i = 1;
            this.selectedRows.forEach(currentRow => {
                this.testPlanInput += 'UserStory '+i+': ';
                this.testPlanInput += currentRow.userStory;
                this.testPlanInput += ' and it\'s acceptance criteria is '+currentRow.acceptanceCriteria;
                i+=1;
                this.selectedRowIds.push(currentRow.id);
            });
            console.log('Input => '+this.testPlanInput);
            console.log('Input ID => '+this.selectedRowIds);
        }
        if(this.selectedRowIds.length == 0){
            this.showTestCases = false;
        }
    }

    createTestcase(){
        this.errorMessage = '';
        this.isLoading = true;
        /*_executePrompt({prompt:this.testPrompt,inputType:'Custom',userInput:this.testPlanInput,inputFile:null})
        .then(result=>{
            console.log('RESULTT TEST => '+result);
            this.testCSVData = JSON.parse(result);
            this.testCaseData = this.formatTestPlan(result) ;
            console.log('result ==> data '+JSON.stringify(this.testCaseData));
            if(this.testCaseData){
                this.showTestCases = true;
                this.isLoading = false;
                this.showErrorMessage = false;
                this.showGeneratedTable = true;
            }
        })
        .catch(error=>{
            console.log('ERROR => '+error.message);
            this.errorMessage = '<b style="color:red;font-size:20px;text-align:center">Try Again!!</b>';
            this.isLoading = false;
            this.showErrorMessage = true;
            this.showTestCases = false;
            this.showGeneratedTable = true;
        })*/
        this.showGeneratedTable = false;
        let parameterDetails = this.generateParameterWrapperDetails('Custom'
                                                                    , this.testPlanInput
                                                                    , null
                                                                    , 'Create Test plan'
                                                                    , 'Custom'
                                                                    , this.explainChecked);
        console.log('parameter '+JSON.stringify(parameterDetails));    
        callLLM({parameterDetails:JSON.stringify(parameterDetails)})
        .then(result=>{
            console.log('RESULTT TEST => '+result);
            this.testCSVData = JSON.parse(result);
            this.testCaseData = this.formatTestPlan(result) ;
            console.log('result ==> data '+JSON.stringify(this.testCaseData));
            if(this.testCaseData){
                this.showTestCases = true;
                this.isLoading = false;
                this.showErrorMessage = false;
                this.showGeneratedTable = true;
            }
        })
        .catch(error=>{
            console.log('ERROR => '+error.message);
            this.errorMessage = '<b style="color:red;font-size:20px;text-align:center">Try Again!!</b>';
            this.isLoading = false;
            this.showErrorMessage = true;
            this.showTestCases = false;
            this.showGeneratedTable = true;
        });
    }

    formatTestPlan(responseObject){
        let objectData = [];
        JSON.parse(responseObject).forEach(record=>{
            let testObject = Object.assign({},record);
            let richTextHTML = '<ul>';
            console.log('sdfd f'+ testObject.testSteps);
            if(Object.keys(testObject.testSteps.length > 1)){
                Array.from(testObject.testSteps, steps=>{
                    richTextHTML +='<li>'+steps+'</li>';
                });
            }
            else if(Object.keys(testObject.testSteps.length == 1)){
                richTextHTML +='<li>'+testObject.testSteps+'</li>';
            }
            richTextHTML+='</ul>';
            testObject.formattedTestSteps = richTextHTML;
            objectData.push(testObject);
       });
       return objectData;
    }

    handleExport(){
        console.log('Gokul hi');
        let rowEnd = '\n';
        let csvString = '';
        let rowData = new Set();
        console.log('Table data '+ JSON.stringify(this.testCSVData));
        this.testCSVData.forEach(function (record) {
            Object.keys(record).forEach(function (key) {
                rowData.add(key);
            });
        });

        rowData = Array.from(rowData);
        csvString += rowData.join(',');
        csvString += rowEnd;

        //change -  replace column api value with label value and added S No as extra column
        csvString = csvString.replace(csvString , 'S No,Test Case Title,Test Case Description,Test Steps,Data Requirement,Expected Result'+rowEnd);

        for(let i=0; i < this.testCSVData.length; i++){
            let colValue = 0;
            //change - add Serial number in rows of excel
            csvString += '"'+ (i+1) +'",';
            for(let key in rowData) {
                console.log('colval1', colValue);
                if(rowData.hasOwnProperty(key)) {
                    let rowKey = rowData[key];
                    if(colValue > 0){
                        csvString += ',';
                    }
                    let value = this.testCSVData[i][rowKey] === undefined ? '' : this.testCSVData[i][rowKey];
                    csvString += '"'+ value +'"';
                    colValue++;
                }
            }
            csvString += rowEnd;
        }

        console.log('csv string', csvString);

        let downloadElement = document.createElement('a');
        downloadElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvString);
        downloadElement.target = '_self';
        // CSV File Name
        downloadElement.download = 'Test Plan Data.csv';
        // below statement is required if you are using firefox browser
        document.body.appendChild(downloadElement);
        // click() Javascript function to download CSV file
        downloadElement.click();
    }

    generateParameterWrapperDetails(_inputType, _userInput, _inputFile, _actionName, _subActionName, _isExplain){
        const utilityComp = this.template.querySelector('c-sdlc-utility');
        return utilityComp.setParameterWrapperDetails(_inputType, _userInput, _inputFile, _actionName, _subActionName, _isExplain);
    }
}