
//BUDGET CONTROLLER
var budgetController = (function() {
    let Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp:0,
            inc:0
        }
    };

    return {
        addItem(type, des, val){
            let newItem, ID;

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //Create new item based on 'inc' or 'exp' type
            if(type==='exp'){
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            //Push it into our data structure
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;

        },
        testing(){
            console.log(data);
        }
    }
})();

//UI CONTROLLER
var UIController = (() => {
    let DOMstrings = {
        inputType: '.add__type',
        inputDescription:'.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
    };

    
    return {
        getInput() {
            return{
                type: document.querySelector(DOMstrings.inputType).value,//will be either inc o exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },
        
        addListItem(obj, type){
            let html;
            let element;
            //Create HTML string with placeholder text
            
            if (type ==='inc'){
                element = DOMstrings.incomeContainer;
                html = `<div class="item clearfix" id="income-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                <div class="item__value">${obj.value}</div>
                <div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
                </div>
                </div>`;
                
            } else if (type==='exp'){
                element = DOMstrings.expenseContainer;
                html = `
                <div class="item clearfix" id="expense-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="right clearfix">
                            <div class="item__value">${obj.value}</div>
                                <div class="item__percentage">21%</div>
                                <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`;
                    }
                    
            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
            
        },
        
        clearFields(){
            const fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            fields.forEach(field => {
                field.value="";
            });
            
        },

        getDOMstrings() {
            return DOMstrings;
        }
    };

})();

//GLOBAL APP CONTROLLER
var controller = ((budgetCtrl, UICtrl) => {

    const setupEventListeners = () => {
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(e) {
        if (event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
    });

    }

    const DOM = UICtrl.getDOMstrings();

    const updateBudget = () => {
        //1. Calculate the budget

        //2. Return the budget

        //3. Display the budget on the UI

    }

    const ctrlAddItem = () => {
        let input, newItem;

        //1.Get the field input data
        input = UICtrl.getInput();
        
        //2.Add the item to the budget controller
        if (input.description!=='' && input.value!=='' && input.value > 0) { // check we have values
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        }

        //3.Add the item to the UI
        if(newItem){
            UICtrl.addListItem(newItem, input.type);
        }

        //4. Clear the fields
        UICtrl.clearFields();

        //5.Calculate and update the budget
        updateBudget();

        //6.Display the budget to the UI

         
        console.log('it works');
    };

    return{
        init() {
            console.log('Application has started.');
            setupEventListeners();
        }
    }
    
})(budgetController, UIController);

controller.init();