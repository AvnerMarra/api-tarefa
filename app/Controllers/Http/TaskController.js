'use strict'

const Task = use('App/Models/Task')
const { validateAll } = use('Validator')

class TaskController {
    async index({ view }) {

        const tasks = await Task.all()

        return view.render('tasks', {
            title: 'Listas de tarefas',
            tasks: tasks.toJSON()
        })

    }

    async store({ request, response, session, auth }) {
        const {id} = auth.user
        const data = request.only("title", "body")

        
        const message = {
            'title.required': 'Este campo precisa ser preenchido',
            'body.required': 'Este campo precisa ser preenchido'
        }


        const task = new Task()

        task.title = request.input('title')
        task.body = request.input('body')

        await task.save()

        session.flash({ notification: 'Tarefa Adicionada!' })

        return response.redirect('/tasks')
    }

    async detail({ params, view }) {
        const task = await Task.find(params.id)

        return view.render('detail', {
            task: task
        })

    }

    async remove({ params, response, session }) {
        const task = await Task.find(params.id)
        await task.delete()
        session.flash({ notification: 'Tarefa deletada!' })

        return response.redirect('/tasks')


    }
}


module.exports = TaskController
