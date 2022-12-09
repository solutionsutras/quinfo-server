const { Users } = require('../models/users');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// GET
router.get(`/`, async (req, res) => {
    const userList = await Users.find().select('-passwordHash');
    if (!userList) {
        res.status(500).json({ success: false })
    }
    res.status(200).send(userList);
})

// GET BY ID
router.get('/:id', async (req, res) => {
    const user = await Users.findById(req.params.id).select('-passwordHash');
    if (!user) {
        res.status(500).json({ success: false, message: 'The uesr with the given ID not found!' })
    }
    res.status(200).send(user);
})

// GET BY PHONE NUMBER
router.get('/getbynum/:num', async (req, res) => {
  const userRec = await Users.find({ phone: req.params.num });
  if (!userRec) {
    res.status(500).json({
      success: false,
      message: 'The user not found!',
    });
  }
  res.status(200).send(userRec);
});

// GET BY PHONE EMAIL ID
router.get('/getbyemail/:email', async (req, res) => {
  const userRec = await Users.find({ email: req.params.email });
  if (!userRec) {
    res.status(500).json({
      success: false,
      message: 'The user not found!',
    });
  }
  res.status(200).send(userRec);
});

// GET BY PHONE EMAIL ID
router.get('/getbyroll/:roll', async (req, res) => {
  const userRec = await Users.find({ userRoll: req.params.roll });
  
  if (!userRec) {
    res.status(500).json({
      success: false,
      message: 'The user not found!',
    });
  }
  res.status(200).send(userRec);
});

// GET COUNT
router.get('/get/count', async (req, res) => {
    const usersCount = await Users.countDocuments()
    if (!usersCount && usersCount !== 0) {
      res.status(500).json({ success: false });
    }
    res.send({ usersCount: usersCount });
})

// POST
router.post(`/register`, async (req, res) => {
    let user = new Users({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      userRoll: req.body.userRoll,
      address: req.body.address,
      city: req.body.city,
      pin: req.body.pin,
      state: req.body.state,
      country: req.body.country,
      avtar: req.body.avtar,
    });
    user = await user.save();

    if (!user) {
        return res.status(400).send('the user cannot be created!')
    }

    res.send(user);
})

//LOGIN

router.post('/login', async (req, res) => {
    // const user = await Users.findOne({email:req.body.email});
    let user = await Users.find({ $or: [{ email: req.body.userId }, { phone: req.body.userId }] });
    
    const secret = process.env.secret;
    if (!user) {
        return res.status(400).send('The user email/phone no not found!!!')
    }else{
        user = user[0];
        // console.log(user.passwordHash);
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
          {
            userId: user.id,
            userRoll: user.userRoll,
          },
          secret,
          { expiresIn: '1d' }
        );
        return res.status(200).send({ phone:user.phone, email: user.email, token: token })
    } else {
        return res.status(400).send('wrong password entered!!!')
    }
})

router.post('/otplogin', async (req, res) => {
    
    let user = await Users.find({ phone: req.body.userId });
    
    const secret = process.env.secret;
    if (!user) {
        return res.status(400).send('The user email/phone no not found!!!')
    }else{
        user = user[0];
    }
    
    if (user && (req.body.password === user.passwordHash)) {
        const token = jwt.sign(
          {
            userId: user.id,
            userRoll: user.userRoll,
          },
          secret,
          { expiresIn: '1d' }
        );
        return res.status(200).send({ phone:user.phone, email: user.email, token: token })
    } else {
        return res.status(400).send('wrong password entered!!!')
    }
})

// DELETE
router.delete('/:id', (req, res) => {
    Users.findByIdAndRemove(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({ success: true, message: 'the user is deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'the user not found!' })
        }
    }).catch(err => {
        return res.status.apply(400).json({ success: false, error: err })
    })
})

module.exports = router;