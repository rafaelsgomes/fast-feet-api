import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { JwtService } from '@nestjs/jwt'
import { DatabaseModule } from '@/infra/database/database.module'
import { RecipientFactory } from 'test/factories/makeRecipient'
import { DeliveryFactory } from 'test/factories/makeDelivery'

describe('Get delivery by id (E2E)', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let deliveryFactory: DeliveryFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, DeliveryFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    recipientFactory = moduleRef.get(RecipientFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test(`[GET] /delivery/:deliveryId`, async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const delivery = await deliveryFactory.makePrismaDelivery({
      city: 'City 01',
      recipientId: recipient.id,
    })

    const accessToken = jwtService.sign({
      sub: recipient.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/delivery/${delivery.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      delivery: expect.objectContaining({
        city: 'City 01',
        recipient_id: recipient.id,
      }),
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
