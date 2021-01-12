import {rules, schema} from "@ioc:Adonis/Core/Validator";

export default class SignUpsController {

  public async index({request}){
    const validated = await request.validate({
      schema: schema.create({
        name: schema.string(),
        email: schema.string({},[
          rules.email(),
          // rules.unique
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
      }
    })

    console.log(validated)

    return request.all()
  }

}
