const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }
  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }
    req.session.account = Account.toAPI(account);
    return res.json({ redirect: '/dashboard' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }
  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/dashboard' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occurred!' });
  }
};

const getAccountDetails = async (req, res) => {
  try {
    const account = await Account.findById(req.session.account._id).lean();

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    return res.status(200).json({
      username: account.username,
      premium: account.premium,
      createdDate: account.createdDate,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Failed to fetch account details' });
  }
};

const changePass = async (req, res) => {
  const { pass, pass2 } = req.body;
  if (!pass || !pass2) return res.status(400).json({ error: 'All fields required' });
  if (pass !== pass2) return res.status(400).json({ error: 'Passwords must match' });

  try {
    const account = { _id: req.session.account._id };
    const hash = await Account.generateHash(pass);
    await Account.findOneAndUpdate(account, { $set: { password: hash } }).exec();
    return res.json({ message: 'Password updated' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'An error occurred' });
  }
};
const updatePremiumStatus = async (req, res) => {
  try {
    const { premium } = req.body; 
    const accountId = req.session.account._id;

    const account = await Account.findByIdAndUpdate(accountId, { premium }, { new: true }).lean();

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    return res.status(200).json({ premium: account.premium });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Failed to update premium status' });
  }
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  getAccountDetails,
  changePass,
  updatePremiumStatus,
};
