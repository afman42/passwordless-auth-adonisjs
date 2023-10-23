import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CheckIsLoggedIn {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    await auth.use("web").check();

    if (auth.use("web").isLoggedIn) {
      response.redirect("/");
    }

    await next();
  }
}
