const Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      fname: Joi.string().required(),
      lname: Joi.string().required(),
      email: Joi.string().email(),
      phone: Joi.string().regex(/^[1-9][0-9]{9}$/).required(),
      password: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    }
  },
  
  createTicket: {
    body: {
      Code: Joi.string().required()
    }
  },
  createUserTicket: {
    body: {
      userId: Joi.string().required(),
      ticketId:Joi.string().required()
    }
  },
  
  

  // POST /api/auth/login
  login: {
    body: {
      email:  Joi.string().email(),
      password: Joi.string().required()
    }
  }
};
