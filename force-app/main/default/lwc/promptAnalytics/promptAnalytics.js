import { LightningElement } from 'lwc';
import PROMPT_ONE from '@salesforce/resourceUrl/PromptOne';
import PROMPT_TWO from '@salesforce/resourceUrl/PromptTwo';
import PROMPT_THREE from '@salesforce/resourceUrl/PromptThree';

export default class PromptAnalytics extends LightningElement {

    promptOne = PROMPT_ONE;
    promptTwo = PROMPT_TWO;
    promptThree = PROMPT_THREE;
}