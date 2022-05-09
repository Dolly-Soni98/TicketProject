const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const boolean = require('joi/lib/types/boolean');

/**
 * User Schema
 */
const UserTicketSchema = new mongoose.Schema({
    userId: {
    type: String,
    required: true
  },
  ticketId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
 UserTicketSchema.method({
});

/**
 * Statics
 */
 

/**
 * @typedef User
 */
module.exports = mongoose.model('UserTicket', UserTicketSchema);
