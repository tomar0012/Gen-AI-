import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class SldcBanner extends NavigationMixin(LightningElement) {

    @api projectContext;
    @api avatarValue;
    @api avatarIcon;
    navigateToComponent() {
        const event = new CustomEvent('contextchange', {
            bubbles: true,
        });
            this.dispatchEvent(event);
    }

}