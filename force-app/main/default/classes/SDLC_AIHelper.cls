public with sharing class SDLC_AIHelper {
    
    private static String KEY = ChatGPTInfo__mdt.getInstance('info').ChatGPTKey__c;
    private static final String ENDPOINT = ChatGPTInfo__mdt.getInstance('info').API_URL__c; /* 'https://api.openai.com/v1/chat/completions' */
    private static final String AI_MODEL=ChatGPTInfo__mdt.getInstance('info').AI_Model__c;/**gpt-3.5-turbo */

    public static HttpRequest createHTTPRequest(){
        HttpRequest request = new HttpRequest();
        request.setEndpoint(ENDPOINT);
        request.setMethod('POST');
        request.setTimeout(120000);
        request.setHeader('Content-Type', 'application/json');
        if(System.label.GenAI_Super_User_Emails.contains(UserInfo.getUserEmail())){
            request.setHeader('Authorization', 'Bearer '+ System.label.Demo_User_API_Key);
        }else{
            request.setHeader('Authorization', 'Bearer '+ KEY);
        }
       
        return request;
    }

    public static String extractResponse(String response){
        
        Map<String, Object> responseBody = (Map<String, Object>)JSON.deserializeUntyped(response);
     
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

    public static String createRequestBody(List<Object> promptList){
        Map<String,Object> prompRequestBody = new Map<String,Object>();
        prompRequestBody.put('messages',promptList);
        prompRequestBody.put('model',AI_MODEL);
        return JSON.serialize(prompRequestBody);
    }

    public static void addPrompt(List<Object> promptList,String role,String content){

        Map<String,Object> newPromptMap = new Map<String,Object>();
        newPromptMap.put('role',role);
        newPromptMap.put('content',content);
        promptList.add(newPromptMap);
       
    }

    
    @AuraEnabled
    public static String getAIResponse(String systemContext,String prompt,String content){
       
           
            List<Object> promptList = new List<Object>();
            if(systemContext == 'General'){
                SDLC_AIHelper.addPrompt(promptList,'system','You are a helpful assistant');
                //AIHelper.addPrompt(promptList,'content','You are a helpful assistant');
            }else{
                SDLC_AIHelper.addPrompt(promptList,'system','you are a '+systemContext+' expert.You can answer'+systemContext+' related queries only. Refuse to answer queries other than '+systemContext+' related queries');
                //requestBody.put('content','you are a '+systemContext+' expert.You can answer'+systemContext+' related queries only. Refuse to answer queries other than '+systemContext+' related queries');        
            }
            SDLC_AIHelper.addPrompt(promptList,'user',prompt);
            SDLC_AIHelper.addPrompt(promptList,'user',content);

            String requestBody=SDLC_AIHelper.createRequestBody(promptList);

            System.debug(requestBody);
    
            HttpRequest req=SDLC_AIHelper.createHTTPRequest();
            req.setBody(requestBody);
    
            try{
           
                    HttpResponse response = new Http().send(req);
            
                    system.debug('response '+ response.getBody());
                    if(response.getStatusCode() == 200) {
                        return SDLC_AIHelper.extractResponse(response.getBody());
                    }else

                    if(response.getStatusCode() == 503) {
                        return System.label.ChatGPT_Error;
                    }
                    else{
                        return 'error';
                    }
            }catch(Exception ex){
               // System.debug('Exception in Catch of Server-Side Controller '+ex.getCause()+ex.getLineNumber()+ex.getMessage());
                //throw new AuraHandledException(ex.getMessage());
                 return System.label.ChatGPT_Error;
            }
           
           
    }

}