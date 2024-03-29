const SAVED_USER_STORY_COLUMNS = [
    { label: 'Component Spec', fieldName: 'Component_Spec_Link', wrapText: true, type: 'richText'},
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

const NO_INPUT_SELECTED_ERROR= '<div style="color:red; font-weight:bold">Please Select your User Story and Component Type or Workbook for generating desired output.</div>';
const NO_USER_STORY_SELECTED_ERROR= '<div style="color:red; font-weight:bold">Please Select User Story for Generating Code or Workbook</div>';
const NO_BUILD_COMPONENTS_SELECTED_ERROR= '<div style="color:red; font-weight:bold">Please Select your component type (Apex, Trigger, LWC) or Workbook</div>';
const ERROR_GENERATING_OUTPUT = 'Sorry I\'m busy can you try later';

const CREATE_APEX_CLASS = 'Create Apex Class';
const CREATE_LWC = 'Create LWC';
const CREATE_APEX_TRIGGER = 'Create Apex Trigger';
const CREATE_CONFIGURATION_WORKBOOK = 'Create Configuration workbook';


export{CREATE_APEX_CLASS,CREATE_LWC,CREATE_APEX_TRIGGER,CREATE_CONFIGURATION_WORKBOOK,SAVED_USER_STORY_COLUMNS,codeOptions,configWorkbookOptions,NO_INPUT_SELECTED_ERROR,NO_USER_STORY_SELECTED_ERROR,NO_BUILD_COMPONENTS_SELECTED_ERROR,ERROR_GENERATING_OUTPUT};