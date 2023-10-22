import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";
import Mail from "@ioc:Adonis/Addons/Mail";
import Route from "@ioc:Adonis/Core/Route";

export default class AuthenticationController {
  async login({ view, request, auth, response }: HttpContextContract) {
    if (request.method() === "GET") {
      return view.render("auth/login");
    }
    if (request.method() === "POST") {
      const postSchema = schema.create({
        email: schema.string({ trim: true }, [
          rules.minLength(6),
          rules.email(),
        ]),
      });

      const payload = await request.validate({ schema: postSchema });

      const user = await User.query().where("email", payload.email).first();

      if (user) {
        const passwordUrl = Route.makeSignedUrl(
          "verifyEmail",
          {
            id: user.id,
          },
          {
            expiresIn: "1h",
          }
        );
        await Mail.send((message) => {
          message
            .from("info@example.com")
            .to(payload.email)
            .subject("Passwordless Auth")
            .htmlView("emails/passwordless", { route: passwordUrl });
        });
        response.redirect("/login");
      }
      if (!user) {
        return response.badRequest("Invalid Email");
      }
    }
  }

  async register({ view, request, response }: HttpContextContract) {
    if (request.method() === "GET") {
      return view.render("auth/register");
    }
    if (request.method() === "POST") {
      const postSchema = schema.create({
        email: schema.string({ trim: true }, [
          rules.minLength(10),
          rules.required(),
        ]),
        password: schema.string({ trim: true }, [rules.required()]),
      });

      const payload = await request.validate({ schema: postSchema });

      const user = new User();
      user.email = payload.email;
      user.password = payload.password;

      await user.save();

      if (user) {
        response.redirect("/login");
      }
    }
  }

  async logout({ auth, response }: HttpContextContract) {
    await auth.use("web").logout();
    response.redirect("/login");
  }

  async verifyEmail({ params, request, auth, response }: HttpContextContract) {
    const id = params.id;
    if (request.hasValidSignature()) {
      await auth.use("web").loginViaId(id);
      response.redirect("/");
      console.log("email as verified");
    }
    return "Signature is missing or URL was tampered.";
  }
}
