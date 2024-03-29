public Interface SDLC_LLMInterface {    
    
    void setLLMConfigId(Id configId);
    void setLLMDetails(ConfigurationTable__c config, Boolean isExplain);
    void setPromptContext(Object context);
    void buildPayload();
    void callLLM();
    String processResponse();
}