const CREATE_TEST_CLASS_PROMPT = 'Generate a APEX test class for the given apex class. Include testsetup and test methods with necessary code. Cover all the positive, negative, IF-ELSE condition, try-catch scenarios as well while generating response. Generate Test class  without delimiters.';

const TEST_PLAN_PROMPT = 'Generate Salesforce Test Plan having atleast one normal, one negative scenario and boundary conditions for given user story in the following JSON format without any delimiter:' +
'[{"testCase": " Strictly Do not mention the scenario like negative, boundary and give a suitable test case title.", "testCaseDescription": "test case description related to the userStory",'+
'"testSteps":[insert the test steps related to the test plan in bullets in array element], "dataRequirements":"data required to perform the test plan",'+
'"expectedResult":"Expected output as per the userStory"}]';

const testOptions = ()=>{
    return [
        { label: 'Create Test Class', value: 'Create Test Class' },
        { label: 'Create Test Plan', value: 'Create Test Plan' },
    ];
}

const SAVED_USERSTORY_COLUMNS = [
    { label: 'Title', fieldName: 'userStoryId', type: 'url', typeAttributes: {label: { fieldName: 'name' }, target: '_blank'}},
    { label: 'User Story', fieldName: 'userStory',wrapText: true},
    { label: 'Acceptance Criteria', fieldName: 'acceptanceCriteria',wrapText: true}
];

const  TEST_PLAN_COLUMNS = [
    { label: 'Test Case Title', fieldName: 'testCase',wrapText: true },
    { label: 'Test Case Description', fieldName: 'testCaseDescription',wrapText: true, type:'text'},
    { label: 'Test Steps', fieldName: 'formattedTestSteps', type:'richText'},
    { label: 'Data Requirement', fieldName: 'dataRequirements',wrapText: true},
    { label: 'Expected Result', fieldName: 'expectedResult',wrapText: true}
];
export {CREATE_TEST_CLASS_PROMPT
    ,   TEST_PLAN_PROMPT
    ,   SAVED_USERSTORY_COLUMNS
    ,   TEST_PLAN_COLUMNS
    ,   testOptions};