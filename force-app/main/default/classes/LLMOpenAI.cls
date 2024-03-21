public class LLMOpenAI implements LLMInterface{

    String payload;
    HttpResponse response;
    String endPoint;
    String namedCredential;
    
    List<Object> promptList;
    String model;
    String context;
    String prompt;
    Id configId;

    
    public LLMOpenAI(){
        this.model='gpt-3.5-turbo';
        this.namedCredential='Chatgpt';
        this.context='I am a Salesforce admin';
        this.prompt='How do I become developer?';
    }
    String getEndPoint(){
        return 'callout:'+this.namedCredential;
      
    }

    public void setLLMConfigId(Id configId){
        this.configId=configId;
        getConfigurationDetails(configId);
    }

    public void setPromptContext(Object input){
        this.context=JSON.serialize(input);
        system.debug('INPUT '+this.context);
    }
    
    public void buildPayload(){
        
        List<Object> promptList = new List<Object>();
        AIHelper.addPrompt(promptList,'system','Hi, I am your SOftware Engineering Assistant.');
        AIHelper.addPrompt(promptList,'user',this.context);
        AIHelper.addPrompt(promptList,'user',this.prompt);
        
        Map<String,Object> prompRequestBody = new Map<String,Object>();
        prompRequestBody.put('messages',promptList);
        prompRequestBody.put('model',model);
        
  
        this.payload=JSON.serialize(prompRequestBody);
       
    }
    public void callLLM(){
        HttpRequest request = new HttpRequest();
        request.setEndpoint(this.getEndPoint());
        request.setMethod('POST');
        request.setTimeout(120000);
        request.setHeader('Content-Type', 'application/json');
        
        request.setBody(this.payload);
        response=new Http().send(request);
    }
    public String processResponse(){

         Map<String, Object> responseBody = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
     	 System.debug(response.getBody());
        List<Object> choices = (List<Object>)responseBody.get('choices');
        if (choices.size() > 0) {
            Map<String, Object> choice = (Map<String, Object>)choices.get(0);
            Map<String,Object> mpMessages = (Map<String,Object>)choice.get('message');
            String responseText = (String)mpMessages.get('content');
            responseText = responseText != null ? responseText.trim() : '';
            return responseText;
        }else{
            return 'error';
        }   
    }

    public void getConfigurationDetails(Id configId){

        ConfigurationTable__c config = [Select Id
                                                , Name
                                                , LLM__r.Name
                                                , LLM__r.Id
                                                , LLM__r.NameCred__c
                                                , LLM__r.Model__c
                                                , LLM__r.ClassName__c
                                                , PromptLibrary__r.Id
                                                , PromptLibrary__r.Prompt__c
                                            FROM ConfigurationTable__c 
                                            WHERE Id=:configId
                                            LIMIT 1];

        this.namedCredential = config.LLM__r.NameCred__c;
        this.model = config.LLM__r.Model__c;
        this.prompt = config.PromptLibrary__r.Prompt__c;
        
    }
}