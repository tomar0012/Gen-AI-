import { LightningElement,api,wire} from 'lwc';
import { updateRecord,getRecord, getFieldValue } from 'lightning/uiRecordApi';
import STATUS_FIELD from  '@salesforce/schema/ComponentSpecification__c.Status__c';
//import updateComSpecToApprove from '@salesforce/apex/ActionButtonController.updateComSpecToApprove';

const FIELDS = [STATUS_FIELD];

export default class SdlcComponentSpecApproval extends LightningElement {
    @api recordId;

    @api invoke(){
        console.log('Submit'+this.recordId);
        let statusValue = getFieldValue(this.ComponentSpecRecord.data, STATUS_FIELD);
        console.log('STATUS Value '+statusValue);
        if(statusValue == 'Draft'){
            setTimeout(()=>{
                updateRecord({ fields: { Id:this.recordId,Status__c: 'Approved'}});
            },2000);
        }
    }

   @wire(getRecord,{recordId:'$recordId',fields:FIELDS})
   ComponentSpecRecord;
}