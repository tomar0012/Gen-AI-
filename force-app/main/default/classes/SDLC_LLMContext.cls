public class SDLC_LLMContext {
 private LLMInterface llm;
 
    public SDLC_LLMContext(LLMInterface llm) {
        this.llm = llm;
    }
 
    public void setLLM(LLMInterface llm) {
        this.llm = llm;
    }
    
    public String processLLMRequest() {
       llm.buildPayload();
       llm.callLLM();
       return llm.processResponse();
    }
    
 
}