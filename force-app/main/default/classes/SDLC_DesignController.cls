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
        List<User_Stories_Component_Spec__c> juctionRecordsList = new List<User_Stories_Component_Spec__c>();
        List<ComponentSpecification__c> comSpecListToUpsert = new List<ComponentSpecification__c>();
        Set<Id> alreadySolUserStory = new Set<Id>();
        
        If(userStoryIds != Null && userStoryIds.size()>0){
            
            juctionRecordsList= [
                SELECT Id, Name, User_Story__c, Component_Specification__c, User_Story__r.Name, User_Story__r.Title__c
                FROM User_Stories_Component_Spec__c
                WHERE User_Story__c =:userStoryIds 
                WITH USER_MODE LIMIT 200
            ];
            system.debug('juctionRecordsList -->'+juctionRecordsList);
            
            for(User_Stories_Component_Spec__c thisRcd : juctionRecordsList ){
                alreadySolUserStory.add(thisRcd.User_Story__c);
                
                ComponentSpecification__c compSpec = new ComponentSpecification__c(Id = thisRcd.Component_Specification__c);
                compSpec.FormattedSpecification__c = formattedResponse; 
                comSpecListToUpsert.add(compSpec);
            }

        }

        List<UserStory__c> userStoryList = [SELECT Id, Name, Title__c
                                            FROM UserStory__c
                                            WHERE Id=:userStoryIds 	AND Id !=:alreadySolUserStory WITH USER_MODE LIMIT 200];
        
        for(UserStory__c currentStory : userStoryList){
            relatedStories += currentStory.Name +'-'+currentStory.Title__c +';';
        }
        
        ComponentSpecification__c compSpec = new ComponentSpecification__c();
        compSpec.Related_User_Stories__c = relatedStories;
        compSpec.FormattedSpecification__c = formattedResponse;
        comSpecListToUpsert.add(compSpec);
        
        try{
            if(Schema.sObjectType.ComponentSpecification__c.isCreateable() &&  Schema.sObjectType.ComponentSpecification__c.isUpdateable()) {
            upsert comSpecListToUpsert;
            }

            for(UserStory__c currentStory : userStoryList){
                User_Stories_Component_Spec__c junctionObj = New User_Stories_Component_Spec__c();
                junctionObj.Component_Specification__c = compSpec.Id;
                junctionObj.User_Story__c = currentStory.Id;
                usComSpecToUpdateList.add(junctionObj);
            }
            if(usComSpecToUpdateList.size()>0 && Schema.sObjectType.User_Stories_Component_Spec__c.isCreateable()){
                Insert usComSpecToUpdateList;
                system.debug('usComSpecToUpdateList -->'+usComSpecToUpdateList);
                return true;
            }   
        }
        catch(Exception e){
            return false;
        }

        return false;
    }
}