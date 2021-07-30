import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import Category from 'App/Models/Category'

export default class ProductsController {
  public async index ({request, response}: HttpContextContract) {
    const { category_id } = request.params()
    const product = await Product.query().where('category_id', category_id)
    const categoryExist = await Category.findBy('id', category_id)

    if(!categoryExist)
      return response.json({'Error': 'category with this id not exist'})

    return product
  }

  public async store ({ request, response }: HttpContextContract) {
    const { name, description, price } = await request.body()
    const { category_id } = await request.params()
    const alreadyExist = await Product.findBy('name', name.trim())
    const categoryExist = await Category.findBy('id', category_id)

    if( price < 0 )
      return response.json({'Error': 'price cannot be negative'})

    if(!categoryExist)
      return response.json({'Error': 'category with this id not exist'})

    if(alreadyExist)
      return response.json({'Error': 'product already exist'})

    const product = await Product.create({ name: name.trim(), description: description.trim(), price, categoryId: category_id})
    return product
  }

  public async show ({ request, response }: HttpContextContract) {
    const { id, category_id } = await request.params()
    const product = await Product.findBy('id', id)
    const categoryExist = await Category.findBy('id', category_id)

    if (!categoryExist)
      return response.json({'Error': 'the category with this id not exist'})

    if(!product)
      return response.json({'Error': 'product with this id not exist'})

    return product
  }

  public async update ({ request, response }: HttpContextContract) {
    const { id, category_id } = await request.params()
    const { name, description, price} = await request.body()
    const product = await Product.findBy('id', id)
    const nameExist = await Product.findBy('name', name.trim())
    const categoryExist = await Category.findBy('id', category_id)

    if( price < 0 )
      return response.json({'Error': 'price cannot be negative'})

    if (!categoryExist)
      return response.json({'Error': 'the category with this id not exist'})

    if(!product)
      return response.json({'Error': 'product with this id not exist'})

    if(nameExist)
      return response.json({'Error': 'the product with this name already exist'})

    await product.merge({name: name, description: description.trim(), price})
    await product.save()
    return product
  }

  public async destroy ({ request, response }: HttpContextContract) {
    const { id, category_id } = await request.params()
    const product = await Product.findBy('id', id)
    const categoryExist = await Category.findBy('id', category_id)

    if (!categoryExist){
      return response.json({'Error': 'the category with this id not exist'})
    }
    if(!product){
      return response.json({'Error': 'product with this id not exist'})
    }

    product.delete()
    await product.save()
    return product
  }
}
