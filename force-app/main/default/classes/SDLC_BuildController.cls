/*
*********************************************************
@Class Name      : SDLC_BuildController
@author          : COE-Arch
@description     : This class handles various functionalities related to Build Phase
********************************************************
*/
public with sharing class SDLC_BuildController {

/*
*********************************************************
@Method Name     : getUserStoriesData
@author          : COE Team - Sachin[1347061]
@description     : Get User Stories,Component Spec and Juction Obj btw then and group them to show on UI/UX
@param inputType : epicId
@return          : formatted map of component spec with related user stories with clickable link.
********************************************************
*/ 
    @AuraEnabled
    public static List<Map<String, Object>> getUserStoriesData(String epicId){
        List<Map<String, Object>> dataMap = new  List<Map<String, Object>>();
        Map<String, CSWrapper> comSpecUserStoryMap = New Map<String, CSWrapper>();
        List<User_Stories_Component_Spec__c> userStoryCompSpecList = new List<User_Stories_Component_Spec__c> ();
        
        userStoryCompSpecList =[SELECT Id, Name, User_Story__r.Id, User_Story__r.Name, User_Story__r.Formatted_Name__c, Component_Specification__r.Id, Component_Specification__r.Name, Component_Specification__r.FormattedSpecification__c 
                               FROM User_Stories_Component_Spec__c 
                               WHERE User_Story__r.Epic__c =:epicId WITH USER_MODE order by CreatedDate DESC LIMIT 200];
        
        if(userStoryCompSpecList.size()>0){
            
            for(User_Stories_Component_Spec__c thisRecord : userStoryCompSpecList){
                
                if(comSpecUserStoryMap.ContainsKey(thisRecord.Component_Specification__r.Id)){
                    
                    CSWrapper csWrapperInstance = comSpecUserStoryMap.get(thisRecord.Component_Specification__r.Id);
                    csWrapperInstance.componentSpecName = (String) thisRecord.Component_Specification__r.Name; 
                    csWrapperInstance.formattedSpecification = (String) thisRecord.Component_Specification__r.FormattedSpecification__c; 
                    csWrapperInstance.componentSpeclink = (String) '<a href="/'+thisRecord.Component_Specification__r.Id+'" target="_blank">'+  thisRecord.Component_Specification__r.Name +'</a><br>';
                    
                    USWrapper usWrapperInstance = new USWrapper();
                    usWrapperInstance.userStoryId = (String) thisRecord.User_Story__r.Id;
                    usWrapperInstance.userStoryName = (String) thisRecord.User_Story__r.Name;
                    usWrapperInstance.userStoryLink = (String) '<a href="/'+thisRecord.User_Story__r.Id+'" target="_blank">'+  thisRecord.User_Story__r.Formatted_Name__c +'</a><br>';
                    csWrapperInstance.usWrapperList.add(usWrapperInstance);
                    
                    comSpecUserStoryMap.put(thisRecord.Component_Specification__r.Id, csWrapperInstance);
                }
                else {
                    CSWrapper csWrapperInstance = new CSWrapper();
                    csWrapperInstance.componentSpecName = (String) thisRecord.Component_Specification__r.Name; 
                    csWrapperInstance.formattedSpecification = (String) thisRecord.Component_Specification__r.FormattedSpecification__c; 
                    csWrapperInstance.componentSpeclink = (String) '<a href="/'+thisRecord.Component_Specification__r.Id+'" target="_blank">'+  thisRecord.Component_Specification__r.Name +'</a><br>';
                    
                    USWrapper usWrapperInstance = new USWrapper();
                    usWrapperInstance.userStoryId = (String) thisRecord.User_Story__r.Id;
                    usWrapperInstance.userStoryName = (String) thisRecord.User_Story__r.Name;
                    usWrapperInstance.userStoryLink = (String) '<a href="/'+thisRecord.User_Story__r.Id+'" target="_blank">'+  thisRecord.User_Story__r.Formatted_Name__c +'</a><br>';
                    csWrapperInstance.usWrapperList = new List<USWrapper>{usWrapperInstance};
                        
                    comSpecUserStoryMap.put(thisRecord.Component_Specification__r.Id,csWrapperInstance);
                }
            }
            
            String hyperlink='';         
            for(String thisComSpecId : comSpecUserStoryMap.Keyset()){
                hyperlink=''; 
                Map<String, Object> summaryMap = new Map<String, Object>();                
                
                for(USWrapper thisUS : comSpecUserStoryMap.get(thisComSpecId).usWrapperList){
                    hyperlink +=  thisUS.userStoryLink; 
                }
                summaryMap.put('name', hyperlink);
                summaryMap.put('Component_Spec_Link', comSpecUserStoryMap.get(thisComSpecId).componentSpeclink);
                summaryMap.put('FormattedSpecification__c',comSpecUserStoryMap.get(thisComSpecId).formattedSpecification);
                
                dataMap.add(summaryMap);
            }
        }
        return dataMap;
    }
    
    public class CSWrapper {
        @AuraEnabled
        public String componentSpecName { get; set; }
        @AuraEnabled
        public String componentSpeclink { get; set; }
        @AuraEnabled
        public String formattedSpecification { get; set; }
        @AuraEnabled
        public List<USWrapper> usWrapperList { get; set; }
        
    }
    public class USWrapper {
        @AuraEnabled
        public String userStoryId { get; set; }
        @AuraEnabled
        public String userStoryName { get; set; }
        @AuraEnabled
        public String userStoryLink{ get; set; }
        
    }
}