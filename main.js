
const eventBus = new Vue();

Vue.component('primary-button', {
    props: {    
        text: {
            required: true,
            type: String
        },
        buttonClick: {
            required: true,
            type: Function
        }
    },
    template: `<button @click.prevent.stop="buttonClick">{{ text }}</button>`
});

Vue.component('create-todo', {
    props: [],
    data(){
        return {
            assignment: null,
            dueDate: null,
            errors: []
        };
    },
    template: `
    <div>
        <ul>
            <li v-for="error in errors">
                {{ error }}
            </li>
        </ul>
        <form>
            <input type="text"
                   v-model="assignment">
            <input type="date"
                   v-model="dueDate">
            <primary-button text="Add todo" :button-click="addTodo"></primary-button>
        </form>
    </div>`,    
    methods: {
        addTodo(){
            let todo = {};

            if(!this.assignment || !this.dueDate){
                this.errors = [];

                if(!this.assignment){
                    this.errors.push('What\'s the assigment?');
                }

                if(!this.dueDate){
                    this.errors.push('Please submit a due date');
                }
                return;
            }

            this.errors = [];
            todo.assignment = this.assignment;
            todo.dueDate = this.dueDate;
            todo.finished = false;
            todo.removed = false;
            eventBus.$emit('add-todo', todo)

            this.dueDate = null;
            this.assignment = null;
        }
    }
});

Vue.component('todo-list', {
    props: {
        todos: {
            required: true,
            default: [],
            type: Array
        }
    },
    template: `
        <div>
            <sorting-menu :items=todos></sorting-menu>
            <ul class="regular-list">
                <li v-for="(todo, index) in todos" :key="index">
                    <todo-list-item :todo=todo></todo-list-item>
                </li>            
            </ul>
        </div>
    `
});

Vue.component('sorting-menu', {
    props: {
        items: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>
            <primary-button text="Ascending Due Date" :button-click="sortByAscendingDueDate"></primary-button>
            <primary-button text="Descending Due Date" :button-click="sortByDescendingDueDate"></primary-button>
        </div>
    `,
    methods: {
        sortByAscendingDueDate(){
            this.items.sort(function(a, b){ 
                if(a.dueDate < b.dueDate){
                    return -1;
                } else if(b.dueDate < a.dueDate){
                    return 1;
                }
                return 0;
            });
        },
        sortByDescendingDueDate(){
            this.items.sort(function(a, b){
                if(a.dueDate > b.dueDate){
                    return -1;
                } else if(b.dueDate > a.dueDate){
                    return 1;
                }
                return 0;
            });
        }
    }
});

Vue.component('todo-list-item', {
    props: {
        todo: {
            required: true,
            type: Object
        }
    },
    template: `<span v-bind:class="{ finished: todo.finished, removed: todo.removed }"> <input type="checkbox"
    v-model="todo.finished"> {{ todo.assignment }} is due {{ todo.dueDate}} 
    <primary-button text="Remove" 
                    :button-click="removeTodo"></primary-button></span>`,
    methods: {
        removeTodo(){
            this.todo.removed = true;
        }
    }
});

const app = new Vue({
    el: '#app',
    data: {
        todos: [],
        errors: []     
    },
    mounted(){
        eventBus.$on('add-todo', todo => {             
            this.todos.push(todo);
        });
    }
});