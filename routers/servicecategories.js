const {ServiceCategoriesModel} = require('../models/servicecategories');
const express = require('express');
const router = express.Router();

// GET
router.get(`/`, async (req,res)=>{
    const categoriesList = await ServiceCategoriesModel.find();
    if(!categoriesList){
        res.status(500).json({success:false})
    }
    res.status(200).send(categoriesList);
})

// GET BY ID
router.get('/:id', async (req,res)=>{
    const category = await ServiceCategoriesModel.findById(req.params.id);
    if(!category){
        res.status(500).json({success:false, message:'The category with the given ID not found!'})
    }
    res.status(200).send(category);
})

// POST
router.post(`/`, async (req,res)=>{
    let category= new ServiceCategoriesModel({
        categName: req.body.categName,
        icon: req.body.icon,
        image: req.body.image
    })
    category = await category.save();

    if(!category){
        return res.status(400).send('the category cannot be created!')
    }

    res.send(category);
    
    // category.save().then((createdCategory => {
    //     res.status(201).json(createdCategory)
    // })).catch((err)=>{
    //     res.status(500).json({
    //         error:err,
    //         success:false
    //     })
    // })
})


// UPDATE
router.put('/:id', async (req,res)=>{
    const category = await ServiceCategoriesModel.findByIdAndUpdate(
        req.params.id,
        {
            categName: req.body.categName,
            icon: req.body.icon,
            image: req.body.image
        },
        {new:true}
    )
    if(!category){
        return res.status(400).send('the category cannot be updated!')
    }

    res.send(category);
})

// DELETE
router.delete('/:id', (req,res)=>{
    ServiceCategoriesModel.findByIdAndRemove(req.params.id).then(category=>{
        if(category){
            return res.status(200).json({success:true,message: 'the category is deleted'})
        } else {
            return res.status(404).json({success:false,message: 'the category not found!'})
        }
    }).catch(err=>{
        return res.status(500).json({success:false,error:err})
    })
})

module.exports = router;