// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'



import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Application from "@ioc:Adonis/Core/Application";

export default class PostController {

  // public async index () {
  //
  //   Route.get('/posts', async ({ view }) => {
  //     return view.render('posts/index')
  //   })
  //   return [{ id: 1, username: 'virk' }]
  // }

  public async index ({ view }: HttpContextContract) {


    //replace with posts from user
    const posts = [
      {
        id: 1,
        title: 'Getting Started with AdonisJS',
        body: '',
      },
      {
        id: 2,
        title: 'Covering Basics of Lucid ORM',
        body: '',
      },
      {
        id: 3,
        title: 'Understanding Build Process',
        body: '',
      }
    ]

    return view.render('posts/newsfeed', { posts })
  }

  public async store({request}: HttpContextContract) {
      const data = request.only(['title', 'body'])
      console.log(data)

    const image = request.file('image')
    console.log(image)
    if (!image) {
      return 'Please upload file'
    }

    await image.move(Application.tmpPath('uploads'))

    return 'File uploaded successfully'

      return data
    }
}
