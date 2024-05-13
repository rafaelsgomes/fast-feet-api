import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { DeliverymanFactory } from 'test/factories/makeDeliveryman'
import { JwtService } from '@nestjs/jwt'
import { AdminFactory } from 'test/factories/makeAdmin'

describe('Get Deliveryman (E2E)', () => {
  let app: INestApplication
  let deliverymanFactory: DeliverymanFactory
  let adminFactory: AdminFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test(`[GET] /deliveryman/email?email=john@doe.com`, async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const deliveryman = await deliverymanFactory.makePrismaDeliveryman({
      email: 'john@doe.com',
    })

    const accessToken = jwtService.sign({
      sub: admin.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/deliveryman/email`)
      .query({
        email: deliveryman.email,
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      deliveryman: expect.objectContaining({
        email: 'john@doe.com',
      }),
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
