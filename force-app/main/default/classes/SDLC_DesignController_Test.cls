@isTest
private class SDLC_DesignController_Test {

    @testSetup
    static void setupTestData() {
        // Create test data for User Stories
        Engagement__c engObj = SDLC_TestDataFactory.createEngagement();
        Portfolio__c portObj = SDLC_TestDataFactory.createPortfolio(engObj.Id);
        Product__c productObj = SDLC_TestDataFactory.createProduct(portObj.Id);
        Epic__c epicObj = SDLC_TestDataFactory.createEpic(productObj.Id);
        List<UserStory__c> userStories = SDLC_TestDataFactory.createUserStories(epicObj.Id,5);
    }
    
    // @isTest
    // static void testInsertComponentSpecResponse() {
    //     List<UserStory__c> userStories = [SELECT Id FROM UserStory__c LIMIT 5];
    //     Map<String, String> mapOfStoryIdWithUserInput = new Map<String, String>();
    //     for(UserStory__c userStory : userStories) {
    //         mapOfStoryIdWithUserInput.put(userStory.Id, 'Test Input');
    //     }
        
    //     List<SDLC_AnalysisController.UserStoryWrapper> result = SDLC_DesignController.insertComponentSpecResponse(mapOfStoryIdWithUserInput, 'Test Prompt');
    //     System.assertNotEquals(null, result);
    // }
    
    // @isTest
    // static void testGetUserStoryWithComponentSpec() {
    //     List<UserStory__c> userStories = [SELECT Id FROM UserStory__c LIMIT 5];
    //     List<String> userStoryIds = new List<String>();
    //     for(UserStory__c userStory : userStories) {
    //         userStoryIds.add(userStory.Id);
    //     }
        
    //     List<SDLC_AnalysisController.UserStoryWrapper> result = SDLC_DesignController.getUserStoryWithComponentSpec(userStoryIds);
    //     System.assertNotEquals(null, result);
    // }
    
    @isTest
    static void testInsertComponentSpecificationRecord() {
        List<UserStory__c> userStories = [SELECT Id FROM UserStory__c LIMIT 2];
        List<String> userStoryIds = new List<String>();
        for(UserStory__c userStory : userStories) {
            userStoryIds.add(userStory.Id);
        }
        
        Boolean result = SDLC_DesignController.insertComponentSpecificationRecord(userStoryIds, 'Test Formatted Response');
        System.assertEquals(true, result);
    }
    
}