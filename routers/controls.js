const { Users } = require('../models/users');
const { Controls } = require('../models/controls');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// GET
router.get(`/`, async (req, res) => {
  const controlsList = await Controls.find().populate(
    'createdByUser lastUpdatedByUser'
  );
  if (!controlsList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(controlsList);
});

// GET BY ID
router.get('/:id', async (req, res) => {
  const controlRec = await Controls.findById(req.params.id).populate(
    'createdByUser lastUpdatedByUser'
  );
  if (!controlRec) {
    res.status(500).json({
      success: false,
      message: 'The control record with the given ID not found!',
    });
  }
  res.status(200).send(controlRec);
});

// GET BY RECORD TYPE
router.get('/getbytype/:recType', async (req, res) => {
  const controlRec = await Controls.findOne({
    recType: req.params.recType,
  }).populate('createdByUser lastUpdatedByUser');
  if (!controlRec) {
    res.status(500).json({
      success: false,
      message: 'No control record found for the selected type!',
    });
  }
  res.status(200).send(controlRec);
});

// POST
router.post('/', async (req, res) => {
  const chksUser = await Users.findById(req.body.createdByUser);
  if (!chksUser)
    return res.status(400).send('Invalid created by user selected');

  const chksUser2 = await Users.findById(req.body.lastUpdatedByUser);
  if (!chksUser2)
    return res.status(400).send('Invalid last updated by user selected');

  const dateNow = Date.now();

  let newControlRec = new Controls({
    recType: req.body.recType,
    fieldName: req.body.fieldName,
    fieldValue: req.body.fieldValue,
    remarks: req.body.remarks,
    createdByUser: req.body.createdByUser,
    lastUpdatedByUser: req.body.lastUpdatedByUser,
    lastUpdated: dateNow,
  });
  newControlRec = await newControlRec.save();

  if (!newControlRec) {
    return res.status(400).send('the control record cannot be created!');
  }

  res.send(newControlRec);
});

// POST
router.put('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid id !!!');
  }

  const chksUser2 = await Users.findById(req.body.lastUpdatedByUser);
  if (!chksUser2)
    return res.status(400).send('Invalid last updated by user selected');

  const dateNow = Date.now();
  const newControlRec = await Controls.findByIdAndUpdate(
    req.params.id,
    {
      recType: req.body.recType,
      fieldName: req.body.fieldName,
      fieldValue: req.body.fieldValue,
      remarks: req.body.remarks,
      lastUpdatedByUser: req.body.lastUpdatedByUser,
      lastUpdated: dateNow,
    },
    { new: true }
  );
  if (!newControlRec) {
    return res.status(400).send('the control record cannot be updated!');
  }

  res.send(newControlRec);
});

// DELETE
router.delete('/:id', (req, res) => {
  Controls.findByIdAndRemove(req.params.id)
    .then((cRec) => {
      if (cRec) {
        return res
          .status(200)
          .json({ success: true, message: 'the control record is deleted' });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'the control record not found!' });
      }
    })
    .catch((err) => {
      return res.status.apply(400).json({ success: false, error: err });
    });
});

module.exports = router;
