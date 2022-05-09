const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const User = require('../../models/user.model');
const Ticket = require('../../models/ticket.model');
const config = require('../../../config/config');
let ticketss = new Ticket;
/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((admin) => {
      req.admin = admin; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}
/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.admin);
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
  Admin.list({ limit, skip })
    .then(admin => res.json(admin))
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

function tickets(req, res, next) {
  console.log("Hello");
    
  const { initial, number } = req.body;
  const ticketData = [] 
 
   if( initial.toUpperCase() === 'MYTICKET' && typeof number === 'number'){
    for(let i = 1; i<=number; i++){
      let num = number.toString().split("").reverse().join("");
      let ilength=i.toString().length;
      let mytickets = '';
      let mylength=(num.length)-1;
     
      
      if(i>9 && mylength>=ilength)
      {
        mylength=mylength-1;
      }
      
      if(i>99 && ilength>=mylength) 
      {
        mylength=mylength-1;
      }
       for(let j=0;j<mylength;j++){ 
          mytickets=`${mytickets}${0}`; 
       } 
       if((ilength+mytickets.length)>num.length)
      {
        mylength=0;
        mytickets='';
      }
       
     
        ticketData.push({
          ticketno: i,
          code:`MYTICKET${mytickets}${i}`
        })
      
    }
    
  }   
         //if(number>=100)
        {
          //let allchunk=_.chunk(ticketData, 10);
           
           //for(let i=0;i<=allchunk.length;i++)
           {
           if(!_.isEmpty(ticketData)){
              Ticket.insertMany(ticketData)
              .then(ticketData => res.status(200).json({
                  data: ticketData,
                  message: "Ticket created successfully"
                }))
              .catch(e => next(e));  
          } else {
              /// err return
              const errCustom = new APIError('BAD REQUEST', httpStatus.BAD_REQUEST, true);
              next(e);
          } 
        }
      } 

         
        
  
}

 function login(req, res, next) {

  const docs = User.findOne({email:req.body.email,password:req.body.password,Isadmin:true}, function (err, users) {
  if (err){
        console.log("Mistmatch")
    }
    else{
      if (!_.isEmpty(users) && users.password) {
        if (req.body.email === users.email && req.body.password === users.password) {
          const token = jwt.sign({
            email: users.email
          }, config.jwtSecret);
          
          console.log(token);
          try{
            User.findOneAndUpdate({ email: users.email },{$set:{token:token}})
            .then(users => res.json(users.email))
            .catch(e => next(e));
          }catch(err)
          {
             console.log(err);
          }  
          
        }
      }else{
        res.status(400).json({
          message: "MISMATCH"
        });
      }  
         
    }
})
  .then(users1 => res.json({"accessToken":users1.token}))
  .catch(e => console.log(e));
  // const users =User.findOne({ email: req.body.email }).exec();
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity
  
}


function ShowTickets()
{
  const users = User.find({email:req.body.email,password:req.body.password}, function (err, docs) 
  {
    if (err){
        console.log("Mistmatch")
    }
    else{

    }

  });
}

module.exports = { load, get,  update, list, remove,tickets,login,ShowTickets };
