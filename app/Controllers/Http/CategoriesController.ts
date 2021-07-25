import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category';

export default class CategoriesController {

  public async index ({}: HttpContextContract) {
    const product = await Category.query()
    return product
  }

  public async store ({ request, response }: HttpContextContract) {
    const data = await request.only(['name'])
    const alreadyExist = await Category.findBy('name', data.name)

    if(alreadyExist){
      return response.json({'Error': 'category already exist'})
    }

    const product = await Category.create(data)
    return product
  }

  public async show ({ request, response }: HttpContextContract) {
    const { id } = await request.params()
    const product = await Category.findBy('id', id)

    if(!product){
      return response.json({'Error': 'category with this id not exist'})
    }

    return product
  }

  public async update ({ request, response }: HttpContextContract) {
    const { id } = await request.params()
    const data = await request.only(['name'])
    const product = await Category.findBy('id', id)

    if(!product){
      return response.json({'Error': 'category with this id not exist'})
    }

    product.merge(data)
    await product.save()
    return product
  }

  public async destroy ({ request, response }: HttpContextContract) {
    const { id } = await request.params()
    const product = await Category.findBy('id', id)

    if(!product){
      return response.json({'Error': 'category with this id not exist'})
    }

    product.delete()
    await product.save()
    return product
  }
}
