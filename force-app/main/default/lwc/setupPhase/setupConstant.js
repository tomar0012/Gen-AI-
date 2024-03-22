import BA_PIC from '@salesforce/resourceUrl/BAPic';
import ARCH_PIC from '@salesforce/resourceUrl/Architect';
import DEV_PIC from '@salesforce/resourceUrl/Dev';
import SU_PIC from '@salesforce/resourceUrl/SuperUser';

const  avatarOptions = () => {
    return[
        {label:"Business Analyst",value:"Business Analyst",icon:BA_PIC,class:"slds-m-left_medium",checked:true},
        {label:"Architect",value:"Architect",icon:ARCH_PIC,class:"avatar-margin",checked:false},
        {label:"Developer",value:"Developer",icon:DEV_PIC,class:"avatar-margin",checked:false},
        {label:"Admin",value:"Admin",icon:SU_PIC,class:"avatar-margin",checked:false}
    ];
};

const DEFAULT_ENGAGEMENT ='a0JKR000000KzNI2A0';
const DEFAULT_PORTFOLIO='a0KKR000000NeHo2AK';
const DEFAULT_PRODUCT='a0NKR000000GmmK2AS';
const DEFAULT_EPIC='a0PKR000000Xey52AC';

const DEFAULT_LICENSE = ['0PL1I0000008U5mWAE'];

export{avatarOptions,DEFAULT_ENGAGEMENT,DEFAULT_PORTFOLIO,DEFAULT_PRODUCT,DEFAULT_EPIC,DEFAULT_LICENSE };