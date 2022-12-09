const { OtpSmsModel } = require('../models/otpsms');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fast2sms = require('fast-two-sms');
const mongoose = require('mongoose');

// GET
router.get(`/`, async (req, res) => {
  const smsRecList = await OtpSmsModel.find();
  if (!smsRecList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(smsRecList);
});

// GET BY ID
router.get('/:id', async (req, res) => {
  const smsRec = await OtpSmsModel.findById(req.params.id);
  if (!smsRec) {
    res.status(500).json({
      success: false,
      message: 'Invalid OTP entered!',
    });
  }
  res.status(200).send(smsRec);
});

// GET BY NUMBER
router.get('/getbynum/:num', async (req, res) => {
  const smsRec = await OtpSmsModel.find({ number: req.params.num });
  if (!smsRec) {
    res.status(500).json({
      success: false,
      message: 'The rec not found!',
    });
  }
  res.status(200).send(smsRec);
});

// POST
router.post(`/`, async (req, res) => {
  let otpSmsRec = new OtpSmsModel({
    sender_id: req.body.sender_id,
    message: req.body.message,
    otp: req.body.otp,
    route: req.body.route,
    number: req.body.number,
    status: req.body.status,
  });
  otpSmsRec = await otpSmsRec.save();

  if (!otpSmsRec) {
    return res.status(400).send('Error in setting up the OTP!');
  }
  res.send(otpSmsRec);
});

// PUT
router.put(`/:id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid messege id !!!');
  }
  const otpSmsRec = await OtpSmsModel.findByIdAndUpdate(
    req.params.id,
    {
      sender_id: req.body.sender_id,
      message: req.body.message,
      otp: req.body.otp,
      route: req.body.route,
      number: req.body.number,
      status: req.body.status,
    },
    { new: true }
  );

  if (!otpSmsRec) {
    return res.status(400).send('Error in updating the OTP status!');
  }
  res.send(otpSmsRec);
});

// DELETE
router.delete('/:id', (req, res) => {
  OtpSmsModel.findByIdAndRemove(req.params.id)
    .then((smsRec) => {
      if (smsRec) {
        return res
          .status(200)
          .json({ success: true, message: 'The otp sms record is deleted' });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'The otp sms record not found!' });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

//SENDSMS
// router.post('/sendotp', async (req, res) => {
//     var options = {
//       authorization: process.env.F2S_API_KEY,
//       message: req.body.message,
//       numbers: [req.body.number],
//     };
//     const response = await fast2sms.sendMessage(options);
//     res.send(response);
// });

module.exports = router;
