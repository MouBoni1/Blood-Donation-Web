//create inventory
const inventoryModel = require('../models/inventoryModel');
const userModels = require('../models/userModels')
const createInventoryController = async (req,res) =>{
  try {
    const {email,inventoryType}=req.body
    //validation
    const user= await userModels.findOne({email})
    if(!user)
    {
         throw new Error('User not found')
    }
    if(inventoryType === "in" && user.role!='donar'){
         throw new Error ('Not a donor account')
    }
    if(inventoryType==='out' && user.role!='hospital'){
         throw new Error('Not a hospital')
    }
    //save record
    const inventory = new inventoryModel(req.body)
    await inventory.save();
    return res.status(201).send({
        success:"true",
        message:"new blood record added"
    })

  } catch (error) {
    console.log(error)
    return res.status(500).send({
        success:false,
        message:'error in inventory API',
        error
    })
  }
};

//get all blood records
const getInventoryController = async(req,res) =>{
  try {
    const inventory = await inventoryModel.find({
      organisation:req.body.userId})
      .populate('donar')
      .populate('hospital')
      .sort({createdAt:-1});
    return res.status(200).send({
      success:true,
      message:"get all records successfully",
      inventory,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success:false,
      message:"error in get ineventory"
    })
  }

}
module.exports = {createInventoryController,getInventoryController}