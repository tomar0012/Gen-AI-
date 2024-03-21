global Interface LLMInterface {    
    
    void setLLMConfigId(Id configId);
    void setPromptContext(Object context);
    void buildPayload();
    void callLLM();
    String processResponse();
}