const elements = {
    registerEmail: document.querySelector("#register-email"),
    registerPassword: document.querySelector("#register-password"),
    registerButton: document.querySelector("#register-button"),
    loginEmail: document.querySelector("#login-email"),
    loginPassword: document.querySelector("#login-password"),
    loginButton: document.querySelector("#login-button"),
    gotoRegister: document.querySelector("#go-to-register"),
    gotoLogin: document.querySelector("#go-to-login"),
    newTodoDescription: document.querySelector("#create-todo-description"),
    newTodoButton: document.querySelector("#create-todo-button"),
    deletebut: document.querySelectorAll("#delBut")
}

const applicationSections = ["loading", "login", "register", "todos"];
const originalDisplayOptions = new Map();

function showRelevantHTML(id = "loading"){
    for(const section of applicationSections){
        const element = document.querySelector(`#${section}`);
        if(!originalDisplayOptions.has(section)){
            originalDisplayOptions.set(section, element.style.display); 
        }
        if (section === id) {
            element.style.display = originalDisplayOptions.get(section);
        } else {
            element.style.display = "none"; 
        }
    }
}

elements.gotoRegister.addEventListener("click", () => showRelevantHTML("register"));
elements.gotoLogin.addEventListener("click", () => showRelevantHTML("login"));

async function loadTodoItems() {
    const {db, collection, getDocs, auth} = window.fiba;

    const {uid} = auth.currentUser;
    const todoList = document.querySelector("#todo-items-list");
    const todoResult = await getDocs(collection(db,uid));


    todoList.innerHTML = "";
    todoResult.forEach(todoItem => {
        todoList.innerHTML +=`<li>${todoItem.data().description} <button onclick="deleteTodoItem('${todoItem.id}')">del</button></li>`;
        console.log(todoItem.id);
    });
}



async function todoApp(){
    const {auth} = window.fiba;
    
    elements.registerButton.addEventListener("click", registerUser);
    elements.loginButton.addEventListener("click", loginUser);
    elements.newTodoButton.addEventListener("click",addTodoItem);
    
    if(auth.currentUser) {
        showRelevantHTML("todos");
        await loadTodoItems();
    } else {
        showRelevantHTML("login")
    }
}

function waitForFirebaseAndStart(){
    if(!window.fiba?.isReady()){
        console.log("waiting for firebase");
        setTimeout(waitForFirebaseAndStart,500);
    } else {
        console.log("firebase is ready!");
        todoApp();
    }
}

async function registerUser(){
    const {auth, createUserWithEmailAndPassword } = window.fiba;

    const email = elements.registerEmail.value;
    const password = elements.registerPassword.value;

    try{
        await createUserWithEmailAndPassword(auth, email, password);
        todoApp();
    } catch (error){
        alert(error.message);
    }
}

async function loginUser(){
    const { auth, signInWithEmailAndPassword } = window.fiba;
    
    const email = elements.loginEmail.value;
    const password = elements.loginPassword.value;

    try{
        await signInWithEmailAndPassword(auth, email, password);
        todoApp();
    } catch (error){
        alert(error.message);
    }
}

async function addTodoItem(){
    try{
        const {db, setDoc, doc, auth} = window.fiba;
        const userId = auth.currentUser.uid;
        const newTodoItemId = crypto.randomUUID();

        const newTodoItem = {
            description: elements.newTodoDescription.value,
            creationTimestamp: Date.now(),
        };

        await setDoc(doc(db, userId, newTodoItemId), newTodoItem);
        loadTodoItems();
    } catch (error){
        alert(error.message);
    }
}

async function deleteTodoItem(id){
    try{
        const {db, deleteDoc, doc, auth} = window.fiba;
        const userId = auth.currentUser.uid;

        console.log("deleting " + id);

        await deleteDoc(doc(db, userId, id));
        loadTodoItems();
    } catch (error){
        alert(error.message);
    }
}

waitForFirebaseAndStart();