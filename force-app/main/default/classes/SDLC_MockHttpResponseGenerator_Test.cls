@isTest
public class SDLC_MockHttpResponseGenerator_Test implements HttpCalloutMock {
      public HTTPResponse respond(HTTPRequest req) {
            // Create mock response
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            res.setBody('{"response": "Mocked Response"}');
            res.setStatusCode(200);
            return res;
        }
}