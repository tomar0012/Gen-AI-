import { LightningElement,track,api } from 'lwc';
import FEEDBACK_OBJ from '@salesforce/schema/Feedback__c';
import COMMENTS from '@salesforce/schema/Feedback__c.Comments__c';
import RESPONSE_FIELD from '@salesforce/schema/Feedback__c.Response__c';
import RESPONSE_FEEDBACK_FIELD from '@salesforce/schema/Feedback__c.ResponseFeedback__c';
import updateFeeback from '@salesforce/apex/SoftwareEngOptimizerController.updateFeeback';
import createFeedback from '@salesforce/apex/SoftwareEngOptimizerController.createFeedback';

export default class FeedbackComponent extends LightningElement {
    buttonClicked = false;
    feedbackButtonLabel = '';
    showPopup = false;
    comments = COMMENTS;
    feedbackObject = FEEDBACK_OBJ;
    responseField = RESPONSE_FIELD;
    responseFeedbackField = RESPONSE_FEEDBACK_FIELD;
    responseValue;
    isReadOnly = false;
    responseFeedbackValue;
    commentValue='';
    showCommentSection = false;
    @api promptId;
    @api llmId;
    recordId;


    handleButtonClick(event){
        this.buttonClicked = !this.buttonClicked;
        this.feedbackButtonLabel = event.target.label;
        this.showCommentSection= false;
        this.responseFeedbackValue='';
        console.log('Gokul event '+event.target.title);
        let dataId;
        switch(event.target.title){
            case 'Positive':
                this.responseValue = 'Positive';
                dataId = '[data-id="Positive"]';
                break;
            case 'Neutral':
                this.responseValue = 'Neutral';
                dataId = '[data-id="Neutral"]';
                break;
            case 'Negative':
                this.responseValue = 'Negative';
                dataId = '[data-id="Negative"]';
                break;
        }
        this.template.querySelectorAll("button").forEach(but=>{
            but.classList.remove('button-highlighter');
        })
        this.template.querySelector(dataId).classList.add('button-highlighter');
        if(this.recordId){
            this.showPopup = true;
        }
        else{
            console.log('Record is null')
            this.createFeedbackRecord();
        }
    }

    handleSubmit(event){
        console.log('submit');
        this.updateFeebackRecord();
    }

    handleClose(event){
        this.showPopup = false;
        console.log('Close');
        this.updateFeebackRecord();
    }

    handleComments(event){
        this.commentValue = event.target.value;
    }

    updateFeebackRecord(){
        this.showPopup = false;
        updateFeeback({recordId:this.recordId,response:this.responseValue,responseFeedback:this.responseFeedbackValue,comments:this.commentValue})
        .then(result=>{
            console.log('UPDATED FEEDBACK '+result);
        })
        .catch(error=>{
            console.log('ERRO '+error);
            this.showPopup = false;
        });
        
    }

    handleResponseFeedback(event){
        console.log('RESP FEED');
        this.responseFeedbackValue = event.target.value;
        if(event.target.value == 'Others'){
            this.showCommentSection = true;
        }
        else{
            this.showCommentSection = false;
        }
    }

    createFeedbackRecord(){
        createFeedback({promptId:this.promptId, llmId: this.llmId})
        .then(result=>{
            this.recordId = result;
            this.showPopup = true;
        })
        .catch(error=>{
            console.log('ERROR => '+error);
        })
    }
}