const { Sequelize, DataTypes, Op } = require("sequelize");
const { ApiBadRequestError } = require("../errors");
const logger = require("../logger");

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,

   
  {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'mysql',
    logging: (msg) => console.log(msg),
    // dialectOptions: {
      //   ssl: "Amazon RDS",
      // },
    },
    
    );
    
    async function test() {
    
  try {
    await sequelize.authenticate();
    
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

test();


//const SendBird = require("@sendbird/chat");

module.exports = { sequelize, DataTypes, Op };
