public with sharing class SDLC_DesignController {
    

    @AuraEnabled
    public static List<SDLC_AnalysisController.UserStoryWrapper> insertComponentSpecResponse(Map<String,String> mapOfStoryIdWithUserInput,String prompt){

        Boolean isSuccess = false;
        List<SDLC_AnalysisController.UserStoryWrapper> userStoryWrapperList = new List<SDLC_AnalysisController.UserStoryWrapper>();
        List<UserStory__c> updateUserStoryList = new List<UserStory__c>();
        for(String userStoryId : mapOfStoryIdWithUserInput.keySet()){

            String specResponse = SoftwareEngOptimizerController.executePrompt(prompt, 'Custom', mapOfStoryIdWithUserInput.get(userStoryId), null);
            if(specResponse != null){
                UserStory__c userStory = new UserStory__c();
                userStory.Id = userStoryId;
                userStory.ComponentSpec__c = specResponse;
                updateUserStoryList.add(userStory);

                SDLC_AnalysisController.UserStoryWrapper userStoryWrapper = new SDLC_AnalysisController.UserStoryWrapper();
                userStoryWrapper.id = userStoryId;
                userStoryWrapper.componentSpec = specResponse;
                userStoryWrapperList.add(userStoryWrapper);
            }
        }
        
        if(!updateUserStoryList.isEmpty()){
            update updateUserStoryList;
        }
        
        return userStoryWrapperList;
    }

    @AuraEnabled
    public static List<SDLC_AnalysisController.UserStoryWrapper> getUserStoryWithComponentSpec(List<String> userStoryIds){

        List<UserStory__c> userStoryList = [SELECT Id, name, Title__c, User_Story__c, AcceptanceCriteria__c, ComponentSpec__c
                                            FROM UserStory__c
                                            WHERE Id=:userStoryIds];
        List<SDLC_AnalysisController.UserStoryWrapper> userStoryWrapperList = new List<SDLC_AnalysisController.UserStoryWrapper>();
        for(UserStory__c userStory : userStoryList) {
            SDLC_AnalysisController.UserStoryWrapper userStoryWrapper = new SDLC_AnalysisController.UserStoryWrapper();
            userStoryWrapper.title = userStory.Title__c;
            userStoryWrapper.acceptanceCriteria = userStory.AcceptanceCriteria__c;
            userStoryWrapper.name = userStory.name+'-'+userStoryWrapper.title;
            userStoryWrapper.Id = userStory.Id;
            userStoryWrapper.userStory = userStory.User_Story__c;
            userStoryWrapper.componentSpec = userStory.ComponentSpec__c;
            userStoryWrapperList.add(userStoryWrapper);
        }
        return userStoryWrapperList;
    }
    
    @AuraEnabled
    public static Boolean insertComponentSpecificationRecord(List<String> userStoryIds, String formattedResponse){
        
        String relatedStories='';
        List<UserStory__c> usUpdateList = New List<UserStory__c>();
        
        List<UserStory__c> userStoryList = [SELECT Id, Name, Title__c
                                            FROM UserStory__c
                                            WHERE Id=:userStoryIds];
        
        for(UserStory__c currentStory : userStoryList){
            relatedStories += currentStory.Name +'-'+currentStory.Title__c +';';
        }
        
        ComponentSpecification__c compSpec = new ComponentSpecification__c();
        compSpec.Related_User_Stories__c = relatedStories;
        compSpec.FormattedSpecification__c = formattedResponse;
        
        try{
            insert compSpec;
            
            //code to update user stories with their component spec obeject : 20-03-2024
            for(UserStory__c currentStory : userStoryList){
                UserStory__c usObj = New UserStory__c();
                usObj.Id = currentStory.Id;
                usObj.Component_Specification__c = compSpec.Id;
                usUpdateList.add(usObj);
            }
            if(usUpdateList.size()>0){
                update usUpdateList;
                return true;
            }
        }
        catch(Exception e){
            return false;
        }
        return false;
    }
}