import {rules, schema} from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import {ifError} from "assert";


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
      }),
      messages: {
        'name.required': 'Username is required to Sign up.',
        'email.required': 'Email is required to Sign up.',
        'password.required': 'Password is required to Sign up',
        'password.confirmed': 'Passwords do not match',
        'email.unique': 'Email already exists'
      }
    }).catch(ifError)

    const user = new User()
    user.name = validated.name
    user.username = 'test'
    user.email = validated.email
    user.password = validated.password

    await user.save();

    return response.redirect('/')
  }

  public async login({ request }: HttpContextContract){
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

     let user = await User.findBy('email',req.email)

    if(user == null){
       user = await User.findByOrFail("username",req.email)
    }

    return user
  }

}
