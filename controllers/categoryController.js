const Category = require("../model/category.model");
const {intRedis} = require('../client')

let {client} = require('../client');


const categoryHandler = async (req, res) => {

    try {

        if(!client){
            client = await intRedis();
           console.log('redis client is not intialized');
        }

        const chachedcategory = await client?.get("categories");

        if(chachedcategory){

            return res.json(JSON.parse(chachedcategory))
        }
      
        const categories = await Category.find({});

        await client?.set("categories", JSON.stringify(categories),{EX:3600});

        res.json(categories)
        
    }catch(err){
        res.status(404).json({ message: "Could not find categories" })
    }
}


module.exports = categoryHandler;