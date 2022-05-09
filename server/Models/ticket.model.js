const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const boolean = require('joi/lib/types/boolean');

/**
 * User Schema
 */
const TicketSchema = new mongoose.Schema({
  code: {
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
 TicketSchema.method({
});



/**
 * @typedef User
 */
module.exports = mongoose.model('Ticket', TicketSchema);
