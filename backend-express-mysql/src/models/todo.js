//import express from 'express';
//import mysql from 'mysql2';
//import app from './app.js';

import db from '../../db/db.js'

// Rutas
// Get tareas
export const getTareas = (req, res) => {
const sql = 'SELECT * FROM tasks WHERE is_completed = false';
db.query(sql, [], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
});
};

// app.get('/tasks', (req, res) => {
//    db.query('SELECT * FROM tasks WHERE is_completed = false', (err, results) => {
//      if (err) return res.status(500).json({ error: err });
//      res.json(results); //  }); //  });

// Get tareas completadas
export const tareasCompletadas = (req, res ) => { 
const sql = 'SELECT * FROM completed_tasks ORDER BY completed_at DESC';
db.query(sql, [], (err, results) => {
if (err) return res.status(500).json({ error: err });
res.json(results);
});
};
  
// Insertar tarea con categoria
export const putTarea = (req, res) => { 
const sql = 'INSERT INTO tasks (task_name, category) VALUES (?, ?)'
const { task_name, category } = req.body;
const validCategories = ['red', 'green', 'yellow', 'blue'];
  
// Validar categoria
if (!validCategories.includes(category)) {
return res.status(400).json({ error: 'categoria invalida' });
}
  
db.query(sql, [task_name, category], (err, result) => {
if (err) return res.status(500).json({ error: err });
res.status(201).json({ id: result.insertId, task_name, category });
});
};
  
// Marcar tarea como completada
export const completarTarea = (req, res) => { 
const sql = 'UPDATE tasks SET is_completed = true WHERE id = ?';
//app.post('/complete-task/:id', (req, res) => {
const { id } = req.params;
    db.beginTransaction((err) => {
      if (err) return res.status(500).json({ error: err });
        db.query(sql, [id], (err, result) => {
          if (err) return db.rollback(() => res.status(500).json({ error: err }));
              db.query('INSERT INTO completed_tasks (task_name) SELECT task_name FROM tasks WHERE id = ?', [id], (err, result) => {
          if (err) return db.rollback(() => res.status(500).json({ error: err }));
              db.commit((err) => {
          if (err) return db.rollback(() => res.status(500).json({ error: err }));
              res.status(200).json({ message: 'Tarea marcada como completa' });
          });
          });
      });
    });
  };
  
// Ruta para editar nombre de tarea
export const editarTarea = (req, res) => {
const taskId = req.params.id;  // Obtener el ID de la tarea
const { task_name } = req.body;  // Obtener el nuevo nombre de la tarea

// Verificar que el nombre de la tarea no esté vacío
if (!task_name || task_name.trim() === '') {
console.error('El nombre de la tarea no puede estar vacío');
return res.status(400).json({ error: 'El nombre de la tarea no puede estar vacío' });
}

// Consulta SQL para actualizar tarea
const sql = 'UPDATE tasks SET task_name = ? WHERE id = ?';
db.query(sql, [task_name, taskId], (err, result) => {
  if (err) {
    console.error('Error al ejecutar la consulta SQL:', err);  // Log de error más detallado
    return res.status(500).json({ error: 'Error al actualizar la tarea', details: err.message });
  }

  // Verificar si se actualizó alguna fila
  if (result.affectedRows === 0) {
    console.warn('No se encontró la tarea con el ID:', taskId);
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

    console.log('Tarea actualizada correctamente:', result);
    res.status(200).json({ success: true, message: 'Tarea actualizada exitosamente' });
  });
};


// Ruta para eliminar tarea
export const eliminarTarea = (req, res) => {

  const { id } = req.params;

  const sql = 'DELETE FROM tasks WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.status(200).json({ message: 'Tarea eliminada' });
  });
};





export default { getTareas, tareasCompletadas, putTarea, completarTarea, editarTarea, eliminarTarea };