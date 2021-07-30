import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category';

export default class CategoriesController {

  public async index({ }: HttpContextContract) {
    // Listando as categorias juntamente com os produtos
    const category = await Category.query().preload('product')
    return category
  }

  public async store({ request, response }: HttpContextContract) {
    // Pegando o body do usuario
    const { name } = await request.body()
    // Vendo no banco se existe alguma categoria ja cadastrada com aquele nome
    const alreadyExist = await Category.findBy('name', name.trim())

    if (alreadyExist)
      // Respondendo para o usuario que aquela categoria ja existe
      return response.json({ 'Error': 'category already exist' })

    // Salvando no banco
    const category = await Category.create({name: name.trim()})
    return category
  }

  public async show({ request, response }: HttpContextContract) {
    // Pegando o id pelos parametros
    const { id } = await request.params()
    // Verificando se esse id ja existe
    const category = await Category.query().where('id', id).preload('product')
    // Se não existir é respondido com mensagem de erro
    if (!category)
      return response.json({ 'Error': 'category with this id not exist' })

    // Caso exista o id ele é mostrado ao usuario
    return category
  }

  public async update({ request, response }: HttpContextContract) {
    // Pegando id pelo parametro
    const { id } = await request.params()
    // Pegando o body
    const { name } = await request.body()
    // Verficando se aquele id existe
    const category = await Category.findBy('id', id)
    // Caso não exista é respondida com msg de erro
    if (!category)
      return response.json({ 'Error': 'category with this id not exist' })

    // Caso exista é alterada e salva no banco
    await category.merge({name: name.trim()})
    await category.save()
    return category
  }

  public async destroy({ request, response }: HttpContextContract) {
    const { id } = await request.params()
    const category = await Category.findBy('id', id)

    if (!category)
      return response.json({ 'Error': 'category with this id not exist' })

    await category.delete()
    await category.save()
    return category
  }
}
