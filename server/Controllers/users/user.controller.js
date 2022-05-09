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




/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}


function create(req, res, next) {
  let newpassword='';
  const isExist =  User.findOne({email:req.body.email}, function (err, isExistuser) {
   //const hash = bcrypt.hashSync(req.body.password, 8);
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
   
   try {
      if (_.isEmpty(isExistuser)) 
      {

        
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
          }catch (e){
                     res.status(400).json({
                       message: "This User Already Exist"
                     });
             }
    
  }).lean().exec();
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.user;
  user.username = req.body.username;
  user.mobileNumber = req.body.mobileNumber;

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email}).lean().exec();
  bcrypt.compareSync(email, user.email);
  //const match = await bcrypt.compare(password, user.password)
  if (!_.isEmpty(user) && user.password) {
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
        console.error(e,"*********************");
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

const ShowTickets = async (req, res, next) => {
 // const user = await User.find({ email: email,password:password }).lean().exec();
        await Ticket.find(function (err, user) {
            if (err){
                console.log(err);
            }
            else{
                if (!_.isEmpty(user)) {
                  res.status(200).json(user);
                }
            }
        });
}

 const PurchaseTickets = async (req, res, next) => {
  var myobj = { userId: req.body.userId, ticketId: req.body.ticketId};
 var loginuser = await UserTicket.findOne({ticketId: req.body.ticketId}).lean().exec();
 try {
       if (_.isEmpty(loginuser)) 
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
                            res.status(200).json({message:"1 document inserted"});
                      }).exec();
                    }
                  });
                }else
                {
                      res.status(400).json({
                        message: "This User Already purchased"
                      });
                }
                }catch (e){
                res.status(400).json({
                  message: "This User Already purchase"
                });
        }
 }

 const deleteTicket = async (req, res, next) => {
  myobj={ticketId: req.body.ticketId};
  var existticket = await UserTicket.findOne({ticketId: req.body.ticketId}).lean().exec();
//  console.log(existticket);
   // try{
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
           /*  }catch (e){
              res.status(400).json({
                message: "This User Already purchase"
              });
      } */
                 
 }

 


module.exports = { load, get, create, update, list, remove,login,ShowTickets,PurchaseTickets,deleteTicket };
