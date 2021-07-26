import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'


export default class ProductsController {
  public async index ({}: HttpContextContract) {
    const product = await Product.query();
    return product
  }

  public async store ({ request, response }: HttpContextContract) {
    const { name, description, price } = await request.body()
    const { category_id } = await request.params()
    const alreadyExist = await Product.findBy('name', name)

    if(alreadyExist){
      return response.json({'Error': 'product already exist'})
    }

    const product = await Product.create({ name, description, price, categoryId: category_id})
    return product
  }

  public async show ({ request, response }: HttpContextContract) {
    const { id } = await request.params()
    const product = await Product.findBy('id', id)

    if(!product){
      return response.json({'Error': 'product with this id not exist'})
    }

    return product
  }

  public async update ({ request, response }: HttpContextContract) {
    const { id } = await request.params()
    const data = await request.only(['name', 'description', 'price'])
    const product = await Product.findBy('id', id)

    if(!product){
      return response.json({'Error': 'product with this id not exist'})
    }

    product.merge(data)
    await product.save()
    return product
  }

  public async destroy ({ request, response }: HttpContextContract) {
    const { id } = await request.params()
    const product = await Product.findBy('id', id)

    if(!product){
      return response.json({'Error': 'product with this id not exist'})
    }

    product.delete()
    await product.save()
    return product
  }
}
