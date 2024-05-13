import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { DeliverymanFactory } from 'test/factories/makeDeliveryman'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma.service'
import { AdminFactory } from 'test/factories/makeAdmin'

describe('Update Deliveryman All Info (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let deliverymanFactory: DeliverymanFactory
  let adminFactory: AdminFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    adminFactory = moduleRef.get(AdminFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test(`[PUT] /deliveryman/:deliverymanId/all`, async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()

    const accessToken = jwtService.sign({
      sub: admin.id,
    })

    const response = await request(app.getHttpServer())
      .put(`/deliveryman/${deliveryman.id}/all`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'john@doe.com',
        document: '12345678900',
      })

    expect(response.statusCode).toBe(204)

    const deliverymanOnDatabase = await prisma.user.findUnique({
      where: {
        id: deliveryman.id,
      },
    })

    expect(deliverymanOnDatabase.updatedAt).toBeTruthy()
    expect(deliverymanOnDatabase.email).toEqual('john@doe.com')
    expect(deliverymanOnDatabase.document).toEqual('12345678900')
  })

  afterAll(async () => {
    await app.close()
  })
})
