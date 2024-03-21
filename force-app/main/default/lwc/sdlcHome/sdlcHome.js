import { LightningElement } from 'lwc';
import IMAGES from '@salesforce/resourceUrl/softwareEngOpti';
import Start_Description from '@salesforce/label/c.Start_Description';
import Analysis_Description from '@salesforce/label/c.Analysis_Description';
import Design_Description from '@salesforce/label/c.Design_Description';
import Build_Description from '@salesforce/label/c.Build_Description';
import Test_Description from '@salesforce/label/c.Test_Description';
import Deploy_Description from '@salesforce/label/c.Deploy_Description';
import BPE_Description from '@salesforce/label/c.BPE_Description';
import Code_Optimization_Description from '@salesforce/label/c.Code_Optimization_Description';

export default class SdlcHome extends LightningElement {

    startCheck = IMAGES+'/SEO/setupTab.png';
    analysisCheck= IMAGES+'/SEO/analysisTab.png';
    designCheck= IMAGES+'/SEO/designTab.png';
    buildCheck= IMAGES+'/SEO/buildTab.png';
    testCheck= IMAGES+'/SEO/testTab.png';
    deployCheck= IMAGES+'/SEO/deployTab.png';
    bpeCheck= IMAGES+'/SEO/bpeTab.png';
    codeOptiCheck= IMAGES+'/SEO/codeOptiTab.png';

    StartDescription = Start_Description;
    AnalysisDescription = Analysis_Description;
    DesignDescription = Design_Description;
    BuildDescription = Build_Description
    TestDescription= Test_Description
    DeployDescription= Deploy_Description
    BPEDescription= BPE_Description
    CodeOptimizationDescription = Code_Optimization_Description
}