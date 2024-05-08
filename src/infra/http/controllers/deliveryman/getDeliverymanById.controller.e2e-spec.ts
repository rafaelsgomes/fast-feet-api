import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { DeliverymanFactory } from 'test/factories/makeDeliveryman'
import { JwtService } from '@nestjs/jwt'

describe('Get Deliveryman (E2E)', () => {
  let app: INestApplication
  let deliverymanFactory: DeliverymanFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test(`[GET] /deliveryman/:deliverymanId`, async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman({
      document: '12345678900',
    })

    const accessToken = jwtService.sign({
      sub: deliveryman.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/deliveryman/${deliveryman.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      deliveryman: expect.objectContaining({
        document: '12345678900',
      }),
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
