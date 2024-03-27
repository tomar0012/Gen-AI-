import { LightningElement,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getConfigTableData from '@salesforce/apex/SDLC_ConfigTableController.getConfigTableData';
import updateConfigTable from '@salesforce/apex/SDLC_ConfigTableController.updateConfigTable';

export default class LlmConfigTable extends LightningElement {

    @track
    llmConfigDataList ;


    setConfigTableData(){
        getConfigTableData()
        .then((result) => {
            let formattedData = [];
            result.forEach(record =>{
                formattedData.push({
                    id: record.Id,
                    phase:record.phase,
                    phase:record.phase,
                    category:record.category,
                    subCategory:record.subCategory,
                    llmoptions:record.llmoptions,
                    llm:record.llm,
                    popularity:record.popularity,
                    rating:record.rating,
                    formattedKey:record.formattedKey
                });
            });
           this.llmConfigDataList = formattedData;
           console.log('formattedData==>'+JSON.stringify(formattedData));
        })
        .catch((error) => {
            console.log('error==>'+error);
        });
    }

    connectedCallback(){
        this.setConfigTableData();
    }

    selectedLLM;

    // onllmselection(event){
    //     console.log(event.target.value);
    //     const field = event.target.name;
    //     if (field === 'optionSelect') {
    //             this.selectedLLM = event.target.value;
    //             let llmConfigDataList=[...this.llmConfigDataList];
    //             llmConfigDataList[event.currentTarget.dataset.item].popularity=this.llmPopulaityMap[this.selectedLLM];
    //             console.log(this.llmPopulaityMap[this.selectedLLM]);
    //             this.llmConfigDataList=llmConfigDataList;
    //         } 
    // }

    handleModalChange(event){
        console.log('Target Value-->'+event.target.value);
        console.log('Item -->'+event.currentTarget.dataset.item);
        console.log('Name -->'+event.target.name);

                this.selectedLLM = event.target.value;
              let llmConfigDataList=[...this.llmConfigDataList];
                llmConfigDataList[event.target.name].llm = this.selectedLLM ;
             //  llmConfigDataList[event.target.name].rating=this.llmFeedbackMap[this.selectedLLM];
             
                console.log('optionSelect ==>');            
               this.llmConfigDataList=llmConfigDataList;
               console.log('formattedData==>'+JSON.stringify(this.llmConfigDataList));
        
    }
    handleSave(event){
        updateConfigTable({configDataMap: this.llmConfigDataList})
        .then(result => {
            console.log('result',result);
            this.showNotification('Success','Configuration Table Saved logic is yet to be written','success');
            this.fireUserStorySavedEvent();
        })
        .catch(error => {
            console.log('error',error);
        });
    }
    showNotification(_title, _message, _variant) {
        const evt = new ShowToastEvent({
            title: _title,
            message: _message,
            variant: _variant
        });
        this.dispatchEvent(evt);
    }
}