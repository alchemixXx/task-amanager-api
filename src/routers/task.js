const express = require('express');
const { Task } = require('../models/task');
const { auth } = require('../middleware/auth');

const taskRouter = new express.Router();

taskRouter.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send({ error });
  }
});

taskRouter.get('/tasks', auth, async (req, res) => {
  const completed = req.query.completed;
  const match = {}
  const sort = {}
  const sortByQuery = req.query.sortBy;


  if (sortByQuery) {
    const [sortBy, direction] = sortByQuery.split('_');
    sort[sortBy] = direction === 'desc' ? -1 : 1;
  }

  if (completed) {
    match.completed = completed === 'true'
  }

  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      }
    }).execPopulate();
    res.status(200).send(req.user.tasks);
  } catch (error) {
    res.status(500).send({ error });
  }
});

taskRouter.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send({ msg: 'Some error' });
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send({ error });
  }
});

taskRouter.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    res.status(400).send({ error: 'Invalid updates' });
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).send({ msg: 'Some error' });
    }

    updates.forEach((update) => {
      task[update] = req.body[update];
    });

    await task.save();

    res.send(task);
  } catch (error) {
    res.status(400).send({ error });
  }
});

taskRouter.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({_id:req.params.id, owner:req.user._id});

    if (!task) {
      return res.status(404).send({ msg: 'No task with such ID' });
    }

    res.send(task);
  } catch (error) {
    res.status(500).send({ error });
  }
});

module.exports = { taskRouter };
