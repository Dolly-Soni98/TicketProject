const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const fs =require('fs');
var qr = require('qr-image');
const config = require('../../../config/config');
const User = require('../../models/user.model');
const Ticket = require('../../models/ticket.model');
const UserTicket = require('../../models/usersTicket.model');

function create(req, res, next) {
  const isExist =  User.findOne({email:req.body.email}).then(isExistuser=>{
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
      if (_.isEmpty(isExistuser))  {
                const user = new User(
                  {
                  fname: req.body.fname,
                  lname: req.body.lname,
                  email: req.body.email,
                  password: hash,
                  phone: req.body.phone,
                  Isadmin: req.body.Isadmin
                });
                 user.save()
                  .then(savedUser => res.json(savedUser))
                  .catch(e => next(e));
             }
         else{
                     res.status(400).json({
                       message: "This User Already Exist"
                     });
             }  
  }).catch(e => next(e)); 
}


function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}


const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email}).lean().exec();
  if (!_.isEmpty(user) && bcrypt.compareSync(password, user.password)) {
    const date = new Date();
    const payload = {
      id: String(user._id),
      userId: user.email,
      iat: date.getTime()
    }
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
    try {
        await User.findOneAndUpdate({ email: email },{$set:{token:token}}).exec();
      }catch (e) {
        console.error(e);
      }
        const returnObj = {
         accessToken: token
    }
      res.status(200).json(returnObj);
  } else {
    res.status(400).json({
      message: "MISMATCH"
    });
  }
}

const myTickets = async (req, res, next) => {
                let myinfo = await  User.findOne({"email":req.user.userId})   
               UserTicket.find({userId:myinfo.id}).lean().exec().then(doc => {
                  res.json(doc)})
                      .catch(err => {
                        res.status(400).json({
                          message: "Not found"
                        });
                      });   
}

 const PurchaseTickets = async (req, res, next) => {
  var myobj = { userId: req.body.userId, ticketId: req.body.ticketId};
 var purchaseticket = await UserTicket.findOne({ticketId: req.body.ticketId}).lean().exec();
 try {
       if (_.isEmpty(purchaseticket)) 
          {
                await UserTicket.create(myobj,function (err, resp) {
                    if (err){
                        console.log(err);
                    }
                    else{ 
                      let Ticketinfo =  Ticket.findOne({"_id":mongoose.Types.ObjectId(`${req.body.ticketId}`)},function(err,ticketcode){
                         let stringdata = ticketcode.code;
                          var qr_svg = qr.image(stringdata, { type: 'png' });
                          qr_svg.pipe(fs.createWriteStream(`server/TicketCode/ticket-${myobj.ticketId}.png`));
                            var svg_string = qr.imageSync(stringdata, { type: 'png' });  
                            res.status(200).json({message:"Ticket purchased"});
                      }).exec();
                    }
                  });
                }else
                {
                      res.status(400).json({
                        message: "This ticket already purchased"
                      });
                }
                }catch (e){
                res.status(400).json({
                  message: "This ticket already purchased"
                });
        }
 }

 const deleteTicket = async (req, res, next) => {
  myobj={ticketId: req.body.ticketId};
  var existticket = await UserTicket.findOne({ticketId: req.body.ticketId}).lean().exec();
        if (!_.isEmpty(existticket)) 
           {
                 let result= await UserTicket.remove({ticketId:req.body.ticketId});
                 console.log(result);
                 fs.unlinkSync(`server/TicketCode/ticket-${myobj.ticketId}.png`);
                      res.status(200).json({
                        message: "Ticket Deleted"
                      });
                }else
                 {
                       res.status(400).json({
                         message: "Ticket Not Exist"
                       });
                 }
                 
 }

 


module.exports = {create, list,login,myTickets,PurchaseTickets,deleteTicket };
