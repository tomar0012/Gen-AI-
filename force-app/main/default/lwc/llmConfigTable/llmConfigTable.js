import { LightningElement,track } from 'lwc';

export default class LlmConfigTable extends LightningElement {

    llmPopulaityMap={
        'GPT3.5 Turbo':'90%',
        'GPT4':'70%',
        'CodeGen':'60%',
        'Whisper':'65%'
    };

    llmFeedbackMap={
        'GPT3.5 Turbo':4,
        'GPT3.5':3,
        'GPT4':3,
        'CodeGen':3,
        'Whisper':3
    };

    get llmOptions(){
        return [
            { label: 'GPT3.5 Turbo', value: 'GPT3.5 Turbo' },
            { label: 'GPT4', value: 'GPT4' },
            { label: 'CodeGen', value: 'CodeGen' },
            { label: 'Whisper', value: 'Whisper' },
        ];
    }

    @track
    llmConfigDataList=[
        {phase:'Analysis',category:'Generate User Stories',subCategory:'Text',llmoptions:[ { label: 'GPT3.5 Turbo', value: 'GPT3.5 Turbo' }, { label: 'GPT4', value: 'GPT4' }], llm:'GPT3.5 Turbo',popularity:'90%',rating:4},
        {phase:'Analysis',category:'Generate User Stories',subCategory:'Audio',llmoptions:[ { label: 'Whisper', value: 'Whisper' }],llm:'Whisper',popularity:'65%',rating:3},
        {phase:'Analysis',category:'Generate User Stories',subCategory:'Video',llmoptions:[ { label: 'Whisper', value: 'Whisper' }],llm:'Whisper',popularity:'65%',rating:4},
        {phase:'Analysis',category:'Validate User Stories',subCategory:'Text',llmoptions:[ { label: 'GPT3.5 Turbo', value: 'GPT3.5 Turbo' }, { label: 'GPT4', value: 'GPT4' }],llm:'GPT3.5 Turbo',popularity:'90%',rating:4},

        {phase:'Design',category:'Create Component Spec',subCategory:'',llm:'GPT3.5 Turbo',llmoptions:[ { label: 'GPT3.5 Turbo', value: 'GPT3.5 Turbo' }, { label: 'GPT4', value: 'GPT4' }],popularity:'90%',rating:3},
        {phase:'Build',category:'Configuration Workbook',subCategory:'',llmoptions:[ { label: 'GPT3.5 Turbo', value: 'GPT3.5 Turbo' }, { label: 'GPT4', value: 'GPT4' }],llm:'GPT3.5 Turbo',popularity:'90%',rating:5},
        {phase:'Build',category:'Customization',subCategory:'',llmoptions:[  { label: 'GPT3.5 Turbo', value: 'GPT3.5 Turbo' },{ label: 'CodeGen', value: 'CodeGen' }],llm:'GPT3.5 Turbo',popularity:'90%',rating:4},

        {phase:'Test',category:'Test Class Creation',subCategory:'',llmoptions:[ { label: 'GPT3.5 Turbo', value: 'GPT3.5 Turbo' },{ label: 'CodeGen', value: 'CodeGen' }],llm:'GPT3.5 Turbo',popularity:'90%',rating:4},
        {phase:'Test',category:'Test Plan Creation',subCategory:'',llmoptions:[  { label: 'GPT3.5 Turbo', value: 'GPT3.5 Turbo' }, { label: 'GPT4', value: 'GPT4' }],llm:'GPT3.5 Turbo',popularity:'90%',rating:4},
       
        {phase:'Deploy',category:'Generate Release Notes',subCategory:'',llmoptions:[ { label: 'GPT3.5 Turbo', value: 'GPT3.5 Turbo' }, { label: 'GPT4', value: 'GPT4' }],llm:'GPT3.5 Turbo',popularity:'90%',rating:4},
        {phase:'Deploy',category:'Generate Manifest File',subCategory:'',llmoptions:[ { label: 'GPT3.5 Turbo', value: 'GPT3.5 Turbo' }, { label: 'GPT4', value: 'GPT4' }],llm:'GPT3.5 Turbo',popularity:'90%',rating:4},

        {phase:'Business Process Extraction',category:'Create Func/Tech Description',subCategory:'',llmoptions:[ { label: 'GPT3.5 Turbo', value: 'GPT3.5 Turbo' }, { label: 'GPT4', value: 'GPT4' }],llm:'GPT3.5 Turbo',popularity:'90%',rating:4},
        {phase:'Code Optimization',category:'Code Quality Assessment',subCategory:'',llmoptions:[ { label: 'GPT3.5 Turbo', value: 'GPT3.5 Turbo' }, { label: 'GPT4', value: 'GPT4' }],llm:'GPT3.5 Turbo',popularity:'90%',rating:4},
    ];

    selectedLLM;

    onllmselection(event){
        console.log(event.target.value);
        const field = event.target.name;
        if (field === 'optionSelect') {
                this.selectedLLM = event.target.value;
                let llmConfigDataList=[...this.llmConfigDataList];
                llmConfigDataList[event.currentTarget.dataset.item].popularity=this.llmPopulaityMap[this.selectedLLM];
                console.log(this.llmPopulaityMap[this.selectedLLM]);
                this.llmConfigDataList=llmConfigDataList;
            } 
    }

    onllmselectionv(event){
        console.log(event.target.value);
        console.log(event.currentTarget.dataset.item);
        console.log(event.target.name);

                this.selectedLLM = event.target.value;
                let llmConfigDataList=[...this.llmConfigDataList];
                llmConfigDataList[event.target.name].popularity=this.llmPopulaityMap[this.selectedLLM];
                llmConfigDataList[event.target.name].rating=this.llmFeedbackMap[this.selectedLLM];
                console.log(this.llmPopulaityMap[this.selectedLLM]);
                this.llmConfigDataList=llmConfigDataList;
        
    }
    

}