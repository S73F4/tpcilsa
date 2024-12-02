import express from 'express';
import { getTareas, tareasCompletadas, putTarea, completarTarea, editarTarea, eliminarTarea } from '../models/todo.js';
// import { validateCategory } from '/public/forms';


const router = express.Router();

router.get('/tasks', getTareas);
router.get('/completed_tasks', tareasCompletadas);
router.post('/tasks', putTarea);
router.post('/completed-task/:id', completarTarea);
router.post('/tasks/:id', editarTarea);
router.delete('/tasks/:id', eliminarTarea);



export default router;