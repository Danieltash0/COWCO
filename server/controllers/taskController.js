const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const { title, description, assigned_to, assigned_by, priority, category, status, due_date } = req.body;
    
    // Validate required fields
    if (!title || !description || !assigned_to || !assigned_by || !due_date) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, description, assigned_to, assigned_by, and due_date are required' 
      });
    }
    
    const taskData = {
      title,
      description,
      assigned_to: parseInt(assigned_to),
      assigned_by: parseInt(assigned_by),
      priority: priority || 'medium',
      category: category || 'general',
      status: status || 'pending',
      due_date
    };
    
    const id = await Task.createTask(taskData);
    res.status(201).json({ task_id: id });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.getAllTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    await Task.updateTask(req.params.id, req.body);
    res.json({ message: 'Task updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.deleteTask(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.completeTask = async (req, res) => {
  try {
    await Task.completeTask(req.params.id);
    res.json({ message: 'Task completed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTasksByUser = async (req, res) => {
  try {
    const tasks = await Task.getTasksByUser(req.params.userId);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
