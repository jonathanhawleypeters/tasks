let db: IDBDatabase | void;

export const initialize = () => {
  const request = indexedDB.open("tasks", 1);
  
  request.onerror = (event) => {
    console.error(`Database error: ${event.target?.errorCode}`);
  };
  
  request.onsuccess = () => {
    db = request.result;
  };
  
  // This event is only implemented in recent browsers
  request.onupgradeneeded = () => {
    const db = request.result;
  
    db.createObjectStore("userActions", { keyPath: "timestamp" });
  
    const taskStore = db.createObjectStore("tasks", { keyPath: "createdAt" });
  
    taskStore.createIndex("description", "description", { unique: false });
  };
}

export const userAction = () => {
  const transaction = db?.transaction(["userActions", "tasks"], "readwrite");

  if (!transaction) return;

  transaction.oncomplete = () => {
    console.log("transaction complete");
  };

  transaction.onerror = (event) => {
    console.log(`Error: ${event.target?.errorCode}`)
  };

  const actionStore = transaction.objectStore("userActions");

  const action = {
    type: "ADD",
    description: "Test task",
    timestamp: Date.now(),
  };

  const request = actionStore.add(action);

  request.onsuccess = () => {
    const taskStore = transaction.objectStore("tasks");

    const task = {
      createdAt: action.timestamp,
      description: action.description,
    };

    const request = taskStore.add(task);

    request.onsuccess = () => {
      console.log(`successfully added ${task}`);
    }
  }
};