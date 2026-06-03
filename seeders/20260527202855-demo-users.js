'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Carlos Mendoza',
        email: 'carlos@mail.com',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laura Gómez',
        email: 'laura@mail.com',
        role: 'client',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    // Revierte el sembrado borrando los registros creados
    await queryInterface.bulkDelete('Users', null, {});
  }
};