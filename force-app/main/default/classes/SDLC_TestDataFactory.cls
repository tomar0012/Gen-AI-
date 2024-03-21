@isTest
public class SDLC_TestDataFactory {

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
}