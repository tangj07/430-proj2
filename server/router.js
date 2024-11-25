const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // Account routes
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/getAccountUsernameType', mid.requiresLogin, controllers.Account.getAccountDetails);
  app.post('/changePass', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePass);

  // Recipe routes
  app.get('/dashboard', mid.requiresLogin, controllers.Recipe.recipePage);
  app.post('/makeRecipe', mid.requiresLogin, controllers.Recipe.makeRecipe);
  app.get('/getRecipes', mid.requiresLogin, controllers.Recipe.getRecipes);
  app.delete('/deleteRecipe/:id', mid.requiresLogin, controllers.Recipe.deleteRecipe);

  // Default route
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
