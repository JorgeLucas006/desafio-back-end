import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category';

export default class CategoriesController {

  public async index ({}: HttpContextContract) {
    // Listando as categorias juntamente com os produtos
    const product = await Category.query().preload('product')
    return product
  }

  public async store ({ request, response }: HttpContextContract) {
    // Pegando o body do usuario
    const data = await request.only(['name'])
    // Vendo no banco se existe alguma categoria ja cadastrada com aquele nome
    const alreadyExist = await Category.findBy('name', data.name)

    if(alreadyExist){
      // Respondendo para o usuario que aquela categoria ja existe 
      return response.json({'Error': 'category already exist'})
    }
    // Salvando no banco
    const product = await Category.create(data)
    return product
  }

  public async show ({ request, response }: HttpContextContract) {
    // Pegando o id pelos parametros
    const { id } = await request.params()
    // Verificando se esse id ja existe
    const product = await Category.findBy('id', id)

    // Se não existir é respondido com mensagem de erro
    if(!product){
      return response.json({'Error': 'category with this id not exist'})
    }
    // Caso exista o id ele é mostrado ao usuario
    return product
  }

  public async update ({ request, response }: HttpContextContract) {
    // Pegando id pelo parametro
    const { id } = await request.params()
    // Pegando o body
    const data = await request.only(['name'])
    // Verficando se aquele id existe
    const product = await Category.findBy('id', id)
    // Caso não exista é respondida com msg de erro
    if(!product){
      return response.json({'Error': 'category with this id not exist'})
    }
    // Caso exista é alterada e salva no banco
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
