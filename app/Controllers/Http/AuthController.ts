import {rules, schema} from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";


export default class AuthController {

  public async index({request, response}){
    const validated = await request.validate({
      schema: schema.create({
        email: schema.string({},[
          rules.email(),
          rules.unique({ table: 'users', column: 'email' })
        ]),
        password: schema.string({},[
          rules.confirmed()
        ]),
      }),
      messages: {
        'name.required': 'Username is required to Sign up.',
        'email.required': 'Email is required to Sign up.',
        'password.required': 'Password is required to Sign up',
        'password.confirmed': 'Passwords do not match',
        'email.unique': 'Email already exists'
      }
    })

    const user = new User()
    user.name = validated.name
    user.username = 'test'
    user.email = validated.email
    user.password = validated.password

    await user.save();

    return response.redirect('/')
  }

}
