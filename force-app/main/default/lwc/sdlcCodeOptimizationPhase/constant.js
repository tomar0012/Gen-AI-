const EXTRACT_DML_OPERATIONS='Extract all the DML operations used in the given apex class. Also, suggest optimization for the extracted DML operations and display it point wise. Do not include delimiters in the output.';
const EXTRACT_SOQL_OPERATIONS='Extract all the SOQL queries used in the given apex class and display it point wise. Also, Suggest optimization for the extracted SOQL queries. Do not include delimiters in the output.';
const CODE_QUALITY_ASSESSMENT='Assess the code quality of the given apex class with respect to apex best practices, code readabilty, modularization etc. Do not include delimiters in the output.';

const BUTTONS = {  qualityCheckButton:'brand',
    dmlCheckButton:'brand',
    soqlCheckButton:'brand'
}
const ERROR_MESSAGE = 'Sorry I\'m busy can you try later';

export{EXTRACT_DML_OPERATIONS, EXTRACT_SOQL_OPERATIONS,CODE_QUALITY_ASSESSMENT,BUTTONS,ERROR_MESSAGE};