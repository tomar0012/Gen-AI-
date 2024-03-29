import { LightningElement, api} from 'lwc';
import createFeedback from '@salesforce/apex/SDLC_SoftwareEngOptimizerController.createFeedback';

export default class SdlcUtility extends LightningElement {
    
    @api
    setParameterWrapperDetails(_inputType, _userInput, _inputFile, _actionName, _subActionName, _isExplain){
        console.log('inside utility param')
        let wrapperDetails = {
            inputType:_inputType,
            userInput:_userInput,
            inputFile:JSON.stringify(_inputFile),
            actionName:_actionName,
            subAction:_subActionName,
            isExplain:_isExplain
        };
        return wrapperDetails;
    }

    @api
    async createFeedback(_actionName,_subActionName){
        var feedbackRecordId;
        let result = await createFeedback({actionName:_actionName,subAction:_subActionName});
        feedbackRecordId = result;
        return feedbackRecordId;
    }
}