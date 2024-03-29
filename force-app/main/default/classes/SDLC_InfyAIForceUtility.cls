/*
*********************************************************
@Class Name      : Sdlc_InfyAIForceUtility
@author          : COE Arch
@description     : This class provides utility methods to retrieve data related to licenses, engagements, portfolios, products, epics, and execute LLM requests.
********************************************************
*/
public with sharing class SDLC_InfyAIForceUtility {

 /*
    *********************************************************
    @Method Name     : getCurrentUserLicenseData
    @description    : Retrieves current user's license data.
    @return          : List of User records with license data.
    ********************************************************
    */
    @AuraEnabled(cacheable=true)
    public static List<User> getCurrentUserLicenseData(){
        try {
            Id currentUserId = UserInfo.getUserId();
            return [Select Id, Name,Username, Profile.UserLicense.Name From User WHERE Id=:currentUserId WITH USER_MODE limit 1];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    /*
    *********************************************************
    @Method Name     : getAllUserLicesnse
    @description    : Retrieves all available user licenses.
    @return          : List of PermissionSetLicense records.
    ********************************************************
    */
    @AuraEnabled(cacheable=true)
    public static List<PermissionSetLicense>  getAllUserLicesnse(){

        List<PermissionSetLicense> userLicenseList = new List<PermissionSetLicense>();
        userLicenseList.add(new PermissionSetLicense( MasterLabel='Platform License'));
        userLicenseList.add(new PermissionSetLicense( MasterLabel='Sales Cloud'));
        userLicenseList.add(new PermissionSetLicense( MasterLabel='Service Cloud'));
        userLicenseList.add(new PermissionSetLicense( MasterLabel='Advanced Field Service Lightning'));
        userLicenseList.add(new PermissionSetLicense( MasterLabel='Advanced Revenue Lifecycle Management'));
        userLicenseList.add(new PermissionSetLicense(MasterLabel='Industries – Communications'));
        userLicenseList.add(new PermissionSetLicense(MasterLabel='Industries – Health'));
        userLicenseList.add(new PermissionSetLicense(MasterLabel='Industries – Consumer Goods'));

        try {
            return userLicenseList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
     /*
    *********************************************************
    @Method Name     : getAllEngagement
    @description    : Retrieves all engagements.
    @return          : List of Engagement__c records.
    ********************************************************
    */
    @AuraEnabled(cacheable=true)
    public static List<Engagement__c>  getAllEngagement(){
        try {
            return [Select Id, Name from Engagement__c With USER_MODE Limit 500];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
     /*
    *********************************************************
    @Method Name     : getAllPortfolios
    @description    : Retrieves all portfolios related to an engagement.
    @param engagementId : The ID of the engagement to fetch portfolios for.
    @return            : List of Portfolio__c records.
    ********************************************************
    */
    @AuraEnabled(cacheable=true)
    public static List<Portfolio__c>  getAllPortfolios(String engagementId){
        try {
            if(engagementId!=''){
                return [Select Id, Name from Portfolio__c where Engagement__c =: engagementId WITH USER_MODE Limit 500];
            }else{
                return null;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
     /*
    *********************************************************
    @Method Name     : getAllProductDetails
    @description    : Retrieves all product details related to a portfolio.
    @param portfolioId : The ID of the portfolio to fetch product details for.
    @return            : List of Product__c records.
    ********************************************************
    */
    @AuraEnabled(cacheable=true)
    public static List<Product__c>  getAllProductDetails(String portfolioId){
        try {
            return [Select Id, Name from Product__c where Portfolio__c=:portfolioId WITH USER_MODE Limit 500];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    /*
    *********************************************************
    @Method Name     : getAllEpicDetails
    @description    : Retrieves all epic details related to a product.
    @param productId  : The ID of the product to fetch epic details for.
    @return           : List of Epic__c records.
    ********************************************************
    */
    @AuraEnabled(cacheable=true)
    public static List<Epic__c>  getAllEpicDetails(String productId){
        try {
            return [Select Id, Name from Epic__c where Product__c=:productId WITH USER_MODE Limit 500];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    /*
    *********************************************************
    @Method Name    : executeLLM
    @author         : Gokul
    @description    : method used to create request and receiev reponse from LLM Model
    @param          : 
    @return         : String of response
    ********************************************************
    */
    @AuraEnabled
    public static String executeLLM(String inputType, String userInput, Object inputFile, String configId, String className){

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
    
     /*
    *********************************************************
    @Method Name     : formatInputLLM
    @description    : Formats input for the LLM request based on input type.
    @param inputType  : The type of input (Custom, CSV, etc.).
    @param userInput  : User input for the request.
    @param inputFile  : File input if applicable.
    @return           : String of response
    ********************************************************
    */
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
    }
           /*
    *********************************************************
    @Method Name     : executePrompt
    @author         : COE
    @description    : Executes a prompt based on input type and user input, and returns the response.
    @param prompt    : The prompt to execute.
    @param inputType : The type of input (Custom, CSV, etc.).
    @param userInput : User input for the prompt.
    @param inputFile : File input if applicable.
    @return          : The response to the prompt.
    ********************************************************
    */ 
    
    @AuraEnabled
    public static String executePrompt(String prompt,String inputType,String userInput,Object inputFile){
        system.debug('inputType==>'+inputType+'userInput==>'+userInput);

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
        HttpRequest req=SDLC_AIHelper.createHTTPRequest();
        req.setBody(requestBody);

        try{
            HttpResponse response = new Http().send(req);

            system.debug('response '+ response.getBody());
         
            if(response.getStatusCode() == 200) {
            return SDLC_AIHelper.extractResponse(response.getBody());
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
    @Inner Class Name: FileInfo
    @description    : Represents file information (title and versionData).
    ********************************************************
    */
    public class FileInfo {
        public String title;
        public Blob versionData;
    }
    
    /*
    *********************************************************
    @Method Name     : processCSV
    @description    : Processes CSV data.
    @param csvData   : The CSV data to process.
    @return           : Processed CSV data.
    ********************************************************
    */
    public static string processCSV(String csvData){
        system.debug('csvDATA===>'+csvData);
        return csvData;
    }

}