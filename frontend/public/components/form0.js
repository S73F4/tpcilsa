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
                  <span class="edit-icon">
                    <i class="fas fa-pencil-alt"></i>
                  </span>
                </td>
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

    // Funcion para editar nombre de tarea 
    document.addEventListener('click', function (e) {
      // Editar cuando el icono del lapiz es clickeado
      if (e.target && e.target.closest('.edit-icon')) {
        const taskRow = e.target.closest('.task-row');
        const taskId = taskRow.getAttribute('data-task-id');
        const taskNameSpan = taskRow.querySelector('.task-name');
        const taskEditInput = taskRow.querySelector('.task-edit-input');

        // Mostrar campo para editar nombre de tarea
        taskNameSpan.style.display = 'none';
        taskEditInput.style.display = 'inline-block';
        taskEditInput.focus();

        // Guardar nuevo nombre de tarea al pulsar tecla Enter
        taskEditInput.addEventListener('blur', function () {
          const updatedTaskName = taskEditInput.value;
          if (updatedTaskName.trim() !== '') {
            axios.put(`http://localhost:3000/tasks/${taskId}`, { task_name: updatedTaskName })
              .then(response => {
                // Actualizando el nombre de la tarea en la pantalla
                taskNameSpan.textContent = updatedTaskName;
                taskNameSpan.style.display = 'inline-block';
                taskEditInput.style.display = 'none';
              })
              .catch(error => {
                console.error('Error editando tarea:', error);
              });
          } else {
            taskNameSpan.style.display = 'inline-block';
            taskEditInput.style.display = 'none';
          }
        });
      }
    });

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


fetchTasks();