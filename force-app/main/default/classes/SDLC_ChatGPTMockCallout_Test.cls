public with sharing class SDLC_ChatGPTMockCallout_Test  implements HttpCalloutMock {
    public HTTPResponse respond(HTTPRequest req) {

        String response = '{"choices":[{"content":"AI Generated repose"}]}';

        HttpResponse resp = new HttpResponse();
        resp.setHeader('Content-Type', 'application/json');
       // resp.setBody(this.response);
        resp.setStatusCode(200);
        return resp;
    }

}