public class SDLC_LLMContext {
 private SDLC_LLMInterface llm;
 
    public SDLC_LLMContext(SDLC_LLMInterface llm) {
        this.llm = llm;
    }
 
    public void setLLM(SDLC_LLMInterface llm) {
        this.llm = llm;
    }
    
    public String processLLMRequest() {
       llm.buildPayload();
       llm.callLLM();
       return llm.processResponse();
    }
    
 
}