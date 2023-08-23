const {
  Api404Error,
  ApiUnathorizedError,
  ApiBadRequestError,
} = require("../errors");
const { Admin } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userAuthServices = require("./userAuthServices");
const { sequelize, Op } = require("../config/db");
class adminServices {
  async login(email, password) {
    const admin = await Admin.findOne({
      where: {
        email: email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (!admin) {
      throw new Api404Error("No account found with this email");
    }
    const salt = await bcrypt.genSaltSync(10);
    // logger.debug("user",user)
    // logger.debug(password,user.password)
    const verified = await bcrypt.compare(password, admin.password);

    // const verified = password == admin.password;
    if (verified) {
      const adminWithoutPassword = { ...admin.toJSON() };
      delete adminWithoutPassword.password;
      return {
        token: await userAuthServices.getAccessToken({
          uid: admin.id,
          role: "admin",
        }),
        user: adminWithoutPassword,
      };
    } else {
      throw new ApiUnathorizedError(
        "Given email/password combination is invalid"
      );
    }
  }

  async createAdmin(phone, email, name, username, password) {
    let admin = await Admin.findOne({
      where: {
        [Op.or]: [
          {
            phone,
          },
          {
            email,
          },
          {
            name,
          },
          {
            username,
          },
        ],
      },
    });
    if (admin) {
      let errorFields = [];

      if (admin.phone === phone) errorFields.push("phone");
      if (admin.email === email) errorFields.push("email");
      if (admin.name === name) errorFields.push("name");
      if (admin.username === username) errorFields.push("username");

      let errorMessage = `A admin already exists with the following field(s): ${errorFields.join(
        ", "
      )}`;
      throw new ApiBadRequestError(errorMessage);
    } 
    const salt = await bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, salt);
    admin = await Admin.create({
      phone, email, name, username, password
    })
    return admin;
    
  }
}

module.exports = new adminServices();
