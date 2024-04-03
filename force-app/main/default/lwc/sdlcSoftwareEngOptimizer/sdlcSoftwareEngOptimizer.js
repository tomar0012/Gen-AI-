import { LightningElement, track } from 'lwc';
import getSavedUserStories from '@salesforce/apex/SDLC_AnalysisController.getSavedUserStories';

export default class SdlcSoftwareEngOptimizer extends LightningElement {
    tabLabel;
    avatarValue;
    avatarIcon;
    isChangeAvatar;
    previousContext;
    epicID='';
    isRenderd;
    showAvatarPopup = false;
    activeTab;
    @track savedUserStories;
    
    setCurrentTab(event){
        this.template.querySelector('lightning-tabset').activeTabValue = 'Start';
    }

    handleAvatar(event){
        this.avatarIcon = event.detail.icon;
        this.avatarValue = event.detail.value;
        this.isChangeAvatar = event.detail.isAvatarChange;
    }


    handleRender(){
        this.isRenderd = true;
    }

    //Reset data to default when the user switches or toggles between tabs.
    handleActive(event){
        this.tabLabel = event.target.label;
        this.activeTab = '';
        console.log('LABEL '+this.tabLabel);
        this.refreshTabData(this.tabLabel); 
        if(!this.isChangeAvatar && this.tabLabel != "Start"){
            console.log('Gokul Not saved avatar')
            //this.showAvatarPopup = true;
        } 
    }

    handleAvatarOk(event){
        this.showAvatarPopup = false;
        let component = this.template.querySelector('c-sdlc-start-phase');
        component.refreshAvatar();
    }

    handleAvatarCancel(event){
        this.showAvatarPopup = false;
        this.activeTab = "Start";
    }

    refreshTabData(tabLabel){
        let component;
        switch(tabLabel){
            case 'Start':
                component = this.template.querySelector('c-sdlc-start-phase');
                break;
            case 'Analysis':
                component = this.template.querySelector('c-sdlc-analysis-phase');
                break;
            case 'Design':
                component = this.template.querySelector('c-sdlc-design-phase');
                break;
            case 'Build':
                component = this.template.querySelector('c-sdlc-build-phase');
                break;
            case 'Test':
                component = this.template.querySelector('c-sdlc-test-phase');
                break;
            case 'Deploy':
                component = this.template.querySelector('c-sdlc-deploy-phase');
                break;
            case 'Code Optimization':
                component = this.template.querySelector('c-sdlc-code-optimization-phase');
                break;
            case 'Business Process Extraction':
                component = this.template.querySelector('c-sdlc-business-process-extraction-phase');
                break;
        }
        setTimeout(()=>{
            if(tabLabel == 'Start'){
                component.isRefreshTable = false;
            }
            component.refreshData();
        },0);
    }

    handleRenderChanges(){
        if(this.isRenderd){
        this.retrieveSavedUserStories();
        }
    }

    renderedCallback(){
        this.handleRenderChanges();
    }

    //get all saved user stories from db based on epic selected by user
    retrieveSavedUserStories(){
        getSavedUserStories({epicId: this.epicID})
        .then(result => {
            let tempRecs = [];
            result.forEach( ( record ) => {
                let tempRec = Object.assign( {}, record );  
                tempRec.userStoryId = '/' + tempRec.id;
                tempRecs.push( tempRec );
            });
            this.savedUserStories = tempRecs;
            this.isRenderd = false;
            console.log('this.savedUserStories==>'+JSON.stringify(this.savedUserStories));
        })
        .catch(error => {
            console.log('error',error);
        });
    }

    refreshUserStory(){
        this.retrieveSavedUserStories();
    }

    @track projectContext={engagement:'Infosys',portfolio:'Employee Experience',product:'Travel', epic:'Online Booking'};
    
    handleSave(event){
        const fetchData = event.detail;
        this.projectContext=Object.assign({},fetchData);
        console.log('Evt rcv'+JSON.stringify(this.projectContext));

        if (this.projectContext.hasOwnProperty('epicId')) {
            this.epicID = this.projectContext.epicId;
            console.log('this.epicID:', this.epicID);
          } else {
            console.log('epicID not found in projectContext');
          }
    }
}