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

function editTask(taskId) {
      // Obtener la fila correspondiente a la tarea
      const taskRow = document.querySelector(`tr[data-task-id="${taskId}"]`);
      
      // Obtener el campo de texto de la tarea y el nombre de la tarea
      const taskName = taskRow.querySelector('.task-name');
      const taskEditInput = taskRow.querySelector('.task-edit-input');
      
      // Si el campo de edición está oculto, mostramos el campo y ocultamos el texto
      if (taskEditInput.style.display === 'none') {
        taskName.style.display = 'none';  // Ocultar el nombre de la tarea
        taskEditInput.style.display = 'inline';  // Mostrar el campo de edición
        taskEditInput.focus();  // Darle foco al campo de edición
      } else {
        // Si el campo de edición está visible, guardamos el valor y ocultamos el campo de edición
        const updatedTaskName = taskEditInput.value.trim();
        
        if (updatedTaskName) {
          taskName.textContent = updatedTaskName;  // Actualizar el nombre de la tarea
          taskName.style.display = 'inline';  // Mostrar el nombre de la tarea
          taskEditInput.style.display = 'none';  // Ocultar el campo de edición
    
          // Actualizar la tarea en el servidor usando axios
          updateTask(taskId, updatedTaskName);
        } else {
          alert('El nombre de la tarea no puede estar vacío');
        }
      }
      
      // Añadir evento de 'Enter' para guardar la tarea cuando el usuario presiona 'Enter'
   //   const taskEditInput = taskRow.querySelector('.task-edit-input');
      taskEditInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
          const updatedTaskName = taskEditInput.value.trim();
          
          if (updatedTaskName) {
            taskName.textContent = updatedTaskName;  // Actualizar el nombre de la tarea
            taskName.style.display = 'inline';  // Mostrar el nombre de la tarea
            taskEditInput.style.display = 'none';  // Ocultar el campo de edición
    
            // Actualizar la tarea en el servidor usando axios
            updateTask(taskId, updatedTaskName);
          } else {
            alert('El nombre de la tarea no puede estar vacío');
          }
        }
      });
    }

function updateTask(taskId, updatedTaskName) {
          // Realiza la solicitud POST con axios para actualizar el nombre de la tarea
          axios.post(`http://localhost:3000/tasks/${taskId}`, { task_name: updatedTaskName })
            .then(() => {
              // Llamar a la función para actualizar las tareas después de la edición
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



function deleteTask(taskId) {
  if (confirm("Are you sure you want to delete this task?")) {
    axios.delete(`http://localhost:3000/tasks/${taskId}`)
      .then(() => {
        // Refresh the task list from the server
        fetchTasks();
        
        // Remove the task item from the UI
        const taskItem = document.querySelector(`.task-item[data-task-id="${taskId}"]`);
        if (taskItem) {
          taskItem.remove();
        }
        console.log(`Task ${taskId} deleted successfully!`);
      })
      .catch(error => {
        console.error('Error deleting task:', error);
        alert('There was an issue deleting the task. Please try again.');
      });
  }
}


fetchTasks();