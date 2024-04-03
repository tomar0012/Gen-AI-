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
                    id: record.id,
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
        console.log('this '+JSON.stringify(llmConfigDataList[event.target.name].llmoptions));
        let selectedLLMPopularityValue;
        let selectedLLMRatingValue;
        llmConfigDataList[event.target.name].llmoptions.forEach(record=>{
            if(record.value == this.selectedLLM){
                selectedLLMPopularityValue = record.popularity;
                selectedLLMRatingValue = record.rating;
            }
        });
        llmConfigDataList[event.target.name].llm = this.selectedLLM ;
        //llmConfigDataList[event.target.name].rating=this.llmFeedbackMap[this.selectedLLM];
        console.log('Change '+selectedLLMPopularityValue+'   '+selectedLLMRatingValue);
        llmConfigDataList[event.target.name].popularity=selectedLLMPopularityValue;
        llmConfigDataList[event.target.name].rating=selectedLLMRatingValue;
        console.log('optionSelect ==>');            
        this.llmConfigDataList=llmConfigDataList;
        //console.log('formattedData==>'+JSON.stringify(this.llmConfigDataList));
        
    }

    handleSave(event){
        console.log('formattedData ==>'+JSON.stringify(this.llmConfigDataList));
        updateConfigTable({configDataMap: this.llmConfigDataList})
        .then(result => {
            console.log('result',result);
            this.showNotification('Success','Configuration Table Saved Successfully!','success');
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