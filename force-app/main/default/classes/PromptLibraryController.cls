public with sharing class PromptLibraryController {

    @AuraEnabled
    public static List<PromptLibrary__c> getPromptListWithFilters(Map<String,String> filterVariables){
        List<PromptLibrary__c> promptFilteredList= new List<PromptLibrary__c>();

        String query = 'Select Id, Name, Prompt__c, PromptType__c,Phase__c, Entity__c, Industry__c, OutputType__c, ModelName__c, PromptComplexity__c, OutputQuality__c FROM PromptLibrary__c WHERE Name != null';
        for(String params : filterVariables.keySet()){
            if(params != null && filterVariables.get(params) != 'All'){
                query += ' AND '+params+' = '+ '\''+filterVariables.get(params)+'\'';
            }
            else if(filterVariables.get(params) == 'All'){
                continue;
            }
        }
        query+= ' ORDER BY Name ASC';
        System.debug('Gokul query line '+query);
        promptFilteredList = Database.query(query);
        

        return promptFilteredList;
    }


    @AuraEnabled
    public static List<PromptLibrary__c> createPromptImportRecords(String base64Data) {
        String data = JSON.deserializeUntyped(base64Data).toString();
        List<PromptLibrary__c> promptList = new List<PromptLibrary__c>();
        List<String> lstCSVLines = data.split('\n');
        for(Integer i = 1; i < lstCSVLines.size(); i++){
            PromptLibrary__c promptLib = new PromptLibrary__c();
            String csvLine = lstCSVLines[i];
            String prevLine = csvLine;
            Integer startIndex;
            Integer endIndex;
            
            while(csvLine.indexOf('"') > -1){
                if(startIndex == null){
                    startIndex = csvLine.indexOf('"');
                    csvLine = csvLine.substring(0, startIndex) + ':quotes:' + csvLine.substring(startIndex+1, csvLine.length());
                }else{
                    if(endIndex == null){
                        endIndex = csvLine.indexOf('"');
                        csvLine = csvLine.substring(0, endIndex) + ':quotes:' + csvLine.substring(endIndex+1, csvLine.length());
                    }
                }
                
                if(startIndex != null && endIndex != null){
                    String sub = csvLine.substring(startIndex, endIndex);
                    sub = sub.replaceAll(',', ':comma:');
                    csvLine = csvLine.substring(0, startIndex) + sub + csvLine.substring(endIndex, csvLine.length());
                    startIndex = null;
                    endIndex = null;
                }
            }
            
            List<String> csvRowData = new List<String>();
            for(String column : csvLine.split(',')){
                column = column.replaceAll(':quotes:', '').replaceAll(':comma:', ',');
                csvRowData.add(column);
            }
            System.debug('Gokul Datareceived : '+csvRowData);
            promptLib.Prompt__c = csvRowData[0];
            promptLib.PromptType__c = csvRowData[1];
            promptLib.Entity__c = csvRowData[2];
            promptLib.Industry__c = csvRowData[3];
            promptLib.OutputType__c = csvRowData[4];
            promptLib.ModelName__c = csvRowData[5];
            promptLib.PromptComplexity__c = csvRowData[6];
            promptLib.OutputQuality__c = csvRowData[7];
            promptLib.Phase__c = csvRowData[8];
            promptList.add(promptLib);
        }
        if(!promptList.isEmpty()){
            insert promptList;
        }
        return promptList;
    }


    @AuraEnabled
    public static String executePrompt(String prompt,String context){

        List<Object> promptList = new List<Object>();
        AIHelper.addPrompt(promptList,'system','Hi, I am your Prompt Engineer Assistant.');
        AIHelper.addPrompt(promptList,'user',context);
        AIHelper.addPrompt(promptList,'user',prompt);
        String requestBody=AIHelper.createRequestBody(promptList);

        HttpRequest req=AIHelper.createHTTPRequest();
        req.setBody(requestBody);

        try{
            HttpResponse response = new Http().send(req);
            system.debug('response '+ response.getBody());
            if(response.getStatusCode() == 200) {
            return AIHelper.extractResponse(response.getBody());
            } else if(response.getStatusCode() == 503) {
                return 'Error';
            }
            else{
                return 'Error';
            }
        }catch(Exception e){
            return 'Error';
        }
       
    }
}