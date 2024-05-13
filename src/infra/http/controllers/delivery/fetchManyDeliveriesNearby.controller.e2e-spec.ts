import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { JwtService } from '@nestjs/jwt'
import { DatabaseModule } from '@/infra/database/database.module'
import { DeliverymanFactory } from 'test/factories/makeDeliveryman'
import { DeliveryFactory } from 'test/factories/makeDelivery'
import { RecipientFactory } from 'test/factories/makeRecipient'

describe('Fetch many deliveries nearby (E2E)', () => {
  let app: INestApplication
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory
  let deliveryFactory: DeliveryFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory, RecipientFactory, DeliveryFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test(`[GET] /delivery?latitude=-23.5201136&longitude=-46.5258994`, async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()

    Promise.all([
      await deliveryFactory.makePrismaDelivery({
        city: 'City 01',
        deliverymanId: deliveryman.id,
        recipientId: recipient.id,
        latitude: -23.5245591,
        longitude: -46.5204461,
      }),
      await deliveryFactory.makePrismaDelivery({
        city: 'City 02',
        deliverymanId: deliveryman.id,
        recipientId: recipient.id,
        latitude: -23.5245591,
        longitude: -46.5204461,
      }),
      await deliveryFactory.makePrismaDelivery({
        city: 'City 03',
        deliverymanId: deliveryman.id,
        recipientId: recipient.id,
        latitude: -23.4814063,
        longitude: -46.4153359,
      }),
    ])

    const accessToken = jwtService.sign({
      sub: deliveryman.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/delivery/near`)
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        latitude: -23.5229455,
        longitude: -46.5192529,
      })
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.deliveries).toHaveLength(2)
    expect(response.body).toEqual({
      deliveries: expect.arrayContaining([
        expect.objectContaining({
          city: 'City 01',
          deliveryman_id: deliveryman.id,
        }),
        expect.objectContaining({
          city: 'City 02',
          deliveryman_id: deliveryman.id,
        }),
      ]),
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
