import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class SldcBanner extends NavigationMixin(LightningElement) {
    //@api displayText = '<b>Current Context:</b> Infosys/ Employee Experience/ Travel, <a href="#" onclick={navigateToComponent}>Change context</a>';
    isCollapsed = false;
    contentClass = 'slds-show';
    @api defaultRecord;
    @api defaultRecords;
    @api defaultRecordss;
    @api projectContext;
    @api avatarValue;
    @api avatarIcon;

    text ='<a href="#" onclick={navigateToComponent}>Change context</a>'
    
    
    navigateToComponent() {
        // this[NavigationMixin.Navigate]({
        //     type: 'standard__component',
        //     attribute: {
        //         componentName: 'c.setupPhase',
        //     },
        // });
        const event = new CustomEvent('contextchange', {
            bubbles: true,
        });
            this.dispatchEvent(event);
    }
    // text = '\'+{defaultRecord}+'>'+{defaultRecords}+'>'+{defaultRecordss}+'>'+\'<a href=\"#\" onclick={navigateToComponent}>Change context</a>';

    //{defaultRecord},{defaultRecords}, {defaultRecordss}
    // get chevronDirection() {
    //     return this.isCollapsed ? 'utility:chevronright' : 'utility:chevrondown';
    // }

    // toggleCollapse() {
    //     this.isCollapsed = !this.isCollapsed;
    //     this.contentClass = this.isCollapsed ? 'slds-hide' : 'slds-show';
    // }
}