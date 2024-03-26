@isTest
public class SDLC_TestDataFactory {

    public static User createStandardUser() {
        Profile userProfile = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1];
        
        User testUser = new User(
            Alias = 'standt',
            Email = 'testData@testorg.com',
            EmailEncodingKey = 'UTF-8',
            LastName = 'Testing',
            LanguageLocaleKey = 'en_US',
            LocaleSidKey = 'en_US',
            TimeZoneSidKey = 'America/Los_Angeles',
            UserName = 'testData@testorg.com',
            ProfileId = userProfile.Id
        );
        
        insert testUser;
        return testUser;
    }

    public static Engagement__c createEngagement(){
        
        Engagement__c engObj = new Engagement__c(Name='Test EngageMent');
        insert engObj;
        return engObj;
    }

    public static Portfolio__c createPortfolio(String engagementId){
        
        Portfolio__c portObj = new Portfolio__c(Name='Test Portfolio',Engagement__c=engagementId);
        insert portObj;
        return portObj;
    }

    public static Product__c createProduct(String portId){
        
        Product__c productObj = new Product__c(Name='Test Product',Portfolio__c=portId);
        insert productObj;
        return productObj;
    }

    public static Epic__c createEpic(String productId){
        
        Epic__c epicObj = new Epic__c(Name='Test Epic',Product__c=productId);
        insert epicObj;
        return epicObj;
    }

    public static List<UserStory__c> createUserStories(String epicId, Integer noOfStories){

        List<UserStory__c> userStoryList = new List<UserStory__c>();
        for(Integer i = 0; i < noOfStories; i++) {
            UserStory__c userStory = new UserStory__c();
            userStory.Title__c = 'Test Title ' + i;
            userStory.User_Story__c = 'Test User Story ' + i;
            userStory.AcceptanceCriteria__c = 'Test Acceptance Criteria ' + i;
            userStory.Epic__c = epicId;
            userStoryList.add(userStory);
        }
        insert userStoryList;
        return userStoryList;
    }
    
    public static ConfigurationTable__c createConfigurationTable(){

        LLM__c llm = new LLM__c(Name='Test GPT', Model__c='Test Model', NameCred__c='TestCred');
        insert llm;
        PromptLibrary__c prompt = new PromptLibrary__c(Prompt__c='Test Prompts',Phase__c='Analysis',PromptType__c='Software Engineering');
        insert prompt;

        ConfigurationTable__c configTable = new ConfigurationTable__c();
        configTable.Name = 'Create User Story';
        configTable.LLM__c = llm.Id;
        configTable.PromptLibrary__c = prompt.Id;
        configTable.Phase__c = 'Analysis';
        insert configTable;
        return configTable;
    }
    
    public static Feedback__c createFeedback(){
        
        LLM__c llm = new LLM__c(Name='Test GPT', Model__c='Test Model', NameCred__c='TestCred');
        insert llm;
        PromptLibrary__c prompt = new PromptLibrary__c(Prompt__c='Test Prompts',Phase__c='Analysis',PromptType__c='Software Engineering');
        insert prompt;
        
        Feedback__c feedback = new Feedback__c();
        feedback.LLM__c = llm.Id;
        feedback.PromptLibrary__c = prompt.Id;
        insert feedback;
        return feedback;
    } 
    
        /*
    *********************************************************
    @Method Name     : insert_ComponentSpecAndJunctionRecord
    @author          : COE - Sachin
    @description     : Insert Component spec for user stories and create Junction Object
    @param inputType : user Story List and Formatted Component Spec (HTML)
    @return          : True if Dml insertion of records else false
    ********************************************************
    */ 
    
    public static Boolean insert_ComponentSpecAndJunctionRecord(List<UserStory__c> userStoryList, String formattedResponse){
        
        String relatedStories='';
        List<User_Stories_Component_Spec__c> usComSpecToUpdateList = New List<User_Stories_Component_Spec__c>();

        
        for(UserStory__c currentStory : userStoryList){
            relatedStories += currentStory.Name +'-'+currentStory.Title__c +';';
        }
        
        ComponentSpecification__c compSpec = new ComponentSpecification__c();
        compSpec.Related_User_Stories__c = relatedStories;
        compSpec.FormattedSpecification__c = formattedResponse;
        
        try{
            if(Schema.sObjectType.ComponentSpecification__c.isCreateable()) {
            insert compSpec;
            }
            
            for(UserStory__c currentStory : userStoryList){
                User_Stories_Component_Spec__c junctionObj = New User_Stories_Component_Spec__c();
                junctionObj.Component_Specification__c = compSpec.Id;
                junctionObj.User_Story__c = currentStory.Id;
                usComSpecToUpdateList.add(junctionObj);
            }
            if(usComSpecToUpdateList.size()>0 && Schema.sObjectType.User_Stories_Component_Spec__c.isCreateable()){
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