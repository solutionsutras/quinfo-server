const { BusesModel } = require('../models/buses');
const { Categories } = require('../models/categories');
const { ItemQuality } = require('../models/itemquality')
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' })

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValidFileType = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type!');
        if (isValidFileType) {
            uploadError = null
        }
        cb(uploadError, './public/uploads')
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

const uploadOptions = multer({ storage: storage });

// GET
router.get(`/`, async (req, res) => {

    let filter = {}

    //If Filtering by Category Id
    if (req.query.itemCategory) {
        filter = { itemCategory: req.query.itemCategory.split(',') }
    }

    const itemList = await BusesModel.find(filter)
        .populate('itemCategory')
        .populate('quality')
        .populate({ path: 'rates', populate: ('unit') });
    if (!itemList) {
        res.status(500).json({ success: false })
    }
    res.status(200).send(itemList);
})

// GET BY ID
router.get('/:id', async (req, res) => {
    const item = await BusesModel.findById(req.params.id)
        .populate('itemCategory')
        .populate('quality')
        .populate({ path: 'rates', populate: ('unit') })
        .exec();
    // const item = await BusesModel.findById(req.params.id).populate({ path: 'itemCategory', model: 'Categories' });
    // const item = await BusesModel.findById(req.params.id);
    if (!item) {
        res.status(500).json({ success: false, message: 'The Item with the given ID not found!' })
    }
    res.status(200).send(item);
})

// POST
router.post(`/`, uploadOptions.single('image'), async (req, res) => {

    const category = await Categories.findById(req.body.itemCategory);
    if (!category) return res.status(400).send('Invalid itemCatgoryId selected')

    //check if file exists
    const file = req.file;
    if (!file) return res.status(400).send('No image provided in the request')

    //build file url
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    // const rates = req.body.rates;
    // if(rates){
        
    // }

    const quality = await ItemQuality.findById(req.body.quality);
    if (!quality) return res.status(400).send('Invalid item quality selected');

    let item = new BusesModel({
        itemCategory: req.body.itemCategory,
        itemName: req.body.itemName,
        itemDesc: req.body.itemDesc,
        image: `${basePath}${fileName}`,
        // image:req.body.image,
        quality: req.body.quality,
        rates: req.body.rates,
        discountPercent: req.body.discountPercent,
        isFeatured: req.body.isFeatured,
        isAvailable: req.body.isAvailable,
        numOfReviews: req.body.numOfReviews,
        ratings: req.body.ratings,
    })

    item = await item.save();

    if (!item) {
        return res.status(400).send('the Item cannot be created!')
    }
    res.send(item);

    // item.save().then((createdItem => {
    //     res.status(201).json(createdItem)
    // })).catch((err)=>{
    //     res.status(500).json({
    //         error:err,
    //         success:false
    //     })
    // })
})

// UPDATE
router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid item id !!!')
    }
    //check if file exists
    const file = req.file;
    if (!file) return res.status(400).send('No image provided in the request')

    //build file url
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    const category = await Categories.findById(req.body.itemCategory);
    if (!category) return res.status(400).send('Invalid itemCatgoryId !!!');

    const item = await BusesModel.findByIdAndUpdate(
        req.params.id,
        {
            itemCategory: req.body.itemCategory,
            itemName: req.body.itemName,
            itemDesc: req.body.itemDesc,
            image: `${basePath}${fileName}`,
            // image: req.body.image,
            quality: req.body.quality,
            rates: req.body.rates,
            discountPercent: req.body.discountPercent,
            isFeatured: req.body.isFeatured,
            isAvailable: req.body.isAvailable,
            numOfReviews: req.body.numOfReviews,
            ratings: req.body.ratings,
        },
        { new: true }
    )
    if (!item) {
        return res.status(400).send('the Item cannot be updated!')
    }

    res.send(item);
})

// DELETE
router.delete('/:id', (req, res) => {
    BusesModel.findByIdAndRemove(req.params.id).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'the item is deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'the item not found!' })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
})

// GET COUNT
router.get('/get/count', async (req, res) => {
    const itemsCount = await BusesModel.countDocuments()
    if (!itemsCount && itemsCount !== 0) {
      res.status(500).json({ success: false });
    }
    res.send({ itemsCount: itemsCount });
})

// GET FEATURED ITEMS
router.get('/get/featured', async (req, res) => {
    const itemList = await BusesModel.find({ isFeatured: true })
    if (!itemList) {
        res.status(500).json({ success: false })
    }
    res.send(itemList);
})

// GET FEATURED ITEMS WITH LIMIT
router.get('/get/featured/:limit', async (req, res) => {
    const limit = req.params.limit ? req.params.limit : 0
    const itemList = await BusesModel.find({ isFeatured: true }).limit(limit)
    if (!itemList) {
        res.status(500).json({ success: false })
    }
    res.send(itemList);
})



module.exports = router;