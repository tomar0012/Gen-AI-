/**
 * @description       : 
 * @author            : Gokul Sriram
 * @group             : 
 * @last modified on  : 03-21-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class SDLC_AnalysisController {

    @AuraEnabled
    public static void insertUserStories(List<UserStoryWrapper> userStoryList, String epicId) {
        List<UserStory__c> userStoryToInsert = new List<UserStory__c>();
        for(UserStoryWrapper userStoryWrapper : userStoryList) {
            UserStory__c userStory = new UserStory__c();
            userStory.Title__c = userStoryWrapper.title;
            userStory.User_Story__c = userStoryWrapper.userStory;
            userStory.AcceptanceCriteria__c = userStoryWrapper.acceptanceCriteria;
            userStory.Epic__c = epicId; 
            
            if (Schema.sObjectType.UserStory__c.isCreateable()) {
                userStoryToInsert.add(userStory);
            } else {
                system.debug('Insufficient create permission for UserStory__c');
            }
        }

        if(!userStoryToInsert.isEmpty()){
            insert userStoryToInsert;
        }else{
            system.debug('No user stories to insert');
        }
    }

    @AuraEnabled
    public static List<UserStoryWrapper> getSavedUserStories(String epicId){
        system.debug('generate-epicId==>'+epicId);
        if(epicId!=''){
            List<UserStory__c> userStoryList = [SELECT Id,name, Title__c,User_Story__c, AcceptanceCriteria__c,ComponentSpec__c FROM UserStory__c Where Epic__c=:epicId  WITH USER_MODE Order By CreatedDate Desc Limit 1000];
            List<UserStoryWrapper> userStoryWrapperList = new List<UserStoryWrapper>();
            for(UserStory__c userStory : userStoryList) {
                UserStoryWrapper userStoryWrapper = new UserStoryWrapper();
                userStoryWrapper.title = userStory.Title__c;
                userStoryWrapper.acceptanceCriteria = userStory.AcceptanceCriteria__c;
                userStoryWrapper.name = userStory.name+'-'+userStoryWrapper.title;
                userStoryWrapper.Id = userStory.Id;
                userStoryWrapper.userStory = userStory.User_Story__c;
                userStoryWrapper.componentSpec = userStory.ComponentSpec__c;
                userStoryWrapperList.add(userStoryWrapper);
            }
            system.debug('userStoryWrapperList==> '+userStoryWrapperList);
            return userStoryWrapperList;
        }
        else{
            return null;
        }
    }
   
    /*Create a wrapper class for User Story with two fields title and AcceptanceCriteria*/
    public class UserStoryWrapper {
        @AuraEnabled
        public String title { get; set; }
        @AuraEnabled
        public String name { get; set; }
        @AuraEnabled
        public String userStory { get; set; }
        @AuraEnabled
        public String id { get; set; }
        @AuraEnabled
        public String acceptanceCriteria { get; set; }
        @AuraEnabled
        public String componentSpec { get; set; }
    }


    /*
    *********************************************************
    @Method Name    : getConfigurationDetails
    @author         : Gokul
    @description    : method used to fetch configuration details
    @param          : phase type
    @return         : List<ConfigurationWrapper>
    ********************************************************
    */
    @AuraEnabled(cacheable=true)
    public static List<ConfigurationWrapper> getConfigurationDetails(String phase){

        List<ConfigurationWrapper> configurationWrapperList = new List<ConfigurationWrapper>();
        List<ConfigurationTable__c> configList = [Select Id
                                                        , Name
                                                        , LLM__r.Name
                                                        , LLM__r.Id
                                                        , LLM__r.NameCred__c
                                                        , LLM__r.Model__c
                                                        , LLM__r.ClassName__c
                                                        , PromptLibrary__r.Id
                                                        , PromptLibrary__r.Prompt__c
                                                    FROM ConfigurationTable__c 
                                                    WHERE Phase__c =:phase WITH USER_MODE];
                                                    
        for(ConfigurationTable__c config: configList){
            ConfigurationWrapper wrapper = new ConfigurationWrapper();
            wrapper.configId = config.Id;
            wrapper.configName = config.Name;
            wrapper.promptId = config.PromptLibrary__r.Id;
            wrapper.llmId = config.LLM__r.Id;
            wrapper.llmClassName = config.LLM__r.ClassName__c;
            configurationWrapperList.add(wrapper);
        }

        return configurationWrapperList;
    }
    
    public class ConfigurationWrapper{

        @AuraEnabled public String configName;
        @AuraEnabled public String prompt;
        @AuraEnabled public String promptId;
        @AuraEnabled public String namedCredential;
        @AuraEnabled public String llm;
        @AuraEnabled public String llmId;
        @AuraEnabled public String llmModel;
        @AuraEnabled public String llmClassName;
        @AuraEnabled public String configId;
    }
}