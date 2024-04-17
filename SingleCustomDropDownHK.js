import { LightningElement, track, api } from 'lwc';
 
export default class SingleCustomDropDownHK extends LightningElement {
    
    //@api options;
    @api selectedValue;
    @api test;
    @api selectedValues = [];
    //@api label;
    @api minChar = 2;
    @api disabled = false;
    @api multiSelect = false;
    @api value;
    @track values = [];
    @track optionData = [];
    @api searchstring = 'Select Options';
    @api searchString = 'Select Options';
    @track message;
    @track showDropdown = false;
    previousLabel;
    filter;
    option;
    @track boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    @track blurTimeout;
    

    @api label;
    _disabled = false;
    value;
    minChar = 3;
   
    
    previousLabel;
    @track firstItem = true;
    
    @track grpNameVal;
    grpNamOptions = [];

    @api
    get disabledD() {
        return this._disabled;
    }
    set disabledD(value) {
        this._disabled = value;
        this.handleDisabled();
    }
    @track inputOptions;
    @track loadInitial = true;

    @api
    get options() {
        if (this.loadInitial) {
            this.value = (this.optionData).filter(option => option.selected == true);
            console.log("list has preselected values", this.value);
            this.loadInitial = false;
        }

        return this.optionData.filter(option => option.value !== '--None--');

    }
    set options(value) {

        let options = [{
            value: '--None--',
            label: '--None--',
            isVisible: true
        }];
        //this.optionData = value;
        this.optionData = options.concat(value);
    //     console.log("list his.optionData", this.optionData);
    //     var preSelectedVal = (this.optionData || []).filter(option => option.selected == true);
    //     console.log("preSelectedVal", preSelectedVal);
    //     // if (preSelectedVal.length == 1) {
    //         this.searchString = preSelectedVal.label;
    //         console.log("this.searchString>>>", this.searchString);
    //     // } else if (preSelectedVal.length == 2) {
    //     //     this.searchString = preSelectedVal[0].label + ' , ' + preSelectedVal[1].label;
    //     // } else if (preSelectedVal.length > 2) {
    //     //     this.searchString = preSelectedVal[0].label + ' , ' + preSelectedVal[1].label + ' ...';
    // //   }
    //      this.searchString = preSelectedVal;
    //      this.optionData = value;
    }
    @api
    clear() {
        this.handleAllOption();
    }

    hasRendered;

    renderedCallback() {
        if (!this.hasRendered) {
            //  we coll the logic once, when page rendered first time
            this.handleDisabled();
        }
        this.hasRendered = true;
    }
    handleDisabled() {
        let input = this.template.querySelector("input");
        if (input) {
            input.disabledD = this.disabledD;
        }
    }
    comboboxIsRendered;



    // function shareVis() {
    //     //document.getElementById("mySharedown").className = "sharedown-content show";
    //     document.getElementById("mySharedown").classList.add("show");
    // }
    
    // window.onclick = function(event) {
    //     if (!event.target.matches('.sharebtn')) {
    
    //         var sharedowns = document.getElementsByClassName("sharedown-content");
    //         var i;
    //         for (i = 0; i < sharedowns.length; i++) {
    //             var openSharedown = sharedowns[i];
    //             if (openSharedown.classList.contains('show')) {
    //                 openSharedown.classList.remove('show');
    //             }
    //         }
    //     }
    // }
    
    // document.getElementById("mySharedown").addEventListener('click',function(event){
    //     event.stopPropagation();
    // });


 
    connectedCallback() {
        console.log('singleSearch connectedCallback Start');
        this.showDropdown = false;
        var optionData = this.options ? (JSON.parse(JSON.stringify(this.options))) : null;
        var value = this.selectedValue ? (JSON.parse(JSON.stringify(this.selectedValue))) : null;
        var values = this.selectedValues ? (JSON.parse(JSON.stringify(this.selectedValues))) : null;
        console.log('singleSearch connectedCallback Start 11111',optionData);
        console.log('singleSearch connectedCallback Start 22222',value);
        console.log('singleSearch connectedCallback Start 33333',values);
 if(value || values) {
            var searchString;
         var count = 0;
            for(var i = 0; i < optionData.length; i++) {
                if(this.multiSelect) {
                    if(values.includes(optionData[i].value)) {
                        optionData[i].selected = true;
                        count++;
                    }  
                } else {
                    if(optionData[i].value == value) {
                        searchString = optionData[i].label;
                    }
                }
            }
            if(this.multiSelect)
                this.searchString = count + ' Option(s) Selected';
            else
                this.searchString = searchString;
        }
        this.value = value;
        this.values = values;
        this.optionData = optionData;
        console.log('singleSearch connectedCallback End');
    }
 
    filterOptions(event) {
        console.log('Inside fiter options');
        this.searchString = event.target.value;
        
        if( this.searchString && this.searchString.length > 0 ) {
            this.message = '';
            if(this.searchString.length >= this.minChar) {
                var flag = true;
                console.log('Inside fiter options for ', JSON.parse(JSON.stringify(this.optionData)));
                for(var i = 0; i < this.optionData.length; i++) {
                    console.log('Inside fiter options for ==', this.optionData.length);
                    if(this.optionData[i].label.toLowerCase().trim().includes(this.searchString.toLowerCase().trim())) {
                        this.optionData[i].isVisible = true;
                        flag = false;
                    } else {
                        this.optionData[i].isVisible = false;
                    }
                }
                if(flag) {
                    this.message = "No results found for '" + this.searchString + "'";
                }
                else {
                    console.log('Inside filter else', this.optionData);
                    //this.inputOptions=JSON.stringify(this.inputOptions);
                }
            }
            this.showDropdown = true;
        }  
 }
 
    selectItem(event) {
        console.log('inside handleSelect --selectItem', event.currentTarget.dataset.value);
        console.log('inside handleSelect firstChild', event.currentTarget.firstChild);
        var selectedVal = event.currentTarget.dataset.id;
        if(selectedVal) {
            var count = 0;
            var options = JSON.parse(JSON.stringify(this.optionData));
            for(var i = 0; i < options.length; i++) {
                if(options[i].value === selectedVal) {
                    if(this.multiSelect) {
                        if(this.values.includes(options[i].value)) {
                            this.values.splice(this.values.indexOf(options[i].value), 1);
                        } else {
                            this.values.push(options[i].value);
                        }
                        options[i].selected = options[i].selected ? false : true;   
                    } else {
                        this.value = options[i].value;
                        console.log("this.value>>>>>>>>>>>>> : ", this.value);
                        this.searchString = options[i].label;
                        console.log("this.searchString>>>>>>>>>>>>> : ",  this.searchString);
                        
                        const selectEvent = new CustomEvent('mycustomevent', {
                            detail: this.searchString
                           });
                          this.dispatchEvent(selectEvent);
                        
                          const selectgroupEvent = new CustomEvent('groupcustomevent', {
                            detail: this.searchString
                           });
                          this.dispatchEvent(selectgroupEvent);

                          const selectWssEvent = new CustomEvent('wsscustomevent', {
                            detail: this.searchString
                           });
                          this.dispatchEvent(selectWssEvent);

                          const selectBatchEvent = new CustomEvent('valuechange', {
                            detail: this.searchString
                           });
                          this.dispatchEvent(selectBatchEvent);
                    }
                }
                if(options[i].selected) {
                    count++;
                }
            }
            this.optionData = options;
            if(this.multiSelect)
                this.searchString = count + ' Option(s) Selected';
                if(this.multiSelect)
                event.preventDefault();
            else
                this.showDropdown = false;
             
        }
    }
 
    showOptions(event) {
        console.log('inside showOptions --');
        this.previousLabel = this.searchString;

        if(this.disabled == false && this.options) {
            this.message = '';
            this.searchString = '';
            var options = JSON.parse(JSON.stringify(this.optionData));
            for(var i = 0; i < options.length; i++) {
                options[i].isVisible = true;
            }
            if(options.length > 0) {
                this.showDropdown = true;
            }
            this.optionData = options;
            //SC start
            this.searchString = '';
            this.inputBox = 'slds-has-focus';
            this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus slds-is-open';
            //SC stop
            
        }
        // event.stopPropagation();
 }

 hideListBox(){
    if(this.showDropdown)
        this.showDropdown = false;
    
}



 handleSelection(event) {
    console.log('inside handleSelect --', event.currentTarget.dataset.value);
    console.log('inside handleSelect firstChild', event.currentTarget.firstChild);
    let value = event.currentTarget.dataset.value;
    if (value === '--None--') {
        this.handleAllOption();
    }
    else {
        this.handleOption(event, value, event.currentTarget.firstChild);
    }
    let input = this.template.querySelector("input");
    input.focus();
    //SC start
    if(this.blurTimeout) {

        clearTimeout(this.blurTimeout);
    }
    this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    //SC stop
   // this.sendValues();
}
// sendValues() {
//     let values = [];
//     for (const valueObject of this.value) {
//         values.push(valueObject.value);
//     }
//     this.dispatchEvent(new CustomEvent("valuechange", {
//         detail: values
//     }));
// }
handleAllOption() {
    this.value = [];
    this.searchString = '--None--';
    let listBoxOptions = this.template.querySelectorAll('.slds-is-selected');
    for (let option of listBoxOptions) {
        option.classList.remove("slds-is-selected");
    }
    let allOption = this.template.querySelector('[data-id="--None--"]');
    allOption.firstChild.classList.add("slds-is-selected");
    this.closeDropbox();
}
handleOption(event, value, listbox) {
    // let listBoxOption = event.currentTarget.firstChild;
    let listBoxOption = listbox;
    console.log('listBoxOption>>>>>>>>>>', JSON.stringify(listBoxOption));
    if (listBoxOption.classList.contains("slds-is-selected")) {
        console.log('inside 1');
        this.value = this.value.filter(option => option.value !== value);
    }
    else {
        console.log('inside 2**');
        // let allOption = this.template.querySelector('[data-id="--None--"]');
        // allOption.firstChild.classList.remove("slds-is-selected");
        console.log('this.options ->', this.options);
        let option = this.options.find(option => option.value === value);
        this.value = option;
        
    }
    if (this.value.length > 1) {
        console.log('inside 3');
        if (this.value.length == 2) {
            this.previousLabel = this.value.label;
        } else {
            this.previousLabel = this.value.label;
        }

    }
    else if (this.value.length === 1) {
        console.log('inside 4');
        this.previousLabel = this.value.label;
    }
    else {
        // this.inputValue = '--None--';
        this.previousLabel = this.value.label;
    }
    
    //listBoxOption.classList.toggle("slds-is-selected");
   this.previousLabel = this.value.label;
   this.searchString = this.value.label;
   //this.skuValue = this.value.label;
   console.log("this.value>: ", this.value.label);
   console.log('Inside skuname>>>>>');

   const selectEvent = new CustomEvent('mycustomevent', {
    detail: this.searchString
   });
  this.dispatchEvent(selectEvent);

  const selectgroupEvent = new CustomEvent('groupcustomevent', {
    detail: this.searchString
   });
  this.dispatchEvent(selectgroupEvent);




//    if (this.value.label) {
//     console.log('Inside skuname');
//     this.skuValue = this.inputValue;
//     console.log('event.target.value skuValue***********>>', this.skuValue);


//     getGroupName({ skuNm: this.skuValue })
//     .then(result => {
//         console.log('getGroupName result>>>>>>>>', result);
//         this.accList = result;
//         console.log(' getGroupName accList---++++>>', this.accList);

//         let accOptions = [];
//         for (let i = 0; i < this.accList.length; i++) {
//             accOptions.push({
//                 label: this.accList[i].Group_Name__c ,
//                 value: this.accList[i].Group_Name__c
//             })
//         }


//         console.log('accOptions>>', accOptions);
//         this.grpNamOptions = accOptions;
//         console.log('getGroupName grpNamOption++++++++>>>', this.grpNamOptions);
//         this.grpNameVal = this.grpNamOptions[0].value;
//         console.log('getGroupName grpNameVal->>>>>>>+++++', this.grpNameVal);
//         //this.defaultValue = accOptions[0].value;
//         //console.log('defaultValue',this.defaultValue);
//     })
//     .catch((error) => {
//         this.grpNamOptions = null;
//         this.grpNameVal = null;
//         //console.log('In connected call back error....');
//         this.error = error;
//         console.log('Error is', this.error);
//     });    



// }
this.previousLabel = this.value.label;
this.searchString = this.value.label;
//this.skuValue = this.value.label;
console.log("this.value>>>>>>>>>>>>> : ", this.searchString);



  
}



 
    removePill(event) {
        var value = event.currentTarget.name;
        var count = 0;
        var options = JSON.parse(JSON.stringify(this.optionData));
        for(var i = 0; i < options.length; i++) {
            if(options[i].value === value) {
                options[i].selected = false;
                this.values.splice(this.values.indexOf(options[i].value), 1);
            }
            if(options[i].selected) {
                count++;
            }
        }
        this.optionData = options;
        if(this.multiSelect)
            this.searchString = count + ' Option(s) Selected';
    }
 
    blurEvent(event) {
       /* var previousLabel;
        var count = 0;
        this.blurTimeout = setTimeout(() =>  {this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus'}, 300);
        for(var i = 0; i < this.optionData.length; i++) {
            if(this.optionData[i].value === this.value) {
                previousLabel = this.optionData[i].label;
                console.log('inside window.onclick main previousLabel',previousLabel);
                console.log('inside window.onclick main this.optionData[i].label',this.optionData[i].label);
            }
            
            if(this.optionData[i].selected) {
                count++;
                console.log('inside window.onclick main this.optionData[i]..',this.optionData[i].selected);
            }
             
        }
        if(this.multiSelect)
         this.searchString = count + ' Option(s) Selected';
        else
         this.searchString = previousLabel;
        
        //  this.showDropdown = false;
         
         
 
        this.dispatchEvent(new CustomEvent('select', {
            detail: {
                'payloadType' : 'multi-select',
                'payload' : {
                    'value' : this.value,
                    'values' : this.values
                }
            }
        }));*/
    }
    
    
}
