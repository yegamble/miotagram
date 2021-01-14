import {rules, schema} from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";


export default class AuthController {

  public async signup({request, response}){
    const validated = await request.validate({
      schema: schema.create({
        email: schema.string({},[
          rules.email(),
          rules.unique({ table: 'users', column: 'email' })
        ]),
        password: schema.string({},[
          rules.confirmed(),
          rules.minLength(8)
        ]),
        username: schema.string({},[
          rules.unique({table: 'users', column: 'username' })
        ])
      }),
      messages: {
        'name.required': 'Name is required to Sign up.',
        'email.required': 'Email is required to Sign up.',
        'password.required': 'Password is required to Sign up',
        'password.confirmed': 'Passwords do not match',
        'email.unique': 'Email already exists',
        'username.required': 'Username is required to Sign up.',
        'username.unique': 'Username already exists.',
      }
    })

    const user = new User()
    user.name = validated.name
    user.username = validated.username
    user.email = validated.email
    user.password = validated.password

    await user.save();

    return response.redirect('/')
  }

  public async login({ request, auth, response }: HttpContextContract){
      const req = await request.validate({
        schema:schema.create({
          email: schema.string(),
          password: schema.string({},[
            rules.minLength(8)
          ])
        }),
        messages: {
          'email.required': 'Email or Username is required',
          'password.required': 'Password is required',
          'password.minLength': 'Password must be at least 8 characters',
        }
      })

    const email = req.email
    const password = req.password

    await auth.attempt(email, password)

    return response.redirect('/profile')
  }

  public async logout({auth, response}: HttpContextContract){
    await auth.logout()
    return response.redirect('/')

  }

}
