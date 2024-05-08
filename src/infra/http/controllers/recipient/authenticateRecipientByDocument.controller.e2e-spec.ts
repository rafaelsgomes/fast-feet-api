import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { RecipientFactory } from 'test/factories/makeRecipient'
import { hash } from 'bcryptjs'

describe('Authenticate recipient (E2E)', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    recipientFactory = moduleRef.get(RecipientFactory)

    await app.init()
  })

  test(`[POST] /recipient/sessions`, async () => {
    await recipientFactory.makePrismaRecipient({
      name: 'John Doe',
      email: 'john@doe.com',
      password: await hash('johnDoe123', 8),
      document: '12345678900',
    })

    const response = await request(app.getHttpServer())
      .post('/recipient/sessions')
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
