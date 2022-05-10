const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const User = require('../../models/user.model');
const Ticket = require('../../models/ticket.model');
const config = require('../../../config/config');


/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(admin => res.json(admin))
    .catch(e => next(e));
}


function tickets(req, res, next) {
    
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

function login(req, res, next) {
  const docs = User.findOne({email: req.body.email, Isadmin: true })
    .then(user => {
        if (!_.isEmpty(user) && bcrypt.compareSync(req.body.password, user.password)) {
            const token = jwt.sign({ email: user.email}, config.jwtSecret,{ expiresIn: '1h' });
            if(token){
                User.findOneAndUpdate({ email: user.email }, { $set: { token: token } }, { new: true })
                .then(updated_user => res.json({"Token":updated_user.token}))
                .catch(e => next(e));
            }
        }else{
            res.status(400).json({ message: "MISMATCH" });
        } 
    })
    .catch(e => next(e)); 
}


module.exports = {list,tickets,login};
