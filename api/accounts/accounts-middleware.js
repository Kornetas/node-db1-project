const Account = require("./accounts-model");
const db = require("../../data/db-config");

exports.checkAccountPayload = (req, res, next) => {
  // DO YOUR MAGIC
  // Note: you can either write "manual" validation logic
  // or use the Yup library (not currently installed)
  const { name, budget } = req.body;
  if (name === undefined || budget === undefined) {
    return res.status(400).json({
      message: "name and budget are required",
    });
  }
  if (name.trim().length < 3 || name.trim().length > 100) {
    return res.status(400).json({
      message: "name of account must be between 3 and 100",
    });
  }
  if (typeof budget !== "number" || isNaN(budget)) {
    return res.status(400).json({
      message: "budget of account must be a number",
    });
  }
  if (budget < 0 || budget > 1000000) {
    return res.status(400).json({
      message: "budget of account is too large or too small",
    });
  }
  next();
};

exports.checkAccountNameUnique = async (req, res, next) => {
  // DO YOUR MAGIC
  try {
    const existing = await db("accounts")
      .where("name", req.body.name.trim())
      .first();
    if (existing) {
      next({ status: 400, message: "that name is taken" });
    } else {
      next();
    }
  } catch (err) {
    next();
  }
};

exports.checkAccountId = async (req, res, next) => {
  // DO YOUR MAGIC
  try {
    const account = await Account.getById(req.params.id);
    if (!account) {
      next({ status: 404, message: "account not found" });
    } else {
      req.account = account;
      next();
    }
  } catch (err) {
    next(err);
  }
};
