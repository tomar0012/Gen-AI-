import { LightningElement, wire, track } from 'lwc';
import getAllUserLicesnse from '@salesforce/apex/SDLC_InfyAIForceUtility.getAllUserLicesnse';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAllEngagement from '@salesforce/apex/SDLC_InfyAIForceUtility.getAllEngagement';
import getAllPortfolios from '@salesforce/apex/SDLC_InfyAIForceUtility.getAllPortfolios';
import getAllProductDetails from '@salesforce/apex/SDLC_InfyAIForceUtility.getAllProductDetails';
import getAllEpicDetails from '@salesforce/apex/SDLC_InfyAIForceUtility.getAllEpicDetails';
import { NavigationMixin } from 'lightning/navigation';
import getUserName from '@salesforce/apex/SDLC_InfyAIForceUtility.getCurrentUserLicenseData';
import BA_PIC from '@salesforce/resourceUrl/BAPic';
import { avatarOptions, DEFAULT_ENGAGEMENT, DEFAULT_PORTFOLIO, DEFAULT_PRODUCT, DEFAULT_EPIC, DEFAULT_LICENSE } from './Constant';

export default class SldcSetupPhase extends NavigationMixin(LightningElement) {
    @track userLicenses = [];
    @track selectedLicenses = [];
    @track records = [];
    @track folioRecords = [];
    @track productDetails = [];
    @track epicDetails = [];
    firstName;
    selectedEpicLabel;
    isSelectedEpic = false;
    @track avatarContext = { value: "Business Analyst", icon: BA_PIC };
    selectedProductLabel;
    isSelectedProduct = false;
    selectedPortfolioLabel;
    isSelectedfolio = false;
    selectedEngagementLabel;
    isSelectedEngagement = false;
    defaultEngagement = DEFAULT_ENGAGEMENT;
    defaultPortfolio = DEFAULT_PORTFOLIO;
    defaultProduct = DEFAULT_PRODUCT;
    defaultEpic = DEFAULT_EPIC;
    selectedPortfolioId = this.defaultPortfolio;
    selectedEngagementId = this.defaultEngagement;
    selectedProductId = this.defaultProduct;
    selectedEpicId = this.defaultEpic;
    defaultLicenses = DEFAULT_LICENSE;
    avatarOptions = avatarOptions();

    handleSelectedAvatar(event) {
        try {
            let iconName;
            this.avatarOptions.forEach(record => {
                iconName = (record.value == event.target.value) ? record.icon : iconName;
            });
            this.avatarContext = { value: event.target.value, icon: iconName };
        } catch (error) {
            console.error(error);
        }
    }

    //fetches current user's name
    @wire(getUserName)
    wiredUserName({ error, data }) {
        try {
            if (data) {
                this.firstName = data[0].Name;
            } else if (error) {
                console.log('error fetching user' + JSON.stringify(error));
            }
        } catch (error) {
            console.error(error);
        }
    }

    //fetch all the user licences
    @wire(getAllUserLicesnse)
    wiredUserLicenses({ error, data }) {
        try {
            if (data) {
                this.userLicenses = data.map(license => ({
                    label: license.MasterLabel,
                    value: license.MasterLabel
                }));
                console.error('this.userLicenses==>'+JSON.stringify(this.userLicenses));
            } else if (error) {
                console.log('error fetching license:::' + JSON.stringify(error));
            }
        } catch (error) {
            console.error(error);
        }
    }

    handleLicenseSelection(event) {
        try {
            this.selectedLicenses = event.detail.value;
        } catch (error) {
            console.error(error);
        }
    }

    handleSave() {
        try {
            const projectContext = { engagement: this.selectedEngagementLabel ? this.selectedEngagementLabel : 'Infosys', portfolio: this.selectedPortfolioLabel,
                product: this.selectedProductLabel, epic: this.selectedEpicLabel, productId: this.selectedProductId, portfolioId: this.selectedPortfolioId, engagementId: this.selectedEngagementId, epicId: this.selectedEpicId }
            const save = new CustomEvent("save", { detail: projectContext });
            this.dispatchEvent(save);
            const event = new ShowToastEvent({
                title: 'Success',
                message: 'Record Saved successfully',
                variant: 'success',
            });
            this.dispatchEvent(event);
            this.dispatchEvent(new CustomEvent("avatarchange", { detail: this.avatarContext }));
            this.dispatchEvent(new CustomEvent("rendered"));
        } catch (error) {
            console.error(error);
        }
    }

    //get all engagements
    @wire(getAllEngagement)
    wiredRecods({ error, data }) {
        try {
            let recList = [];
            if (data) {
                this.isSelectedEngagement = false;
                data.forEach((record) => {
                    recList.push({
                        label: record.Name,
                        value: record.Id,
                    });
                });
            } else if (error) {
                console.log('error fetching license:::' + JSON.stringify(error));
            }
            this.records = recList;
        } catch (error) {
            console.error(error);
        }
    }

    //get all portfolio's related to engagement
    @wire(getAllPortfolios, { engagementId: '$selectedEngagementId' })
    wiredPortfolios({ error, data }) {
        try {
            let folioRecords = [];
            if (data) {
                data?.forEach(record => {
                    folioRecords.push({
                        label: record.Name,
                        value: record.Id
                    });
                });
                if (data.length > 0) {
                    this.defaultPortfolio = data[0].Id;
                    this.selectedPortfolioId = this.defaultPortfolio;
                    this.selectedPortfolioLabel = data[0].Name;
                }
            } else if (error) {
                console.log('error fetching license:::' + JSON.stringify(error));
            }
            this.folioRecords = folioRecords;
            this.isSelectedfolio = false;
        } catch (error) {
            console.error(error);
        }
    }

    //get all product's related to protfolio
    @wire(getAllProductDetails, { portfolioId: '$selectedPortfolioId' })
    wiredProducts({ error, data }) {
        try {
            let productDetails = [];
            if (data) {
                this.isSelectedProduct = false;
                data.forEach(record => {
                    productDetails.push({
                        label: record.Name,
                        value: record.Id
                    });
                });
                if (data.length > 0) {
                    this.defaultProduct = data[0].Id;
                    this.selectedProductId = this.defaultProduct;
                    this.selectedProductLabel = data[0].Name;
                }
            } else if (error) {
                console.log('error fetching license:::' + JSON.stringify(error));
            }
            this.productDetails = productDetails;
        } catch (error) {
            console.error(error);
        }
    }

    //get all epic's related to product
    @wire(getAllEpicDetails, { productId: '$selectedProductId' })
    wiredEpics({ error, data }) {
        try {
            let epicDetails = [];
            if (data) {
                this.isSelectedEpic = false;
                data.forEach(record => {
                    epicDetails.push({
                        label: record.Name,
                        value: record.Id
                    });
                });
                if (data.length > 0) {
                    this.defaultEpic = data[0].Id;
                    this.selectedEpicId = this.defaultEpic;
                    this.selectedEpicLabel = data[0].Name;
                }
            } else if (error) {
                console.log('error fetching license:::' + JSON.stringify(error));
            }
            this.epicDetails = epicDetails;
        } catch (error) {
            console.error(error);
        }
    }

    handleEngagementChange(event) {
        try {
            this.selectedEngagementId = event.detail.value;
            this.isSelectedEngagement = true;
            const currentLabel = this.records.find(option => {
                return option.value === this.selectedEngagementId
            });
            if (currentLabel) {
                this.selectedEngagementLabel = currentLabel.label;
            }
            console.log(this.selectedEngagementLabel)
            this.productDetails = '';
            this.folioRecords = '';
            this.epicDetails = '';
        } catch (error) {
            console.error(error);
        }
    }

    handlePortfolioChange(event) {
        try {
            this.selectedPortfolioId = event.detail.value;
            this.isSelectedfolio = true;
            const currentLabel = this.folioRecords.find(option => {
                return option.value === this.selectedPortfolioId
            });

            if (currentLabel) {
                this.selectedPortfolioLabel = currentLabel.label;
            }
            this.selectedProduct = this.selectedPortfolio;
        } catch (error) {
            console.error(error);
        }
    }
    
    handleProductChange(event) {
        try {
            this.selectedProductId = event.detail.value;
            this.isSelectedProduct = true;
            const currentLabel = this.productDetails.find(option => {
                return option.value === this.selectedProductId
            });

            if (currentLabel) {
                this.selectedProductLabel = currentLabel.label;
            }
        } catch (error) {
            console.error(error);
        }
    }
 
    handleEpicChange(event) {
        try {
            this.selectedEpicId = event.detail.value;
            this.isSelectedEpic = true;
            const currentLabel = this.epicDetails.find(option => {
                return option.value === this.selectedEpicId
            });

            if (currentLabel) {
                this.selectedEpicLabel = currentLabel.label;
            }
        } catch (error) {
            console.error(error);
        }
    }

    createNewRecord(objectName){
        try {
            const objectApiName = objectName;
            const createRecordPageReference = {
                type: 'standard__objectPage',
                attributes: {
                    objectApiName: objectApiName,
                    actionName: 'new'
                }
            };
            this[NavigationMixin.Navigate](createRecordPageReference);
        } catch (error) {
            console.error(error);
        }
    }

    handleCreateEngagement() {        
        try {
            this.createNewRecord('Engagement__c');
        } catch (error) {
            console.error(error);
        }
    }

    handleCreatePortfolio() {
        try {
            this.createNewRecord('Portfolio__c');
        } catch (error) {
            console.error(error);
        }
    }

    handleCreateProduct() {
        try {
            this.createNewRecord('Product__c');
        } catch (error) {
            console.error(error);
        }
    }
    
    handleCreateEpic() {
        try {
            this.createNewRecord('Epic__c');
        } catch (error) {
            console.error(error);
        }
    }

}