/*
*********************************************************
@Class Name      : SDLC_SoftwareEngOptimizerController
@author          : COE-Arch
@description     : This class handles various functionalities related to software engineering optimization.
********************************************************
*/
public with sharing class SDLC_SoftwareEngOptimizerController {
   
    static Map<String, String> promptMap = new Map<String, String>{'1'=>'Create a user story from the requirement'};
   
   
    
    /*
    *********************************************************
    @Method Name     : uploadCompletionImage
    @author         : COE
    @description    : Uploads completion images and links them to a parent record.
    @param filesToInsert : List of files to insert.
    @param parentid       : Parent record ID.
    @return              : True if upload is successful, else false.
    ********************************************************
    */

    @AuraEnabled
    public static Boolean uploadCompletionImage(list<Object> filesToInsert,String parentid){
     
           /* list<Id> lstCntVerIds = new list<Id>();
            list<Id> condocfiltered = new list<Id>();
          
            List<ContentVersion> lstVersionsToInsert = new List<ContentVersion>();
          
            for (Object file : filesToInsert) {
                FileInfo fileData = (FileInfo)JSON.deserialize(JSON.serialize(file), FileInfo.class);
                ContentVersion objCntVersion = new ContentVersion();
                objCntVersion.PathOnClient = fileData.title;
                objCntVersion.title = fileData.title;
                objCntVersion.versionData = fileData.versionData;
                lstVersionsToInsert.add(objCntVersion);
            }
            
            list<Database.saveResult> res = Database.insert(lstVersionsToInsert);
            for (Database.SaveResult saveResult : res) {
                if(saveResult.isSuccess()) {
                    lstCntVerIds.add(saveResult.getId());
                }
            }
            List<ContentVersion> contenverlist = [select id,contentdocumentid,contentdocument.title from contentversion where id IN : lstCntVerIds ];
            List<Contentdocumentlink> condoclink = new List<Contentdocumentlink>();
            List<String> failedattach = new List<String>();
            for(contentversion conver : contenverlist){
                contentdocumentlink condoc = new contentdocumentlink();
                condoc.ContentDocumentId = conver.contentdocumentid;
                condoc.LinkedEntityId = parentid;
                condoc.ShareType = 'V';
                condoc.Visibility = 'AllUsers';
                condoclink.add(condoc);
            }
            if(condoclink.size()>0){
                Database.SaveResult[] condocupdated  = Database.insert(condoclink, false);
               
                update new Credential__c(id=parentid,Learning_Completion_Image__c=true);
            }*/
            return true;
           
            
    }
    
     public class UploadResponseWrap {
        public string errorcode;
        public List<string> name;
    }
    
    public class FileInfo {
        public String title;
        public Blob versionData;
    }
    
    public static string processCSV(String csvData){
        system.debug('csvDATA===>'+csvData);
        return csvData;
    }
    
    /*
    *********************************************************
    @Method Name     : getallFAQs
    @author         : COE
    @description    : Retrieves all FAQs from the database.
    @return          : List of FAQ records.
    ********************************************************
    */

    @AuraEnabled
    public static List<SEO_HomePage__mdt> getallFAQs(){
        try{
            List<SEO_HomePage__mdt> allFAQ =[select DeveloperName,MasterLabel,FAQ_Heading__c,Description__c,Order__c from SEO_HomePage__mdt where Category__c='FAQ' WITH USER_MODE order by Order__c asc limit 20];
            return allFAQ;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    /*
    *********************************************************
    @Method Name     : getInitialSteps
    @author         : COE
    @description    : Retrieves initial steps/instructions from the database.
    @return          : List of initial steps/instructions of SEO_HomePage__mdt.
    ********************************************************
    */
    
    @AuraEnabled
    public static List<SEO_HomePage__mdt> getInitialSteps(){
        try{
            List<SEO_HomePage__mdt> instruction =[select DeveloperName,MasterLabel,FAQ_Heading__c,Description__c,Order__c from SEO_HomePage__mdt where Category__c='Instructions' WITH USER_MODE order by Order__c asc  Limit 20];
            return instruction;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    /*
    *********************************************************
    @Method Name     : getUsefulTips
    @author         : COE
    @description    : Retrieves useful tips from the database.
    @return          : List<SEO_HomePage__mdt>
    ********************************************************
    */
    
    @AuraEnabled
    public static List<SEO_HomePage__mdt> getUsefulTips(){
        try{
            List<SEO_HomePage__mdt> tips =[select DeveloperName,MasterLabel,FAQ_Heading__c,Description__c,Order__c from SEO_HomePage__mdt where Category__c='Tips' WITH USER_MODE order by Order__c asc Limit 20];
            return tips;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    
    /*
    *********************************************************
    @Method Name     : createFeedback
    @author         : COE
    @description    : Creates feedback record based on prompt ID and LLM ID.
    @param promptId : The ID of the prompt.
    @param llmId    : The ID of the LLM (Learning Library Management).
    @return         : string value
    ********************************************************
    */

    @AuraEnabled
    public static string createFeedback(String actionName, String subAction){

        ConfigurationTable__c config = [Select Id
                                             , Name 
                                        FROM ConfigurationTable__c 
                                        WHERE Action__c=:actionName
                                        AND Sub_Action_Name__c=:subAction
                                        AND Active__c=:true
                                        WITH USER_MODE
                                        LIMIT 1];
        Feedback__c feedback = new Feedback__c();
        feedback.ConfigurationTable__c = config.Id;
        
        if (Schema.sObjectType.Feedback__c.isCreateable()) {
            insert feedback;
        }
        return feedback.Id;
    }    
    
    /*
    *********************************************************
    @Method Name     : updateFeedback
    @author         : COE
    @description    : Updates feedback record with response and comments.
    @param recordId        : The ID of the feedback record to update.
    @param response        : The response for the feedback.
    @param responseFeedback: Feedback on the response.
    @param comments        : Additional comments.
    @return                : True if update is successful, else false.
    ********************************************************
    */

    @AuraEnabled
    public static Boolean updateFeeback(String recordId, String response, String responseFeedback,String comments){

        Map<String, Integer> responseWithScore = new Map<String,Integer>{
            'Positive'=>10,
            'Neutral'=>5,
            'Negative'=>0
        };
        Feedback__c feedback = new Feedback__c();
        feedback.Id = recordId;
        feedback.Response__c = response;
        feedback.ResponseFeedback__c = responseFeedback;
        feedback.Comments__c = comments;
        feedback.Feedback_score__c = responseWithScore.get(response);
        try{
            if (Schema.sObjectType.Feedback__c.isUpdateable()) {
                update feedback;
            }
            return true;
        }
        catch(Exception e){
            return false;
        }
    }
    
    /*
    *********************************************************
    @Method Name     : callgpt
    @description    : Calls the GPT API.
    @param prompt     : The prompt to process.
    @param inputType  : The type of input (Custom, CSV, etc.).
    @param userInput  : User input for the prompt.
    @param inputFile  : File input if applicable.
    @param namedCredential : Named credential for the API callout.
    @return           : The string response from the GPT API.
    ********************************************************
    */

    @AuraEnabled
    public static String callgpt(String prompt,String inputType,String userInput,Object inputFile,String namedCredential){

        String endpoint= 'callout:'+namedCredential;
        String context;
        if(inputType=='Custom'){
            context=userInput;
        }else if(inputType == 'CSV'){
            context = processCSV((String)inputFile);
        }else{
            FileInfo fileData = (FileInfo)JSON.deserialize(JSON.serialize(inputFile), FileInfo.class);
            system.debug('<==fileData==>'+fileData);
            if(fileData.title.contains('.doc')){
                context = EncodingUtil.base64Encode(fileData.versionData);
                system.debug('context1==>'+context);

            }else{
            context=fileData.versionData.toString();
            system.debug('context2==>'+context);
            }
        }

        List<Object> promptList = new List<Object>();
        SDLC_AIHelper.addPrompt(promptList,'system','Hi, I am your SOftware Engineering Assistant.');
        SDLC_AIHelper.addPrompt(promptList,'user',context);
        SDLC_AIHelper.addPrompt(promptList,'user',prompt);
        String requestBody=SDLC_AIHelper.createRequestBody(promptList);
        system.debug('requestBody==>'+requestBody);

        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('POST');
        req.setTimeout(120000);
        req.setHeader('Content-Type', 'application/json');
        req.setBody(requestBody);

        try{
            HttpResponse response = new Http().send(req);

            system.debug('response '+ response.getBody());
         
            if(response.getStatusCode() == 200) {
            return AIHelper.extractResponse(response.getBody());
            } else if(response.getStatusCode() == 503) {
                return 'Error';
            }
            else{
                return 'Error';
            }
        }catch(Exception e){
            return 'Error';
        }
    }
    
     /*
    *********************************************************
    @Method Name     : callLLM
    @description    : Calls the LLM (Learning Library Management) API for processing.
    @param inputType  : The type of input (Custom, CSV, etc.).
    @param userInput  : User input for the prompt.
    @param inputFile  : File input if applicable.
    @param configId   : Configuration ID for LLM.
    @param className  : Name of the LLM class.
    @return           : The response from the LLM API.
    ********************************************************

    @AuraEnabled
    public static String callLLM(String inputType, String userInput, Object inputFile, String configId, String className){

        String llmResponse;
        String context = formatInputLLM(inputType, userInput, inputFile);
        Type llmClass = Type.forName(className);
        LLMInterface llmInterface = (LLMInterface)llmClass.newInstance();
        llmInterface.setLLMConfigId(configId);
        llmInterface.setPromptContext(context);
        LLMContext llcontext=new LLMContext(llmInterface);
        try{
            llmResponse = llcontext.processLLMRequest();
        }
        catch(Exception err){
            system.debug('ERROR '+err);
        }
        

        return llmResponse;
    }
    
    *********************************************************
    @Method Name     : formatInputLLM
    @description    : Formats input for the LLM API based on input type.
    @param inputType : The type of input (Custom, CSV, etc.).
    @param userInput : User input for the prompt.
    @param inputFile : File input if applicable.
    @return          : The response for LLM processing.
    ********************************************************


    public static String formatInputLLM(String inputType, String userInput, Object inputFile){

        String context;

        if(inputType=='Custom'){
            context=userInput;
        }else if(inputType == 'CSV'){
            context = processCSV((String)inputFile);
        }else{
            FileInfo fileData = (FileInfo)JSON.deserialize(JSON.serialize(inputFile), FileInfo.class);
            system.debug('<==fileData==>'+fileData);
            if(fileData.title.contains('.doc')){
                context = EncodingUtil.base64Encode(fileData.versionData);
                system.debug('context1==>'+context);

            }else{
            context=fileData.versionData.toString();
            system.debug('context2==>'+context);
            }
        }

        return context;
    }    */

    /*
    *********************************************************
    @Method Name     : callLLM
    @description    : Calls the LLM (Learning Library Management) API for processing.
    @param inputType  : The type of input (Custom, CSV, etc.).
    @param userInput  : User input for the prompt.
    @param inputFile  : File input if applicable.
    @param configId   : Configuration ID for LLM.
    @param className  : Name of the LLM class.
    @return           : The response from the LLM API.
    ********************************************************
    */

    @AuraEnabled
    public static String callLLM(String parameterDetails){

        String llmResponse;

        system.debug('JSON String: '+JSON.deserializeUntyped(parameterDetails));
        SDLC_LLMParameterWrapper paramWrapper = (SDLC_LLMParameterWrapper)JSON.deserialize(parameterDetails,SDLC_LLMParameterWrapper.class);
        system.debug('para '+paramWrapper.isExplain);
        ConfigurationTable__c config = [Select Id
                                                , Name
                                                , LLM__r.Name
                                                , LLM__r.Id
                                                , LLM__r.NameCred__c
                                                , LLM__r.Model__c
                                                , LLM__r.ClassName__c
                                                , PromptLibrary__r.Id
                                                , PromptLibrary__r.Prompt__c
                                                , Prompt_With_Explanation__r.Prompt__c
                                        FROM ConfigurationTable__c
                                        Where Action__c=:paramWrapper.actionName
                                        AND Sub_Action_Name__c=:paramWrapper.subAction
                                        AND Active__c=:true
                                        WITH USER_MODE
                                        LIMIT 1];
        system.debug('config from apex '+config);
        String context = formatInputLLM(paramWrapper.inputType, paramWrapper.userInput, paramWrapper.inputFile);
        Type llmClass = Type.forName(config.LLM__r.ClassName__c);
        SDLC_LLMInterface llmInterface = (SDLC_LLMInterface)llmClass.newInstance();
        llmInterface.setLLMConfigId(config.Id);
        llmInterface.setLLMDetails(config, paramWrapper.isExplain);
        llmInterface.setPromptContext(context);
        SDLC_LLMContext llcontext=new SDLC_LLMContext(llmInterface);
        try{
            llmResponse = llcontext.processLLMRequest();
            system.debug('llmResponse: '+llmResponse);
        }
        catch(Exception err){
            system.debug('ERROR '+err);
        }
        

        return llmResponse;
    }

    /*
    *********************************************************
    @Method Name     : formatInputLLM
    @description    : Formats input for the LLM API based on input type.
    @param inputType : The type of input (Custom, CSV, etc.).
    @param userInput : User input for the prompt.
    @param inputFile : File input if applicable.
    @return          : The response for LLM processing.
    ********************************************************
    */
    public static String formatInputLLM(String inputType, String userInput, String inputFile){

        String context;

        if(inputType=='Custom'){
            context=userInput;
        }else if(inputType == 'CSV'){
            context = processCSV((String)inputFile);
        }else{
            FileInfo fileData = (FileInfo)JSON.deserialize(inputFile, FileInfo.class);
            system.debug('<==fileData==>'+fileData);
            if(fileData.title.contains('.doc')){
                context = EncodingUtil.base64Encode(fileData.versionData);
                system.debug('context1==>'+context);

            }else{
            context=fileData.versionData.toString();
            system.debug('context2==>'+context);
            }
        }

        return context;
    }
    public class LLMParameterDetails {
        public string inputType { get; set; }
        public string userInput { get; set; }
        public Map<String,Object> inputFile { get; set; }
        public String actionName { get; set; }
        public string subAction { get; set; }
        public boolean isExplain { get; set; }
    }
}