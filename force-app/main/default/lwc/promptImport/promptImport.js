import { LightningElement,api,track,wire } from 'lwc';
import createPromptImportRecords from '@salesforce/apex/PromptLibraryController.createPromptImportRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { TABLE_DATA ,FILE_SIZE} from './promptImportConstants';

export default class PromptImport extends LightningElement {
    @api recordid;
    @track data;
    @track fileName = '';
    @track UploadFile = 'Upload CSV File';
    @track isTrue = false;
    selectedRecords;
    filesUploaded = [];
    file;
    fileContents;
    fileReader;
    content;
    MAX_FILE_SIZE = FILE_SIZE;

    tableData = TABLE_DATA;

    handleFilesChange(event) {
        if (event.target.files.length > 0) {
            this.filesUploaded = event.target.files;
            this.fileName = event.target.files[0].name;
        }
    }

    handleSave() {
        if (this.filesUploaded.length > 0) {
            this.uploadHelper();
        } else {
            this.fileName = 'Please select a CSV file to upload!!';
        }
    }

    uploadHelper() {
        this.file = this.filesUploaded[0];
        if (this.file.size > this.MAX_FILE_SIZE) {
            console.log('File Size is to long');
            return;
        }
        this.showSpinner = true;
        this.fileReader = new FileReader();
        this.fileReader.onloadend = (() => {
            this.fileContents = this.fileReader.result;
            this.saveToFile();
        });
        this.fileReader.readAsText(this.file);
    }

    saveToFile() {
        console.log('JSONP '+JSON.stringify(this.fileContents));
        createPromptImportRecords({ base64Data: JSON.stringify(this.fileContents), cdbId: this.recordid })
        .then(result => {
            console.log(result);
            this.data = result;
            this.fileName = this.fileName + ' - Uploaded Successfully';
            this.isTrue = false;
            this.showSpinner = false;
            this.showToast('Success', this.file.name + ' - Uploaded Successfully!!!', 'success', 'dismissable');
        })
        .catch(error => {
            console.log(error);
            this.showToast('Error while uploading File', error.body.message, 'error', 'dismissable');
        });
    }

    showToast(title, message, variant, mode) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    }

    handleclick(event){
        console.log('Goul hii');
        this.handleExport();
    }

    handleExport(){
        let comp = this.template.querySelector('c-prompt-manager-utility');
        comp.handleExport(this.tableData);
        /*console.log('Gokul hi');
        let rowEnd = '\n';
        let csvString = '';
        let rowData = new Set();
        console.log('Table data '+ JSON.stringify(this.tableData));
        this.tableData.forEach(function (record) {
            Object.keys(record).forEach(function (key) {
                rowData.add(key);
            });
        });

        rowData = Array.from(rowData);
        csvString += rowData.join(',');
        csvString += rowEnd;

        for(let i=0; i < this.tableData.length; i++){
            let colValue = 0;
            for(let key in rowData) {
                if(rowData.hasOwnProperty(key)) {
                    let rowKey = rowData[key];
                    if(colValue > 0){
                        csvString += ',';
                    }
                    let value = this.tableData[i][rowKey] === undefined ? '' : this.tableData[i][rowKey];
                    csvString += '"'+ value +'"';
                    colValue++;
                }
            }
            csvString += rowEnd;
        }

        let downloadElement = document.createElement('a');
        downloadElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvString);
        downloadElement.target = '_self';
        // CSV File Name
        downloadElement.download = 'Prompt Data.csv';
        // below statement is required if you are using firefox browser
        document.body.appendChild(downloadElement);
        // click() Javascript function to download CSV file
        downloadElement.click();*/
    }
}