const USER_STORY_PROMPT='Generate at least 5 or more user stories in the following below HTML format:' + 
'<html><table border="1"><tr><th><b>{Insert User Story title here}</b></th></tr>' +
'<tr><td><b>User Story</b></br>As a <type of user>, I want <some goal> so that <some reason>.</td></tr>' +
'<tr><td><b>Acceptance Criteria</b></br>{Insert accepteance criteria here}</td></tr>' +
'</table></html>'+'.The Output should be under one html tag only, every element should be inside one <html> tag </html> and follow the htnl structure';

const USER_STORY_VALIDATION_PROMPT_CUSTOM='From the given user story check if the user story is in the the below mentioned format or not. If not, provide answer  and suggest the user story for the input in the mentioned below format. The output should be in salesforce context.'+'Here is the format for your reference : "<b>No</b>, not it is not in the correct format"'+' <html><table border="1"><tr><th><b><User Story title from input></User></b></th></tr>' +'<tr><td><b>User Story: </b></br>As a <type of user>, I want <some goal> so that <some reason>.</td></tr>' + '<tr><td><b>Acceptance Criteria: </b></br><genereate accepteance criteria here from input></genereate></td></tr>' + '</table></html>. Generate output without delimiters.';

// const USER_STORY_VALIDATION_PROMPT_Text='Check if the given user story in the doc file is in the correct format or not. If User story is in correct formation answer as Yes else answer as No, it is not in the correct format. Provide the reason and reframe the input into a correct user story. Here is the format for your reference,'+' <html><table border="1"><tr><th><b>{ Generate User Story title here}</b></th></tr>' + '<tr><td><b>User Story</b></br>As a <type of user>, I want <some goal> so that <some reason>.</td></tr>' + '<tr><td><b>Acceptance Criteria</b></br>{genereate accepteance criteria here from input}</td></tr>' +
// '</table></html>. After validating, if it\'s not in correct format then, extract all the personas form the data provided and create user story for each persona. Generate atleast 5 user stories in the given HTML format or more if possible from the persona perspective. Generate output  without delimiters';


const PACKAGE_XML_PROMPT  = 'Generate a salesforce package.xml file for the components uploaded in the csv file. Consider <name> as ComponetType and <members> as ComponetName for package.xml. For each <name> output should accomulate all the <members>. Output should only contain package.xml file and no other statements or delimiters. FOr you reference I am proving a sample format to you. <?xml version="1.0" encoding="UTF-8"?><Package xmlns="http://soap.sforce.com/2006/04/metadata"><types><members>{ComponetName}</members><name>{ComponetType}</name></types><version>60.0</version></Package>';

const RELEASE_NOTES_PROMPT= 'Generate a deployemnt release notes from the csv file uploaded. Take Description and User Story/Defect No. from the csv file for your input and generate the Release notes in the following format:' + '<html><head><h2>Release Notes</h2></head><body><table border="1"><tr><td><b>User Story/Defect No.</b></td><td colspan="3">{User Story/Bug No. from csv file}</td></tr><tr><td><b>Description</b></td><td colspan="3">{take descriptions form csv file and write the explained description. Description should be of atleast 100 words}</td></tr><tr><td><b>Summary of Changes</b></td><td colspan="3">{Genereate the summary of changes with the inputs form csv file. Each points in the Summary of Changes, should be of alteast 30 words. And points should be displayed displayed point wise}</td></tr><tr><td><b>Key Features/ Enhancements</b></td><td colspan="3">{Genereate the key Features. Each points in the Summary of Changes, should be of alteast 20 words. And points should be displayed point wise}</td></tr></table></body><html>.'+'Output should only contain the release notes and it\'s description, no other extra statement or delimiters. For differet user stories write the output inside a single table. Generate only the formatted output';

const CREATE_TEST_CLASS_PROMPT = 'Generate a APEX test class for the given apex class. Include testsetup and test methods with necessary code. Generate Test class  without delimiters.';

const GENERATE_FUNCTIONAL_DESCRIPTION='Generate functional description for the given apex class. Include the Functionalities and their descriptions one by one. Do not include delimiters in the output.';

const GENERATE_TECH_DESCRIPTION='Generate a techncial description for the given apex class. Include the method names and details of the operations perfromed by the method in the output. Do not include delimiters in the output.';

const EXTRACT_DML_OPERATIONS='Extract all the DML operations used in the given apex class. Also, suggest optimization for the extracted DML operations and display it point wise. Do not include delimiters in the output.';

const EXTRACT_SOQL_OPERATIONS='Extract all the SOQL queries used in the given apex class and display it point wise. Also, Suggest optimization for the extracted SOQL queries. Do not include delimiters in the output.';

const CODE_QUALITY_ASSESSMENT='Assess the code quality of the given apex class with respect to apex best practices, code readabilty, modularization etc. Do not include delimiters in the output.';


export { USER_STORY_PROMPT, PACKAGE_XML_PROMPT , RELEASE_NOTES_PROMPT,CREATE_TEST_CLASS_PROMPT,GENERATE_FUNCTIONAL_DESCRIPTION,GENERATE_TECH_DESCRIPTION,EXTRACT_DML_OPERATIONS,EXTRACT_SOQL_OPERATIONS,CODE_QUALITY_ASSESSMENT, USER_STORY_VALIDATION_PROMPT_CUSTOM}