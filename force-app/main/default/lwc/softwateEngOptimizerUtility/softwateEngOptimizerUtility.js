import { LightningElement, wire } from 'lwc';
import getUserLicenseData from '@salesforce/apex/SoftwateEngOptimizerUtilityController.getUserLicenseData';
export default class SoftwateEngOptimizerUtility extends LightningElement {
    selectedLicense
    licenseOptions=[];

    @wire(getUserLicenseData)
    wiredLicenseDetails({error, data}){
        console.log('data'+data)
        if(data){
            this.licenseOptions = data.map(licnse=>({
                label: licnse.Name,
                value: licnse.Id
            }));
        }else if(error){
            console.log('error fetching user license: '+ JSON.stringify(error));
        }
    }

    handleChange(event){
        this.selectedLicense=event.detail.value;
    }
}