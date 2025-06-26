const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const id = await Task.createTask(req.body);
    res.status(201).json({ task_id: id });
  } catch (err) {
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
