'use strict'

const Task = use('App/Models/Task')
const { validateAll} = use('Validator')

class TaskController {
   async index({view}) {
    
    const tasks = await Task.all()

    return view.render('tasks', {
        title:'Listas de tarefas',
        tasks: tasks.toJSON()
    })
    
  }

  async store ({request, response, session}) {
      const message ={
          'title.required':'Este campo precisa ser preenchido',
          'body.required': 'Este campo precisa ser preenchido'
      }
    
    const validation = await validateAll(request.all(), {
        title: 'required|min:5|max140',
        body: 'required|min:10|'
        }, message)

    if (validation.fails()){
        session.withErrors(validation.messages()).flashAll()
        return response.redirect('back')
    }
    const task = new Task()

    task.title = request.input('title')
    task.body = request.input('body')
    
    await task.save()

    session.flash({notification: 'Tarefa Adicionada!'})

    return response.redirect('/tasks')
  }
  
async detail ({params, view}){
    const task = await Task.find(params.id)
    
    return view.render('detail', {
        task: task
    })
    
    } 
}


module.exports = TaskController
