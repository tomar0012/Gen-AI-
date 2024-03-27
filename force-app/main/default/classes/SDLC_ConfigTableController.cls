/*
*********************************************************
@Class Name      : SDLC_ConfigTableController
@author          : COE - Sachin(1347061) 
@description     : This class handles various functionalities related to Build Phase of Configuration Table save and update
******************************************************************************
*/
public with sharing class SDLC_ConfigTableController {
    
        /*
*********************************************************
@Method Name     : updateConfigTable
@author          : COE Team - Sachin[1347061]
@description     : Get Config Table Records Date and group them to show on UI/UX
@param inputType : configDataMap as an JSON Object
@return          : True or false
********************************************************
*/ 
    
    @AuraEnabled
    public static boolean updateConfigTable(List<Map<String, Object>> configDataMap) {
        system.debug('configDataMap-->'+configDataMap);
        if(configDataMap != Null && !configDataMap.isEmpty()){}
        return false;
    }
    
    /*
*********************************************************
@Method Name     : getConfigTableData
@author          : COE Team - Sachin[1347061]
@description     : Get Config Table Records Date and group them to show on UI/UX
@param inputType : Void
@return          : JSON Data object
********************************************************
*/ 
    @AuraEnabled
    public static List<Map<String, Object>> getConfigTableData(){
        
        
        String key = '';
        String configData = 'Error while Fetching Configuration Table';
        List<Map<String, Object>> dataMap = new  List<Map<String, Object>>();
        map<String,List<Map<String, Object>>> totalOptionsMap = New Map<String,List<Map<String, Object>>>();
        map<String,llmoptions> defaultOptions = New Map<String,llmoptions>();
        // Key = Phase + action + subActionName
        Map<String,ConfigurationTable__c> ConfigTableMap = new Map<String,ConfigurationTable__c>();
        
        List<ConfigurationTable__c> configTableList = [SELECT Id, Name, Action__c, Active__c, Phase__c, LLM__c,LLM__r.Name, PromptLibrary__c, Prompt_With_Explanation__c, Sub_Action_Name__c, Action_Name__c
                                                       FROM ConfigurationTable__c Order By Phase__c ASC];
        if(configTableList.size()>0){
            for(ConfigurationTable__c thisRecord :configTableList ){
                Key = (String) thisRecord.Phase__c +  thisRecord.Action__c +  thisRecord.Sub_Action_Name__c; 
                
                if(thisRecord.LLM__c != Null &&  !totalOptionsMap.ContainsKey(Key)){
                    Map<String, Object> totaloption = new Map<String, Object>();
                    totaloption.put('label',thisRecord.LLM__r.Name);
                    totaloption.put('value',thisRecord.LLM__r.Name);
                    totalOptionsMap.put(Key,new List<Map<String, Object>>{totaloption});
                }else if(thisRecord.LLM__c != Null && totalOptionsMap.ContainsKey(Key)){
                    Map<String, Object> totaloption = new Map<String, Object>();
                    totaloption.put('label',thisRecord.LLM__r.Name);
                    totaloption.put('value',thisRecord.LLM__r.Name);
                    totalOptionsMap.get(Key).add(totaloption);
                }
                
                if(!ConfigTableMap.ContainsKey(Key) && thisRecord.Active__c){
                    ConfigTableMap.put(Key, thisRecord);
                    
                    llmoptions defaultoption = new llmoptions();
                    defaultoption.label = thisRecord.LLM__r.Name;
                    defaultoption.value = thisRecord.LLM__r.Name;
                    defaultOptions.put(Key,defaultoption);
                    
                }
            }
            
            if(!ConfigTableMap.IsEmpty()){
                
                for(String thiskey : ConfigTableMap.keySet()){
                    
                    Map<String, Object> summaryMap = new Map<String, Object>(); 
                    summaryMap.put('id', ConfigTableMap.get(thiskey).Id);
                    summaryMap.put('formattedKey', thiskey);
                    summaryMap.put('phase', ConfigTableMap.get(thiskey).Phase__c);
                    summaryMap.put('category', ConfigTableMap.get(thiskey).Action__c);
                    summaryMap.put('subCategory', ConfigTableMap.get(thiskey).Sub_Action_Name__c);
                    summaryMap.put('llmoptions', totalOptionsMap.get(thiskey));
                    summaryMap.put('llm', defaultOptions.get(thiskey).value);
                    summaryMap.put('popularity','90%');
                    summaryMap.put('rating', '4');
                    dataMap.add(summaryMap);
                }
                
                
            }
        }
        return dataMap;
    }
    
    class llmoptions {
        public String label;	//GPT3.5 Turbo
        public String value;	//GPT3.5 Turbo
    }
}