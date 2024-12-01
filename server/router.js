const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // Account routes
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/getAccountDetails', mid.requiresLogin, controllers.Account.getAccountDetails);
  app.post('/changePass', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePass);
  app.post('/updatePremiumStatus', mid.requiresSecure, mid.requiresLogin, controllers.Account.updatePremiumStatus);
  // Recipe routes
  app.get('/dashboard', mid.requiresLogin, controllers.Recipe.recipePage);
  app.post('/makeRecipe', mid.requiresLogin, controllers.Recipe.makeRecipe);
  app.get('/getRecipes', mid.requiresLogin, controllers.Recipe.getRecipes);
  app.delete('/deleteRecipe/:id', mid.requiresLogin, controllers.Recipe.deleteRecipe);

  // Default route
  app.get('/', (req, res) => {
    if (req.session && req.session.user) {
      return res.redirect('/dashboard');
    }
    return res.redirect('/login');
  });
};

module.exports = router;
