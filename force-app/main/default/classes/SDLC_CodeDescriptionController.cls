public with sharing class SDLC_CodeDescriptionController {
    
    private static final String KEY = ChatGPTInfo__mdt.getInstance('info').ChatGPTKey__c;
    private static final String ENDPOINT ='https://api.openai.com/v1/chat/completions';
    @AuraEnabled
    public static String getDescription(String snippet, String prompt){
        system.debug('prompt: '+prompt);
        try{
            Http http = new Http();
            HttpRequest request = new HttpRequest();

            request.setEndpoint(ENDPOINT);
            request.setMethod('POST');
            request.setTimeout(120000);
            request.setHeader('Content-Type', 'application/json');
            request.setHeader('Authorization', 'Bearer '+ KEY);

            String customPrompt = 'You are a Salesforce expert. Answer questions as you are Salesforce Expert. If information is more provide it in multiple points.\n\nQ: '+prompt+'\nA: ';

            List<Object> promptList = new List<Object>();
            Map<String,Object> requestBody = new Map<String,Object>();
            requestBody.put('role','system');
            requestBody.put('content',customPrompt); 
            promptList.add(requestBody);

            requestBody = new Map<String,Object>();
            requestBody.put('role','user');
            requestBody.put('content',snippet);
            promptList.add(requestBody);

            Map<String,Object> prompRequestBody = new Map<String,Object>();
            prompRequestBody.put('messages',promptList);
            prompRequestBody.put('model','gpt-3.5-turbo');
            request.setBody(JSON.serialize(prompRequestBody));

            HttpResponse response = http.send(request);
            if(response.getStatusCode() == 200){
                system.debug(response.getBody());
                Map<String,Object> responseMap = (Map<String,Object>)JSON.deserializeUntyped(response.getBody());
                List<Object> choices = (List<Object>)responseMap.get('choices');
                Map<String,Object> choiceMap = (Map<String,Object>)choices[0];
                system.debug(choiceMap);
                Map<String,Object> textMap = (Map<String,Object>)choiceMap.get('message');
                String text = (String)textMap.get('content');
                system.debug('text: '+text);
                return text;
            }else{
                return 'Sorry but the model is currently overloaded with other requests. Could you retry your request once again?';
            }
        }catch(Exception e){
            return 'Sorry but the model is currently overloaded with other requests. Could you retry your request once again?';
        } 
    }

    @AuraEnabled
    public static List<ApexClass> getClassNames(){
        try {
            List<ApexClass> classes = [select Name from ApexClass where NamespacePrefix='' with Security_Enforced ORDER BY Name Asc LIMIT 10000];
            return classes;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled
    public static List<ApexClass> getTestClassNames(){
        try {
            List<ApexClass> unitTests = [FIND '@isTest' IN ALL FIELDS RETURNING ApexClass(Id, Name)][0];
            system.debug('==>'+unitTests);            
            return unitTests;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<ApexClass> getFilteredApexClass(){
       List<ApexClass> filteredClass = new List<ApexClass>();
       Set<String> testClassNames = new Set<String>();

       for(ApexClass testClass: getTestClassNames()){
        testClassNames.add(testClass.Name);
       }

       for(ApexClass cls : getClassNames()){
        if (!testClassNames.contains(cls.Name)){
            filteredClass.add(cls);
        }
       }
       system.debug('filteredClass==>'+filteredClass);
       return filteredClass;
    }

    @AuraEnabled
    public static String getClassBody(String className){
        try {
            ApexClass apexClass = [select Body from ApexClass where Id = :className with Security_Enforced LIMIT 1];
            return apexClass.Body;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
       
}