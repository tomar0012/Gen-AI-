import { LightningElement,api } from 'lwc';

export default class DownloadFilelwc extends LightningElement {


@api
format;    
@api
fileName;
@api
fileData;
downloadFile(){
  
    let hiddenElement=document.createElement('a');

    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(this.fileData);
    hiddenElement.target = '_blank';
    hiddenElement.download = this.fileName+this.format; 
    hiddenElement.click();

    
 }


}