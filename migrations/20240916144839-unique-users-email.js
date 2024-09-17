'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   queryInterface.addConstraint("Users", {
    fields: ["email"],
    type: "unique",
    name : "users_email_ukey"
   })
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeConstraint("Users", "users_email_ukey")
  }
};
