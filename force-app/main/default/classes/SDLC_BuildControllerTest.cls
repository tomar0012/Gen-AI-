/*
*********************************************************
@Class Name      : SDLC_BuildController
@TestClassName   : SDLC_BuildControllerTest
@author          : COE Team - Sachin(1347061)
@description     : This class covers test coverage of the methods of SDLC_BuildController Class
********************************************************
*/

@isTest
private class SDLC_BuildControllerTest {
    
    @testSetup static void createData() {
        
        // Create test data 
        Engagement__c engObj = SDLC_TestDataFactory.createEngagement();
        Portfolio__c portObj = SDLC_TestDataFactory.createPortfolio(engObj.Id);
        Product__c productObj = SDLC_TestDataFactory.createProduct(portObj.Id);
        Epic__c epicObj = SDLC_TestDataFactory.createEpic(productObj.Id);
        List<UserStory__c> userStories = SDLC_TestDataFactory.createUserStories(epicObj.Id,5);
        SDLC_TestDataFactory.insert_ComponentSpecAndJunctionRecord(userStories,'Test Response');
        
    }
    
    @isTest
    static void testGetUserStoriesData_WithRecords() {
        
        // Call the method to test
        List<Map<String, Object>> dataMap = SDLC_BuildController.getUserStoriesData([SELECT Id FROM Epic__c LIMIT 1].Id);
        
        // Perform assertions
        System.assertNotEquals(0, dataMap.size(), 'Expected data map to have records');
    }
    
    @isTest
    static void testGetUserStoriesData_WithNoRecords() {
        
        // Call the method to test
        List<Map<String, Object>> dataMap = SDLC_BuildController.getUserStoriesData('NonExistingEpicId');
        
        // Perform assertions
        System.assertEquals(0, dataMap.size(), 'Expected data map to have records');
    }
    
}