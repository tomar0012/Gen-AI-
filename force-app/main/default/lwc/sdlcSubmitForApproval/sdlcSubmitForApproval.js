import { LightningElement,api,wire} from 'lwc';
import { updateRecord,getRecord, getFieldValue } from 'lightning/uiRecordApi';
import STATUS_FIELD from  '@salesforce/schema/UserStory__c.Status__c';
import updateUserStoryToAwaitingApproval from '@salesforce/apex/ActionButtonController.updateUserStoryToAwaitingApproval';

const FIELDS = [STATUS_FIELD];
export default class SdlcSubmitForApproval extends LightningElement {
    @api recordId;

    @api invoke(){
        console.log('Submit'+this.recordId);
        let statusValue = getFieldValue(this.userStoryRecord.data, STATUS_FIELD);
        console.log('STATUS Value '+statusValue);
        if(statusValue == 'Draft'){
            setTimeout(()=>{
                updateRecord({ fields: { Id:this.recordId,Status__c: 'Awaiting Approval'}});
            },2000);
        }
    }

   @wire(getRecord,{recordId:'$recordId',fields:FIELDS})
   userStoryRecord;
}