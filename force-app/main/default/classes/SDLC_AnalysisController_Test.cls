@isTest
private class SDLC_AnalysisController_Test {

    @testSetup
    static void setupTestData() {

        // Create test data for User Stories
        Engagement__c engObj = SDLC_TestDataFactory.createEngagement();
        Portfolio__c portObj = SDLC_TestDataFactory.createPortfolio(engObj.Id);
        Product__c productObj = SDLC_TestDataFactory.createProduct(portObj.Id);
        Epic__c epicObj = SDLC_TestDataFactory.createEpic(productObj.Id);
        List<UserStory__c> userStories = SDLC_TestDataFactory.createUserStories(epicObj.Id,5);
        ConfigurationTable__c config = SDLC_TestDataFactory.createConfigurationTable();
        // Create test data for Component Specifications
        List<ComponentSpecification__c> compSpecs = new List<ComponentSpecification__c>();
        String relatedStories='';
        for(Integer i = 0; i < userStories.size(); i++) {
            relatedStories +=userStories[i].Name+'-'+userStories[i].Title__c+';';
        }
        ComponentSpecification__c compSpec = new ComponentSpecification__c();
        compSpec.Related_User_Stories__c = relatedStories;
        compSpec.FormattedSpecification__c = 'Test Formatted Specification ';
        insert compSpec;
    }

    @isTest
    static void testInsertUserStories() {
        List<UserStory__c> userStories = [SELECT Id, Title__c, User_Story__c, AcceptanceCriteria__c FROM UserStory__c];
        String epicId = [Select Id FROM Epic__c][0].Id;

        List<SDLC_AnalysisController.UserStoryWrapper> userStoryWrappers = new List<SDLC_AnalysisController.UserStoryWrapper>();

        for(UserStory__c userStory : userStories) {
        SDLC_AnalysisController.UserStoryWrapper wrapper = new SDLC_AnalysisController.UserStoryWrapper();
            wrapper.title = userStory.Title__c;
            wrapper.userStory = userStory.User_Story__c;
            wrapper.acceptanceCriteria = userStory.AcceptanceCriteria__c;
            userStoryWrappers.add(wrapper);
        }

        Test.startTest();
        SDLC_AnalysisController.insertUserStories(userStoryWrappers, epicId);
        Test.stopTest();

        List<UserStory__c> insertedUserStories = [SELECT Id, Title__c, User_Story__c, AcceptanceCriteria__c, Epic__c FROM UserStory__c WHERE Epic__c = :epicId];
        System.assertEquals(userStories.size()+5, insertedUserStories.size());
        }

        @isTest
        static void testGetSavedUserStories() {
        List<UserStory__c> userStories = [SELECT Id, Title__c, User_Story__c, AcceptanceCriteria__c FROM UserStory__c];
        String epicId = [Select Id FROM Epic__c][0].Id;

        Test.startTest();
        List<SDLC_AnalysisController.UserStoryWrapper> savedUserStories = SDLC_AnalysisController.getSavedUserStories(epicId);
        Test.stopTest();

        System.assertNotEquals(null, savedUserStories);
    }

    // @isTest
    // static void testGetUserStoriesData() {
    //     List<UserStory__c> userStories = [SELECT Id, Name, Title__c FROM UserStory__c];
    //     String epicId = [Select Id from Epic__c][0].Id;

    //     Test.startTest();
    //     List<Map<String, Object>> userData = SDLC_AnalysisController.getUserStoriesData(epicId);
    //     Test.stopTest();

    //     System.assertNotEquals(null, userData);
    // }

    // @isTest
    // static void testFetchData() {
    //     Test.startTest();
    //     List<Map<String, Object>> data = SDLC_AnalysisController.fetchData();
    //     Test.stopTest();

    //     System.assertNotEquals(null, data);
    // }

    @isTest
    static void testGetConfigurationDetails() {
        Test.startTest();
        List<SDLC_AnalysisController.ConfigurationWrapper> configDetails = SDLC_AnalysisController.getConfigurationDetails('Analysis');
        Test.stopTest();

        System.assertNotEquals(null, configDetails);
    }
}