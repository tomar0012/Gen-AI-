const GENERTATEDUSERSTORYCOLUMNS = [
    { label: 'Title', fieldName: 'title' },{ label: 'User Story', fieldName: 'userstory',wrapText: true},
    { label: 'Acceptance Criteria', fieldName: 'acceptanceCriteria',wrapText: true}
];
const EXPLAINUSERSTORYCOLUMNS = [
    { label: 'Title', fieldName: 'title' },{ label: 'User Story', fieldName: 'userstory',wrapText: true},
    { label: 'Acceptance Criteria', fieldName: 'acceptanceCriteria',wrapText: true},
    { label: 'Explanation', fieldName: 'explanation',wrapText: true}
];
const SAVEDUSERSTORYCOLUMNS = [
    { label: 'Title', fieldName: 'userStoryId', type: 'url', typeAttributes: {label: { fieldName: 'name' }, target: '_blank'}},
    { label: 'User Story', fieldName: 'userStory',wrapText: true},
    { label: 'Acceptance Criteria', fieldName: 'acceptanceCriteria',wrapText: true}
];

const inputFormatOptions = () => {
    return [
        { label: 'Text', value: 'Text' },
        { label: 'Audio', value: 'Audio' },
        { label: 'Video', value: 'Video' },
        { label: 'Chat Transcript', value: 'ChatTranscript' },
        { label: 'Custom', value: 'Custom' },
    ];
}

const inputFormatOptionsForValidation = () =>{
    return [
        { label: 'File(.txt)', value: 'Text' },
        { label: 'Custom', value: 'Custom' },
    ];
}

const analysisOption = () =>{
    return [
        { label: 'Generate User Stories', value: 'Generate User Stories' },
        { label: 'Validate User Stories', value: 'Validate User Stories' },
    ];
}
export {GENERTATEDUSERSTORYCOLUMNS,EXPLAINUSERSTORYCOLUMNS,SAVEDUSERSTORYCOLUMNS,inputFormatOptionsForValidation,analysisOption,inputFormatOptions};