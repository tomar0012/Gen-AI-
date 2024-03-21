public with sharing class SDLC_AnalysisController {

    @AuraEnabled
    public static void insertUserStories(List<UserStoryWrapper> userStoryList, String epicId) {
       system.debug('saved-epicId==>'+epicId);
        List<UserStory__c> userStoryToInsert = new List<UserStory__c>();
        for(UserStoryWrapper userStoryWrapper : userStoryList) {
            UserStory__c userStory = new UserStory__c();
            userStory.Title__c = userStoryWrapper.title;
            userStory.User_Story__c = userStoryWrapper.userStory;
            userStory.AcceptanceCriteria__c = userStoryWrapper.acceptanceCriteria;
            userStory.Epic__c = epicId; 
            userStoryToInsert.add(userStory);
        }
        insert userStoryToInsert;
    }
   
    @AuraEnabled
    public static List<UserStoryWrapper> getSavedUserStories(String epicId){
        system.debug('generate-epicId==>'+epicId);
        if(epicId!=''){
            List<UserStory__c> userStoryList = [SELECT Id,name, Title__c,User_Story__c, AcceptanceCriteria__c,ComponentSpec__c FROM UserStory__c Where Epic__c=:epicId Order By CreatedDate Desc];
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

    @AuraEnabled
    public static List<Map<String, Object>> getUserStoriesData(String epicId){
        
        List<Map<String, Object>> dataMap = new  List<Map<String, Object>>();
        Map<String, List<UserStory__c>> comSpecUserStoryMap = New Map<String, List<UserStory__c>>();
        Map<String,ComponentSpecification__c> comSpecMap = new Map<String,ComponentSpecification__c> ();
        set<Id> comSpecIds = new set<Id>();
        List<UserStory__c> userStoryList = New List<UserStory__c> ();
      
        userStoryList = [SELECT Id, Name, Epic__c, Formatted_Name__c, Component_Specification__c, Component_Specification__r.Name
                         FROM UserStory__c 
                         WHERE  Epic__c =:epicId Order by CreatedDate Desc LIMIT 200];
        
        if(userStoryList.size()>0){
            
            for(UserStory__c thisUS : userStoryList){
                if(thisUS.Component_Specification__c != null){
                    comSpecIds.add(thisUS.Component_Specification__c);   
                }
                if(comSpecUserStoryMap.ContainsKey(thisUS.Component_Specification__c) &&
                  thisUS.Component_Specification__c != null){
                      comSpecUserStoryMap.get(thisUS.Component_Specification__c).add(thisUS);
                  }
                else if(thisUS.Component_Specification__c != null){
                    comSpecUserStoryMap.put(thisUS.Component_Specification__c ,new list<UserStory__c>{thisUS});
                }
            }
            IF(comSpecIds.size()>0){
                comSpecMap = New Map<String,ComponentSpecification__c>([SELECT Id, Name, FormattedSpecification__c FROM ComponentSpecification__c WHERE Id =:comSpecIds ]);
            }
            String Hyperlink_Us='';
            String Hyperlink_Cs='';
            
            for(String thisComSpecId : comSpecUserStoryMap.Keyset()){
               
                Map<String, Object> summaryMap = new Map<String, Object>();
                Hyperlink_Us='';
                Hyperlink_Cs='';
                Hyperlink_Cs = '<a href="/'+thisComSpecId+'" target="_blank">'+  comSpecMap.get(thisComSpecId).Name +'</a><br>';
                
                summaryMap.put('Component_Spec_Link', Hyperlink_Cs);
                for(UserStory__c thisUS : comSpecUserStoryMap.get(thisComSpecId)){
                   Hyperlink_Us += '<a href="/'+thisUS.Id+'" target="_blank">'+thisUS.Formatted_Name__c+'</a><br>'; 
                }
               summaryMap.put('name', Hyperlink_Us);
               summaryMap.put('FormattedSpecification__c',comSpecMap.get(thisComSpecId).FormattedSpecification__c);
               dataMap.add(summaryMap);
            }
        }
        system.debug('dataMap 2 ==>'+dataMap); 
        return dataMap;
    }

    private static List<Id> getRecordbyName(List<UserStory__c> users, String name){
       List<Id> matchingId = new List<Id>();
       String partial = name.substring(0,7); 
        for (UserStory__c user:users){
            if(user.Name.startsWith(partial)){
                matchingId.add(user.Id);
            }
        }
        return matchingId;
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
                                                    WHERE Phase__c =:phase];
                                                    
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

    /*@AuraEnabled(cacheable=true)
    public static List<PromptLibrary__c> getPromptsPerPhase(String phaseType, String searchKey){

        //String key = '%'+searchKey+'%';
        String key = searchKey.toLowerCase();
        List<PromptLibrary__c> promptPerPhaseList = new List<PromptLibrary__c>();

        for(PromptLibrary__c currentRecord : [Select Id
                                                    , Name
                                                    , Prompt__c
                                                    , PromptType__c
                                                    , Phase__c
                                                    , Entity__c
                                                    , Industry__c
                                                    , OutputType__c
                                                    , ModelName__c
                                                    , PromptComplexity__c
                                                    , OutputQuality__c 
                                                FROM PromptLibrary__c
                                                WHERE Phase__c =: phaseType]){

            String prompt = currentRecord.Prompt__c.toLowerCase();                                      
            if(prompt.contains(key)){
                promptPerPhaseList.add(currentRecord);
            }
        }
        
        return promptPerPhaseList;
    }*/

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