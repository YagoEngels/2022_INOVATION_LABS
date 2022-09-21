(async () => {
    while (!window && !window.firebase && !window.firebase.isReady()){
        
    }
    console.log("firebase is reasy!");

    const {
        collection,
        getDocs 
    } = window.firestore;
     
    const {
        db
    } = window.firebase;

    async function loadTodoItems() {
        const todoList = document.querySelector("#todo-items-list");
        const todoResult = await getDocs(collection(db,"todo-items"));

        todoList.innerHTML = "";
        todoResult.forEach(todoItem => {
            
            todoList.innerHTML += `<ul class="horul">
            <li><input type="checkbox" checked="checked"></li>
            <li>${todoItem.data().description}</li>
            <li>17 / 11 /2000</li>
            <li>25 / 11 / 2022</li>
            </ul>`;
        });
    }
    
    await loadTodoItems();
})();