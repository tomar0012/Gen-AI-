import { LightningElement,api,track } from 'lwc';
import _executePrompt from '@salesforce/apex/SoftwareEngOptimizerController.executePrompt';
import getClassNames from '@salesforce/apex/CodeDescriptionController.getClassNames';
import getFilteredApexClass from '@salesforce/apex/CodeDescriptionController.getFilteredApexClass';
import getClassBody from '@salesforce/apex/CodeDescriptionController.getClassBody';

const CREATE_TEST_CLASS_PROMPT = 'Generate a APEX test class for the given apex class. Include testsetup and test methods with necessary code. Cover all the positive, negative, IF-ELSE condition, try-catch scenarios as well while generating response. Generate Test class  without delimiters.';

const TEST_PLAN_PROMPT = 'Generate Salesforce Test Plan having atleast one normal, one negative scenario and boundary conditions for given user story in the following JSON format without any delimiter:' +
'[{"testCase": " Strictly Do not mention the scenario like negative, boundary and give a suitable test case title.", "testCaseDescription": "test case description related to the userStory",'+
'"testSteps":[insert the test steps related to the test plan in bullets in array element], "dataRequirements":"data required to perform the test plan",'+
'"expectedResult":"Expected output as per the userStory"}]';

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

    @api refreshData(){
        this.template.querySelector('c-sdlc-datatable').selectedRows=[];
        this.showGeneratedTable = false;
        this.snippetForTest = '';
        this.testResponse = '';
    }

    connectedCallback() {
        //this.retrieveSavedUserStories();
        this.classNames()
        this.filteredclassNames()
        //this.optimizationClassNames()
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

    get testOptions(){
        return [
            { label: 'Create Test Class', value: 'Create Test Class' },
            { label: 'Create Test Plan', value: 'Create Test Plan' },
        ];
    }

    testOptionChange(event){
        this.showTestClassCreation = event.detail.value === 'Create Test Class';
        this.showTestPlanCreation = event.detail.value === 'Create Test Plan';
        /*if(this.showTestClassCreation){
            this.template.querySelector('c-sdlc-datatable').selectedRows=[];
            this.showTestCases = false;
        }
        else if(this.showTestPlanCreation){
            this.snippetForTest = '';
            this.testResponse = '';
        }*/
    }

    savedUserStorycolumns = [
        { label: 'Title', fieldName: 'userStoryId', type: 'url', typeAttributes: {label: { fieldName: 'name' }, target: '_blank'}},
        { label: 'User Story', fieldName: 'userStory',wrapText: true},
        { label: 'Acceptance Criteria', fieldName: 'acceptanceCriteria',wrapText: true}
    ];

    testCaseColumns = [
        { label: 'Test Case Title', fieldName: 'testCase',wrapText: true },
        { label: 'Test Case Description', fieldName: 'testCaseDescription',wrapText: true, type:'text'},
        { label: 'Test Steps', fieldName: 'formattedTestSteps', type:'richText'},
        { label: 'Data Requirement', fieldName: 'dataRequirements',wrapText: true},
        { label: 'Expected Result', fieldName: 'expectedResult',wrapText: true}
    ];

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
        console.log('Gok exece');
        this.errorMessage = '';
        let objectData = [];
        this.isLoading = true;
        _executePrompt({prompt:TEST_PLAN_PROMPT,inputType:'Custom',userInput:this.testPlanInput,inputFile:null})
        .then(result=>{
            console.log('RESULTT TEST => '+result);
            //let testObject =[];
            this.testCSVData = JSON.parse(result);
           JSON.parse(result).forEach(record=>{
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
           })
           this.testCaseData = objectData;
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
           // this.showTestCases = true;
        })
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
}