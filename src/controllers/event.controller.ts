import {
  Filter,
  FilterExcludingWhere,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, HttpErrors, param,
  patch, post,

  requestBody
} from '@loopback/rest';
import {Event} from '../models';
import {Email} from '../models/email.model';
import {EventRepository} from '../repositories';
var nodemailer = require("nodemailer")

export class EventController {
  constructor(
    @repository(EventRepository)
    public eventRepository: EventRepository,
  ) { }

  @post('/events', {
    responses: {
      '200': {
        description: 'Event model instance',
        content: {'application/json': {schema: getModelSchemaRef(Event)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Event, {
            title: 'NewEvent',
            exclude: ['id'],
          }),
        },
      },
    })
    event: Omit<Event, 'id'>,
  ): Promise<Event> {
    // Evitamos creacion a nombre de un usuario
    if (event['usereventId'])
      throw new HttpErrors.UnprocessableEntity('No debe enviar userID')
    return this.eventRepository.create(event);
  }

  // @get('/events/count', {
  //   responses: {
  //     '200': {
  //       description: 'Event model count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async count(
  //   @param.where(Event) where?: Where<Event>,
  // ): Promise<Count> {
  //   return this.eventRepository.count(where);
  // }

  @get('/events', {
    responses: {
      '200': {
        description: 'Array of Event model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Event, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Event) filter?: Filter<Event>,
  ): Promise<Event[]> {
    return this.eventRepository.find(filter);
  }

  // @patch('/events', {
  //   responses: {
  //     '200': {
  //       description: 'Event PATCH success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Event, {partial: true}),
  //       },
  //     },
  //   })
  //   event: Event,
  //   @param.where(Event) where?: Where<Event>,
  // ): Promise<Count> {
  //   return this.eventRepository.updateAll(event, where);
  // }

  @get('/events/{id}', {
    responses: {
      '200': {
        description: 'Event model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Event, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Event, {exclude: 'where'}) filter?: FilterExcludingWhere<Event>
  ): Promise<Event> {
    return this.eventRepository.findById(id, filter);
  }

  @patch('/events/{id}', {
    responses: {
      '204': {
        description: 'Event PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Event, {partial: true}),
        },
      },
    })
    event: Event,
  ): Promise<void> {
    await this.eventRepository.updateById(id, event);
  }

  // @put('/events/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'Event PUT success',
  //     },
  //   },
  // })
  // async replaceById(
  //   @param.path.string('id') id: string,
  //   @requestBody() event: Event,
  // ): Promise<void> {
  //   await this.eventRepository.replaceById(id, event);
  // }

  // @del('/events/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'Event DELETE success',
  //     },
  //   },
  // })
  // async deleteById(@param.path.string('id') id: string): Promise<void> {
  //   await this.eventRepository.deleteById(id);
  // }

  @post('/sendemail', {
    responses: {
      '200': {
        description: 'email'
      }
    }
  })
  sendEmail(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Email, {partial: true})
        }
      }
    })
    email: Email
  ) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mailtotestsomethings@gmail.com",
        pass: "iawbackend"
      }
    })

    var mailOptions = {
      from: "Meet-O-Matic <mailtotestsomethings@gmail.com>",
      to: email['recipients'],
      subject: "Invitacion a un evento",
      text: "Fuiste invitado a completar un formulario. Accedé desde " + email['eventurl'] + ". Contraseña: " + email['password'],
      html: "<h1>Fuiste invitado a completar un formulario</h1><p>Accedé desde <a href='" + email['eventurl'] + "'>acá</a></p><p>Contraseña: " + email['password'] + "</p>"
    }
    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.log('No se pudo enviar el mail')
      }
      else {
        console.log('Mail enviado correctamente')
      }
    })
  }
}
