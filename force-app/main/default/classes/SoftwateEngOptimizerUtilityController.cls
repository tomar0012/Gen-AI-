/*
*********************************************************
@Class Name      : SoftwateEngOptimizerUtilityController
@author          : COE Arch
@description     : This class provides utility methods to retrieve data related to licenses, engagements, portfolios, products, epics, and execute LLM requests.
********************************************************
*/
public with sharing class SoftwateEngOptimizerUtilityController {

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
        userLicenseList.add(new PermissionSetLicense(Id='0PL1I0000008U5mWAE', MasterLabel='Platform License'));
        userLicenseList.add(new PermissionSetLicense(Id='0PL1I0000008U5mWAL', MasterLabel='Sales Cloud'));
        userLicenseList.add(new PermissionSetLicense(Id='0PL1I0000008U5nWAE', MasterLabel='Service Cloud'));
        userLicenseList.add(new PermissionSetLicense(Id='0PL1I0000008U5oWAE', MasterLabel='Advanced Field Service Lightning'));
        userLicenseList.add(new PermissionSetLicense(Id='0PL1I0000008U5pWAE', MasterLabel='Advanced Revenue Lifecycle Management'));
        userLicenseList.add(new PermissionSetLicense(Id='0PL1I0000008U5nWAE', MasterLabel='Industries – Communications'));
        userLicenseList.add(new PermissionSetLicense(Id='0PL1I0000008U5nWAE', MasterLabel='Industries – Health'));
        userLicenseList.add(new PermissionSetLicense(Id='0PL1I0000008U5nWAE', MasterLabel='Industries – Consumer Goods'));

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
            if(fileData.Title.contains('.doc')){
                context = EncodingUtil.base64Encode(fileData.VersionData);
                system.debug('context1==>'+context);

            }else{
            context=fileData.VersionData.toString();
            system.debug('context2==>'+context);
            }
        }

        return context;
    }
    
    /*
    *********************************************************
    @Inner Class Name: FileInfo
    @description    : Represents file information (Title and VersionData).
    ********************************************************
    */
    public class FileInfo {
        public String Title;
        public Blob VersionData;
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