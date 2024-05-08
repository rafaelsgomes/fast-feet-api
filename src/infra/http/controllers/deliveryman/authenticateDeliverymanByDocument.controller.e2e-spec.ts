import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { DeliverymanFactory } from 'test/factories/makeDeliveryman'
import { hash } from 'bcryptjs'

describe('Authenticate deliveryman (E2E)', () => {
  let app: INestApplication
  let deliverymanFactory: DeliverymanFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    deliverymanFactory = moduleRef.get(DeliverymanFactory)

    await app.init()
  })

  test(`[POST] /deliveryman/sessions`, async () => {
    await deliverymanFactory.makePrismaDeliveryman({
      name: 'John Doe',
      email: 'john@doe.com',
      password: await hash('johnDoe123', 8),
      document: '12345678900',
    })

    const response = await request(app.getHttpServer())
      .post('/deliveryman/sessions')
      .send({
        document: '12345678900',
        password: 'johnDoe123',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
