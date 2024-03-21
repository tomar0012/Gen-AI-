/*
*********************************************************
@Class Name      : SDLC_BuildController
@author          : COE Team - Sachin(1347061)
@description     : This class handles various functionalities related to Design Phase
********************************************************
*/
public with sharing class SDLC_DesignController {
    /*
    *********************************************************
    @Method Name     : insertComponentSpecificationRecord
    @author          : COE - Sachin
    @description     : Insert Component spec for user stories and create Junction Object
    @param prompt    : The prompt to execute.
    @param inputType : user Story Ids and Formatted Component Spec (HTML)
    @return          : True if Dml insertion of records else false
    ********************************************************
    */ 
    @AuraEnabled
    public static Boolean insertComponentSpecificationRecord(List<String> userStoryIds, String formattedResponse){
        
        String relatedStories='';
        List<User_Stories_Component_Spec__c> usComSpecToUpdateList = New List<User_Stories_Component_Spec__c>();

        List<UserStory__c> userStoryList = [SELECT Id, Name, Title__c
                                            FROM UserStory__c
                                            WHERE Id=:userStoryIds LIMIT 200];
        
        for(UserStory__c currentStory : userStoryList){
            relatedStories += currentStory.Name +'-'+currentStory.Title__c +';';
        }
        
        ComponentSpecification__c compSpec = new ComponentSpecification__c();
        compSpec.Related_User_Stories__c = relatedStories;
        compSpec.FormattedSpecification__c = formattedResponse;
        
        try{
            insert compSpec;
            //CODE TO CREATE JUCTION OBJECT : 19-03-2024
            for(UserStory__c currentStory : userStoryList){
                User_Stories_Component_Spec__c junctionObj = New User_Stories_Component_Spec__c();
                junctionObj.Component_Specification__c = compSpec.Id;
                junctionObj.User_Story__c = currentStory.Id;
                usComSpecToUpdateList.add(junctionObj);
            }
            if(usComSpecToUpdateList.size()>0){
                Insert usComSpecToUpdateList;
                return true;
            }   
        }
        catch(Exception e){
            return false;
        }

        return false;
    }
}