public with sharing class ActionButtonController {
    
    @AuraEnabled
    public static void updateUserStoryToAwaitingApproval(Id recordId){

        UserStory__c currentUserStory = [Select Id, Status__c FROM UserStory__c
                                                WHERE Id=: recordId LIMIT 1];

        if(currentUserStory.Status__c !='Draft'){
            return;
        }
        currentUserStory.Status__c = 'Awaiting Approval';
        update currentUserStory;
    }

    @AuraEnabled
    public static void updateUserStoryToApprove(Id recordId){

        UserStory__c currentUserStory = [Select Id, Status__c FROM UserStory__c
                                                WHERE Id=: recordId LIMIT 1];

        if(currentUserStory.Status__c !='Awaiting Approval'){
            return;
        }
        currentUserStory.Status__c = 'Approved';
        update currentUserStory;
    }
}