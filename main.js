
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
            dueDate: null
        };
    },
    template: `
        <form>
            <input type="text"
                   v-model="assignment">
            <input type="date"
                   v-model="dueDate">
            <primary-button text="Add todo" :button-click="buttonClick"></primary-button>
        </form>`,
    methods: {
        buttonClick(){
            let todo = {};

            todo.assignment = this.assignment;
            todo.dueDate = this.dueDate;
            todo.finished = false;
            todo.removed = false;
            // TODO validation
            eventBus.$emit('add-todo', todo)
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
        <ul>
            <li v-for="(todo, index) in todos" :key="index">
                <todo-list-item :todo=todo></todo-list-item>
            </li>            
        </ul>
    `
});

Vue.component('todo-list-item', {
    props: {
        todo: {
            required: true,
            type: Object
        }
    },
    template: `<span v-bind:class="{finished: todo.finished, removed: todo.removed}">{{ todo.assignment }} is due {{ todo.dueDate}} 
    <primary-button text="Done and Done" 
                    :button-click="finishTodo"></primary-button>
    <primary-button text="I don't wanna" 
                    :button-click="removeTodo"></primary-button></span>`,
    methods: {
        finishTodo(){
            this.todo.finished = true;
        },
        removeTodo(){
            this.todo.removed = true;
        }
    }
});

const app = new Vue({
    el: '#app',
    data: {
        todos: []        
    },
    mounted(){
        eventBus.$on('add-todo', todo => { this.todos.push(todo) });
    }
});