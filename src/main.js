import '../styles/global.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { tasks, tasksArchive } from './tasksDB';

const toDoListPage = `
    <div class='title-wrapper todo'>
        <h1 class='todo__text'>ToDoList</h1>
        <div class='todo__logo'><i class="bi bi-list-task"></i></div>
        <div class='link-to todo__history'><i class="bi bi-clock-history"></i></div>
    </div>
    <div class='create-task'>
        <input type='text' placeholder='write your task'/>
        <button> Create </button>
    </div>
    <div class='list todo-list'> </div>`; 


const historyListPage = `
    <div class='title-wrapper history'>
        <h1 class='history__text'>History</h1>
        <div class='link-to history__todo'><i class="bi bi-list-task"></i></div>
    </div>
    <div class='history-buttons'>
        <button class='completed-btn'>completed</button>
        <button class='uncompleted-btn'>uncompleted</button>
    </div>
    <div class='list history-list'> </div>`; 


const div = document.createElement('div')
    div.classList.add('container')
try {
    tasksArchive.push(...JSON.parse(localStorage.getItem('tasksArchive')))
} catch (err) {}


init()
function init(isRout = false) {
    if (!isRout) {
        try {
            tasks.push(...JSON.parse(localStorage.getItem('tasks')))
        } catch (err) {}    
    }
     
   
    div.innerHTML = toDoListPage;
    document.body.append(div)

    const [createTaskButton, taskText, toDoList, history] = [
        document.querySelector('.create-task button'),
        document.querySelector('.create-task input'),
        document.querySelector('.todo-list'),
        document.querySelector('.todo__history')
        
    ]
    
    tasks.forEach(e => {
        toDoList.innerHTML += e.value
    })

    const checkBoxArr = document.querySelectorAll('.task__checkbox')
    tasks.forEach(el => {
        if (el.state === 'completed') {
            checkBoxArr.forEach(e => {
                if (e.parentNode.querySelector('.task__text').innerText === el.key) e.checked = true  
            })
        }
    })
    addEventListeners()
    
    function createTask() {
        if (!taskText.value) return 
        if (tasks.find(e => e.key === taskText.value)) return 
        
        let taskString = [`
        <div class='task'>
            <input class='task__checkbox'type='checkbox' />
            <div class='task__text'> ${taskText.value} </div>
            <div class='task__delete'><i class="bi bi-x"></i></div>
        </div>`]

        let currentTask = {
            key: taskText.value,
            value: taskString,
            state: 'uncompleted'
        }
        tasks.unshift(currentTask)
        
        toDoList.innerHTML = ''
        addToDocument(tasks, toDoList)
        document.querySelectorAll('.task__text').forEach(e => {
            if (e.classList.contains('completed')) e.parentNode.querySelector('.task__checkbox').checked = true
        })
        taskText.value = ''
        addEventListeners()
        //+++++++++++
        
    }
    
    function addEventListeners() {
        history.addEventListener('click', historyPage)
        createTaskButton.addEventListener('click', createTask)

        document.querySelectorAll('.task__delete').forEach(e => {
            e.addEventListener('click', e => deleteBtn(e));
        });
    
        document.querySelectorAll('.task__checkbox').forEach(e => {
            e.addEventListener('change', e => checkCheckBox(e));
        });
        
    }


    function deleteBtn(e) {
        const parentNode = e.target.parentNode.parentNode
        const textValue = parentNode.querySelector('.task__text').innerText
        const indexOfDeleteEl = tasks.indexOf(tasks.filter(e => e.key === textValue)[0])

        tasksArchive.push( tasks.slice(indexOfDeleteEl, indexOfDeleteEl + 1)[0])
        tasks.splice(indexOfDeleteEl, 1)
        parentNode.remove()

        
        //+++++++++++++++++
    }
    function checkCheckBox(e) {
        const parentNode = e.target.parentNode
        const value = parentNode.querySelector('.task__text')
        const isChecked = e.target.checked
        
        value.classList.toggle('completed')
        
        checkIsChecked(tasks, value, isChecked)
         
        //+++++++++++++++++
    }
    function checkIsChecked(arr, value, isChecked) {
        arr.forEach(e => {
            if (e.key === value.innerText) {
                if(e.state === 'uncompleted' && isChecked) {
                    e.state = 'completed'
                } else {
                    e.state = 'uncompleted'
                }
            }
        })
    }
    function addToDocument(arr, doc) {
        arr.forEach(e => {
            doc.innerHTML += e.value
        })
    }
}
/*----------------------------------------HISTORY---PAGE-------------------------------------------------------------------------*/
function historyPage() {
    div.innerHTML = historyListPage
    console.dir(tasksArchive)
    const taskPage = document.querySelector('.history__todo')
    const completedBtn = document.querySelector('.completed-btn')
        completedBtn.addEventListener('click', showCompletedTasks)
    const uncompletedBtn = document.querySelector('.uncompleted-btn')
        uncompletedBtn.addEventListener('click', showUncompletedTasks)
    const listTasks = document.querySelector('.history-list')
    
    function showCompletedTasks() {
        listTasks.innerHTML = ''

        checkboxStateCheck(tasksArchive) 
        checkboxRemove(tasksArchive)
        checkBoxesChange(tasksArchive, 'completed')
        document.querySelectorAll('.task__delete').forEach(e => e.addEventListener('click', e => deleteTask(e)))
    }
    function showUncompletedTasks() {
        listTasks.innerText = ''
       
        checkBoxesChange(tasksArchive, 'uncompleted')
        document.querySelectorAll('.task__delete').forEach(e => e.addEventListener('click', e => deleteTask(e)))
    }
    function deleteTask(e) {
        const parentNode = e.target.parentNode.parentNode
        const textValue = parentNode.querySelector('.task__text').innerText
        const indexOfDeleteEl = tasksArchive.indexOf(tasksArchive.filter(e => e.key === textValue)[0])

        tasksArchive.splice(indexOfDeleteEl, 1)
        parentNode.remove()

       //+++++++++
    }
    function checkBoxesChange(arr, state) {
        arr.forEach(e => {
            if (e.state === state)  listTasks.innerHTML += e.value 
        })
    }

    function checkboxRemove(arr) {
        arr.forEach(el => {
            el.value[0] = el.value[0].replace(/<input class='task__checkbox'[^>]*>/, '')
        })
    }
    taskPage.addEventListener('click', () => init(true))
}

function checkboxStateCheck(arr) {
    arr.forEach(el => {
        if (el.state === 'completed') {
            el.value[0] = el.value[0].replace(/task__text/g, 'task__text completed')
        } else {
            el.value[0] = el.value[0].replace(/task__text completed/g, 'task__text')
        }
    })
}

function localStorageRefresh() {
    tasks.forEach(el => {
        if (el.state === 'completed') {
            el.value[0] = el.value[0].replace(/task__text/g, 'task__text completed')
        } else {
            el.value[0] = el.value[0].replace(/completed/g, '')
        }
    })
    localStorage.setItem('tasks', JSON.stringify(tasks))
    localStorage.setItem('tasksArchive', JSON.stringify(tasksArchive))
}

function debounce(func, delay) {
    let timerId;
    return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => func.apply(this, args), delay)
  };
}

window.addEventListener('beforeunload', localStorageRefresh)
