import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { DeliverymanFactory } from 'test/factories/makeDeliveryman'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma.service'

describe('Update Deliveryman (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let deliverymanFactory: DeliverymanFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test(`[PUT] /deliveryman/:deliverymanId`, async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman({
      document: '12345678900',
    })

    const accessToken = jwtService.sign({
      sub: deliveryman.id,
    })

    const response = await request(app.getHttpServer())
      .put(`/deliveryman/${deliveryman.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'john@doe.com',
      })

    expect(response.statusCode).toBe(204)

    const deliverymanOnDatabase = await prisma.user.findUnique({
      where: {
        id: deliveryman.id,
      },
    })

    expect(deliverymanOnDatabase.updatedAt).toBeTruthy()
    expect(deliverymanOnDatabase.email).toEqual('john@doe.com')
  })

  afterAll(async () => {
    await app.close()
  })
})
