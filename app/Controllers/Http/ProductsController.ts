import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'


export default class ProductsController {
  public async index ({}: HttpContextContract) {
    const product = await Product.all();
    return product
  }

  public async store ({ request, response }: HttpContextContract) {
    const data = await request.only(['name', 'description', 'price'])
    const alreadyExist = await Product.findBy('name', data.name)
    if(alreadyExist){
      return response.json({'Error': 'product already exist'})
    }
    const product = await Product.create(data)
    return product
  }

  public async show ({  }: HttpContextContract) {
    
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
