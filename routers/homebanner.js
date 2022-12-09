const { HomeBanners } = require('../models/homebanner');
const express = require('express');
const router = express.Router();

// GET
router.get(`/`, async (req, res) => {
  const bannersList = await HomeBanners.find();
  if (!bannersList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(bannersList);
});

// GET BY ID
router.get('/:id', async (req, res) => {
  const banner = await HomeBanners.findById(req.params.id);
  if (!banner) {
    res
      .status(500)
      .json({
        success: false,
        message: 'Banner record with the given ID not found!',
      });
  }
  res.status(200).send(banner);
});

// POST
router.post(`/`, async (req, res) => {
  let banner = new HomeBanners({
    image: req.body.image,
    captionText1: req.body.captionText1,
    captionText2: req.body.captionText2,
    captionText3: req.body.captionText3,
    captionText4: req.body.captionText4,
    altText: req.body.captionText1,
  });
  banner = await banner.save();

  if (!banner) {
    return res.status(400).send('the Item Quality cannot be created!');
  }

  res.send(banner);
});

// UPDATE
router.put('/:id', async (req, res) => {
  const banner = await HomeBanners.findByIdAndUpdate(
    req.params.id,
    {
      image: req.body.image,
      captionText1: req.body.captionText1,
      captionText2: req.body.captionText2,
      captionText3: req.body.captionText3,
      captionText4: req.body.captionText4,
      altText: req.body.captionText1,
    },
    { new: true }
  );
  if (!banner) {
    return res.status(400).send('Banner record cannot be updated!');
  }

  res.send(banner);
});

// DELETE
router.delete('/:id', (req, res) => {
  HomeBanners.findByIdAndRemove(req.params.id)
    .then((banner) => {
      if (banner) {
        return res
          .status(200)
          .json({ success: true, message: 'Banner record is deleted' });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'Banner record not found!' });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
