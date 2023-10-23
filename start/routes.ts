/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async ({ view, auth }) => {
  const email = auth.user?.email;
  return view.render("getMe", { email });
}).middleware("auth");

Route.get("/login", "AuthenticationController.login").middleware(
  "checkIsNotLoggedIn"
);
Route.get("/register", "AuthenticationController.register").middleware(
  "checkIsNotLoggedIn"
);
Route.get("/verify/:id", "AuthenticationController.verifyEmail").as(
  "verifyEmail"
);

Route.post("/login", "AuthenticationController.login").middleware(
  "checkIsNotLoggedIn"
);
Route.post("/register", "AuthenticationController.register").middleware(
  "checkIsNotLoggedIn"
);
Route.post("/logout", "AuthenticationController.logout");
