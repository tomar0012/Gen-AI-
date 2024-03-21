const SOFTWARE_ENGINEERING_COLUMNS = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Prompt', fieldName: 'Prompt__c', type: 'text'},
    { label: 'Phase Type', fieldName: 'Phase__c', type: 'text' },
    { label: 'Output Type', fieldName: 'OutputType__c', type: 'text' },
    { label: 'LLM', fieldName: 'ModelName__c', type: 'text' },
    { label: 'Prompt Complexity', fieldName: 'PromptComplexity__c', type: 'text' },
    { label: 'Output Quality', fieldName: 'OutputQuality__c', type: 'text' }
];

const BUSINESSS_CAPABILITY_COLUMNS = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Prompt', fieldName: 'Prompt__c', type: 'text' },
    { label: 'Entity', fieldName: 'Entity__c', type: 'text' },
    { label: 'Industry', fieldName: 'Industry__c', type: 'text' },
    { label: 'LLM', fieldName: 'ModelName__c', type: 'text' },
    { label: 'Prompt Complexity', fieldName: 'PromptComplexity__c', type: 'text' },
    { label: 'Output Quality', fieldName: 'OutputQuality__c', type: 'text' }
];

export {SOFTWARE_ENGINEERING_COLUMNS,BUSINESSS_CAPABILITY_COLUMNS};