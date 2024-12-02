// validando los datos
document.getElementById('taskForm').addEventListener('submit', function(event) {
      event.preventDefault();
      const taskInput = document.getElementById('taskInput').value.trim();
      const categorySelect = document.getElementById('categorySelect').value;
      if (!taskInput || !categorySelect) {

        alert('Por favor, completa todos los campos.');
      } else {
            console.log('Tarea:', taskInput);
            console.log('Categoría:', categorySelect);
      }
});

// Color de cada 'select'
document.getElementById('categorySelect').addEventListener('change', function() {
            var selectedOption = this.options[this.selectedIndex];
            this.style.backgroundColor = selectedOption.style.backgroundColor;
            this.style.color = selectedOption.style.color;

});


// Funcion fetch tareas y mostrar
function fetchTasks() {
    console.log("hi");
      axios.get('http://localhost:3000/tasks')
        .then(response => {
          const tasks = response.data;
          let tasksHTML = '';
          tasks.forEach((task, index) => {
            tasksHTML += `
              <tr class="task-row" data-task-id="${task.id}">
                <td>${task.id}</td>
                <td>
                  <span class="task-category" style="background-color: ${task.category};"></span>
                  <span class="task-name">${task.task_name}</span>
                  <input type="text" class="task-edit-input" value="${task.task_name}" style="display: none;" />
                </td>
                <td>
                  <button class="btn btn-success" onclick="completeTask(${task.id})">Completada</button>
                  <span class="edit-icon" onclick="editTask(${task.id})">
                    <i class="fas fa-pencil-alt"></i>
                  </span>
                </td>
                  <td><button class="delete-btn" onclick="deleteTask(${task.id})" style="display: none;">✖</button></td>
              </tr>
            `;
          });
          document.getElementById('taskList').innerHTML = tasksHTML;
        })
      .catch(error => {
    console.error('Error fetching tareas:', error);
});

// Fetch de tareas completadas
axios.get('http://localhost:3000/completed_tasks')
        .then(response => {
          const completedTasks = response.data;
          let completedTasksHTML = '';
          completedTasks.forEach(task => {
            completedTasksHTML += `
              <tr>
                <td>${task.id}</td>
                <td>
                  <span class="task-category" style="background-color: ${task.category};"></span>
                  ${task.task_name}
                </td>
                <td>${new Date(task.completed_at).toLocaleString()}</td>
              </tr>
            `;
          });
          document.getElementById('completedTaskList').innerHTML = completedTasksHTML;
          })
          .catch(error => {
            console.error('Error getting tareas completadas:', error);
          });
        }

    //   document.getElementById('taskList').innerHTML = tasksHTML;


    // Interactividad al presionar icon 'edit-icon'
    function editTask(taskId) {
      const taskRow = document.querySelector(`tr[data-task-id="${taskId}"]`);
      const taskName = taskRow.querySelector('.task-name');
      const taskEditInput = taskRow.querySelector('.task-edit-input');
      const deleteBtn = taskRow.querySelector('.delete-btn'); 
    
      const toggleEdit = (showEdit) => {
        taskName.style.display = showEdit ? 'none' : 'inline';
        taskEditInput.style.display = showEdit ? 'inline' : 'none';
        deleteBtn.style.display = 'inline'; 
        if (showEdit) taskEditInput.focus();
      };
    
      const updateTaskName = () => {
        const updatedTaskName = taskEditInput.value.trim();
        if (updatedTaskName) {
          taskName.textContent = updatedTaskName;
          toggleEdit(false);
          updateTask(taskId, updatedTaskName);
        } else {
          alert('El nombre de la tarea no puede estar vacío');
        }
      };
    
      if (taskEditInput.style.display === 'none') {
        toggleEdit(true);
      } else {
        updateTaskName();
      }
    
      taskEditInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
          updateTaskName();
        }
      });
    }
    
// Funcion para editar tarea
function updateTask(taskId, updatedTaskName) {
          axios.post(`http://localhost:3000/tasks/${taskId}`, { task_name: updatedTaskName })
            .then(() => {
              fetchTasks();
            })
            .catch(error => {
              console.error('Error al actualizar la tarea:', error);
            });
        }

// Funcion para agregar una nueva tarea
document.getElementById('addTaskButton').addEventListener('click', () => {
      const taskInput = document.getElementById('taskInput').value;
      const categorySelect = document.getElementById('categorySelect').value;
      if (taskInput.trim()) {
        axios.post('http://localhost:3000/tasks', { task_name: taskInput, category: categorySelect })
          .then(() => {
            fetchTasks();
            document.getElementById('taskInput').value = '';
          })
          .catch(err => console.error('Error ingresando tarea:', err));
      }
});

// Funcion para marcar tarea como completada
function completeTask(taskId) {
  axios.post(`http://localhost:3000/completed-task/${taskId}`)
    .then(() => {
      fetchTasks(); // fetch again despues de completar
    })
  .catch(error => console.error('Error completando tarea:', error));
}

// Funcion para eliminar tarea
function deleteTask(taskId) {
  if (confirm("Estas seguro de que deseas eliminar esta tarea?")) {
    axios.delete(`http://localhost:3000/tasks/${taskId}`)
      .then(() => {
        fetchTasks();
        const taskItem = document.querySelector(`.task-item[data-task-id="${taskId}"]`);
        if (taskItem) {
          taskItem.remove();
        }
        console.log(`Tarea ${taskId} eliminada`);
      })
      .catch(error => {
        console.error('Error eliminando tarea:', error);
        alert('Error al eliminar tarea.');
      });
  }
}


fetchTasks();