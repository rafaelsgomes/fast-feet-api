import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { RecipientFactory } from 'test/factories/makeRecipient'
import { JwtService } from '@nestjs/jwt'

describe('Get Recipient (E2E)', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    recipientFactory = moduleRef.get(RecipientFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test(`[GET] /recipient/:recipientId`, async () => {
    const recipient = await recipientFactory.makePrismaRecipient({
      document: '12345678900',
    })

    const accessToken = jwtService.sign({
      sub: recipient.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/recipient/${recipient.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      recipient: expect.objectContaining({
        document: '12345678900',
      }),
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
