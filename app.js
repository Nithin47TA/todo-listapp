const express = require("express");
const bodyparser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require("mongoose");
const _=require("lodash");
const { rearg } = require("lodash");
const app = express();
mongoose.connect('mongodb://localhost:27017/todoListDB', {useNewUrlParser: true, useUnifiedTopology: true});


const todoListSchema=new mongoose.Schema({ itemname:String});
const itemListSchema=new mongoose.Schema({ list:String,item:[todoListSchema]});
const List= mongoose.model('List',todoListSchema);
const Item = mongoose.model('Item',itemListSchema);

const firstData=new List({itemname:'welcome to my app'});
const secoundData=new List({itemname:'<--- to delete and + to add'});
const begining=[firstData,secoundData];

app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(express.static("public/"));
app.set('view engine', 'ejs');
app.get("/", function(req, res) {

  List.find({},function(err,itemList){
        if(itemList.length===0){

          List.insertMany(begining,function(err){ if(!err) console.log('first entry succesfull');});
          res.redirect("/");
        }
        else{
          res.render('list', {
            day: date.day(),
            list: itemList
          });
        }
        
  });

  
});

app.post("/", function(req, res) {
  const newItem= new List({itemname:req.body.Item});
  const name=req.body.button;
  if(name===date.day()){

  newItem.save(function(err){ if(!err) console.log('post successfull');});
  res.redirect("/");
  }
  else{
   Item.findOne({list:name},function(err,foundList){
     if(!err){
       if(!foundList){
        console.log("no foindlist");
        
       }
       else{
        console.log("foundList : " + foundList);
        foundList.item.push(newItem);
        foundList.save();
        console.log("foundList update : " + foundList);
       }
     }
     else{
       console.log("errrrrooooooooooorrrrrrrrrrr");
     }
     res.redirect("/" + name);
   });
    
  }

});

app.post("/checkbox",function(req,res){
  // before mongodb
  // listitem.splice(listitem.indexOf(req.body.value),1);
  // console.log(req.body.value);
  // console.log(listitem.indexOf(req.body.value));
 const valueToDelete=req.body.value;
 const rootName=req.body.rootName;
if(rootName===date.day()){
  List.findByIdAndDelete(req.body.value,function(err){ if(!err) console.log('deletion successfull');});
  res.redirect("/");
}
else{
  Item.findOneAndUpdate({list:rootName},{$pull:{item:{_id:valueToDelete}}},function(err,result){
    if(!err){
      res.redirect("/"+rootName);
    }
    else{
      console.log("error");
    }
  });
}
 


  
});

app.get("/:newList",function(req,res){
  
  const newroot=_.capitalize(req.params.newList);
  Item.findOne({list:newroot},function(err,result){
    if(!err)
    {
      if(!result){
        console.log("no exist");
        const first= new Item({list:newroot,item:begining});
        first.save();
        res.redirect("/" + newroot);
      }
      else{

        console.log("exist");
        res.render('list', {
          day: result.list,
          list: result.item
        });
      }
    }
  })
  // const first= new Item({list:newroot,item:begining});
  // first.save();
  // res.render('list', {
  //   day: first.list,
  //   list: first.item
  // });
  
});



app.listen(3000, function() {
  console.log("connected to port 3000");
});
