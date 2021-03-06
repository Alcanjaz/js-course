
//BUDGET CONTROLLER
const budgetController = (function() {
    const Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0 && this.value <= totalIncome && data.totals.exp <= totalIncome) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

    const Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    const calculateTotal = (type) => {
        let sum = 0;
        data.allItems[type].forEach(curr => sum += Number(curr.value));
        data.totals[type] = sum;
    };

    const data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp:0,
            inc:0
        },
        budget:0,
        percentage: -1
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

        deleteItem(type, id){

            const ids = data.allItems[type].map(current => current.id);
            const index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        }, 

        calculateBudget(){

            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget: income  - expenses
            data.budget = data.totals.inc - data.totals.exp;


            //calculate the percentage of income that we spent

            if (data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else{ 
                data.percentage = -1;
            }
        },

        calculatePercentages(){
            data.allItems.exp.forEach(current => current.calcPercentage(data.totals.inc));
        },

        getPercentages(){
            const allPercentages = data.allItems.exp.map(current => current.getPercentage());
            return allPercentages;
        },

        getBudget(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
    
        testing(){
            console.log(data);
        }
    }
})();

//UI CONTROLLER
const UIController = (() => {
    const DOMstrings = {
        inputType: '.add__type',
        inputDescription:'.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentage: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    const formatNumber = (num, type) =>{

        num = Math.abs(num);
        num = num.toFixed(2);

        const numSplit = num.split('.');
        const dec = numSplit[1];
        const int = numSplit[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return `${type === 'exp' ? '-' : '+'} ${int}.${dec}`;

    }

    const nodeListForEach = (list, callback) => {
        for(let i = 0; i< list.length; i++){
            callback(list[i], i);
        }
    }


    
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
                html = `<div class="item clearfix" id="inc-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                <div class="item__value">${formatNumber(obj.value, type)}</div>
                <div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
                </div>
                </div>`;
                
            } else if (type==='exp'){
                element = DOMstrings.expenseContainer;
                html = `
                <div class="item clearfix" id="exp-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="right clearfix">
                            <div class="item__value">${formatNumber(obj.value, type)}</div>
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
        deleteListItem(selectorID){
            const el = document.getElementById(selectorID)
            el.parentNode.removeChild(el);
        },
        
        clearFields(){
            const fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            fields.forEach(field => {
                field.value="";
            });
            
        },
        
        displayBudget(obj){
            const type = obj.budget > 0 ? 'inc' : 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = `${formatNumber(obj.budget, type)}`; 
            document.querySelector(DOMstrings.incomeLabel).textContent = `${formatNumber(obj.totalInc, 'inc')}`; 
            document.querySelector(DOMstrings.expenseLabel).textContent = `${formatNumber(obj.totalExp, 'exp')}`; 
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage > 0 && obj.budget > 0 ? `${obj.percentage}%`: '---'; 
        },
       
        displayPercentages(percentages){

            const fields = document.querySelectorAll(DOMstrings.expensesPercentage);

            nodeListForEach(fields, (current, index) => {
                current.textContent = percentages[index] > 0 ? `${percentages[index]}%` : '---'; 
            });

        },  

        displayMount(){
            const now = new Date();

            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const month = months[now.getMonth()];
            
            const year = now.getFullYear();

            document.querySelector(DOMstrings.dateLabel).textContent = `${month}, ${year}`;

        },

        changedType(){

            const fields = document.querySelectorAll(`
                ${DOMstrings.inputType},
                ${DOMstrings.inputDescription},
                ${DOMstrings.inputValue}`);

            nodeListForEach(fields, cur => {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

        },

        getDOMstrings() {
            return DOMstrings;
        }
    };

})();

//GLOBAL APP CONTROLLER
const controller = ((budgetCtrl, UICtrl) => {

    const setupEventListeners = () => {
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', (e) => {
        if (e.keyCode === 13 || e.which === 13){
            ctrlAddItem();
        }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

    }

    const DOM = UICtrl.getDOMstrings();

    const updateBudget = () => {
        //1. Calculate the budget
        budgetCtrl.calculateBudget();

        //2. Return the budget
        const budget = budgetCtrl.getBudget();

        //3. Display the budget on the UI
        UICtrl.displayBudget(budget);

    };

    const updatePercentages = () => {

        //1. Calculate percentages
        budgetCtrl.calculatePercentages();

        //2.Read percentages from budget controller
        const percentages = budgetCtrl.getPercentages();

        //3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);

    };

    const ctrlAddItem = () => {
        
        //1.Get the field input data
        const input = UICtrl.getInput();
        
        //2.Add the item to the budget controller 
        if (input.description!=='' && input.value!=='' && input.value > 0) { // check we have correct values
            const newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3.Add the item to the UI
            if(newItem){
                UICtrl.addListItem(newItem, input.type);
            }
    
            //4. Clear the fields
            UICtrl.clearFields();
    
            //5.Calculate and update the budget
            updateBudget();

            //6.Calculate and update percentages
            updatePercentages();
        }

    };

    const ctrlDeleteItem = (e) => {
        const itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
        let splitID;
        let type;
        let ID;

        if(itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
        }

        //1. delete the item form the data structure
        budgetCtrl.deleteItem(type, ID);
        

        //2. delete the item from the UI
        UICtrl.deleteListItem(itemID);

        //3.Update and show the new budget
        updateBudget();
        updatePercentages();
        
    }

    return{
        init() {
            console.log('Application has started.');
            UICtrl.displayMount();
            UICtrl.displayBudget({
                budget:0,
                totalInc:0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }
    
})(budgetController, UIController);

controller.init();