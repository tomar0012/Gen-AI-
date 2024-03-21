const SAVED_USER_STORY_COLUMNS = [
    { label: 'Component Spec Id', fieldName: 'Component_Spec_Link', wrapText: true, type: 'richText'},
    { label: 'User Story(ies)', fieldName: 'name',type: 'richText', wrapText: true},
    { label: 'Component Spec', fieldName: 'FormattedSpecification__c', wrapText: true, type: 'richText'}
];

const codeOptions = () => {
    return [
        { label: 'Apex', value: 'Apex' },
        { label: 'Trigger', value: 'Trigger' },
        { label: 'LWC', value: 'LWC' },
    ];
};

const configWorkbookOptions= () => {
    return [{ label: 'Configuration Workbook', value: 'configurationWorkbook' }];
};

const CREATE_APEX_PROMPT='Write the only the Apex Class for the given requirement. Extract all Apex Class requirement from the input given and write the code. Keep in mind all Salesforce coding best practices. Write all the logics for the requirement. Do not add delimiter, explainations or comments in your response. Strictly follow the instruction provided to generate the code';
const CREATE_LWC_PROMPT='Write only the LWC(JS, HTML) part for the given requirement. Extract LWC(Lightning Web Component) requirement from the input given and write the code. Keep in mind all Salesforce coding best practices. Write all the logics for the requirement. Do not add delimiter, explainations or comments in your response. Strictly follow the instruction provided to generate the code';
const CREATE_TRIGGER_PROMPT='Write only the Trigger Class part for the given requirement. Extract the Apex Trigger requirement from the input given and write the code. Keep in mind all Salesforce coding best practices. Write all the logics for the requirement. Do not add delimiter, explainations or comments in your response.Strictly follow the instruction provided to generate the code';
const CREATE_CONFIG_WORKBOOK_PROMPT = 'You are a Salesforce Administrator. You need to write the detailed Configuration Workbook from the "Configurations" part of the given input. You must write the configuration workbook as per the below structure: 1.Roles 2. Objects(determine if its a Salesforce Standard object or custom object) 2.1 Fields(Creation or updation) 2.2 Validation rules for the object with pseudo logic 2.3 Page layout changes if any 2.4 Sharing Settings 3. Automation Details(if any), 4. pricing rules (if applicable), 5. discount schedules(if applicable), 6. quote template customization(if applicable). You will only add the sections in the configuration workbook for which there is any change or update is needed. Do not add any special characters or delimiters in your response. Strictly follow the instructions to generate the detailed configuration workbook.';

export{SAVED_USER_STORY_COLUMNS,CREATE_APEX_PROMPT,CREATE_LWC_PROMPT,CREATE_TRIGGER_PROMPT,CREATE_CONFIG_WORKBOOK_PROMPT,codeOptions,configWorkbookOptions};