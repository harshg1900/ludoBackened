const jwt = require("jsonwebtoken");
const { ApiUnathorizedError, ApiForbiddenError } = require("../errors");
const logger = require("../logger");
// const { UserAuthentication } = require("../models");
const { UserAuthentication, Permission } = require("../models");

const isVerifiedUser = async (req, res, next) => {
  try {
    let token =
      req.headers.authorization &&
      req.headers.authorization.match(/^Bearer (.*)$/);
    // console.log("here")
    if (token && token[1]) {
      token = token[1];
    }
    if (!token) {
      throw new ApiUnathorizedError(
        "AccessTokenError: Maybe the Bearer token is not present in the authorization header."
      );
    }

    const payload = await jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    console.log("RequestUser: ", payload);
    // const rslt = await UserAuthentication.findByPk(payload.uid);
    if (payload) {
      req.user = payload;
      console.log("req.user ", req.user);
      next();
      return;
    } else {
      throw new ApiUnathorizedError(
        "AccessTokenError: The token is invalid. Please generate new (Login again or verify email)"
      );
    }
  } catch (err) {
    next(new ApiUnathorizedError(err.message));
  }
};

const verifyRole = (...allowedUsers) => {
  return async (req, res, next) => {
    logger.info("allowedUsers", allowedUsers);
    logger.info("req.user.role", req.user.role);
    try {
      const result = allowedUsers.includes(req.user.role);
      if (!result)
        throw new ApiForbiddenError("You are Unathorized to user this route");
      next();
    } catch (err) {
      next(err);
    }
  };
};

const verifyPermission = (...requiredPermissions) => {
  return async (req, res, next) => {
    try {
      logger.debug("req_permission", requiredPermissions);
      const uid = req.user.uid;
      // if(uid == 1){
      //   next()
      //   return
      // }
      const permission = await Permission.findOne({
        where: {
          adminId: uid,
        },
      });
      logger.debug("permission", permission);
      requiredPermissions.map((checkperm) => {
        if (!permission[checkperm]) {
          throw new ApiUnathorizedError(
            "You dont't have permission to access this route"
          );
        }
      });
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = {
  isVerifiedUser,
  verifyRole,
  verifyPermission,
};
