import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { DeliverymanFactory } from 'test/factories/makeDeliveryman'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma.service'
import { AdminFactory } from 'test/factories/makeAdmin'
import { compare } from 'bcryptjs'

describe('Reset deliveryman password  (E2E)', () => {
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

  test(`[PATCH] /deliveryman/reset-password`, async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const deliveryman = await deliverymanFactory.makePrismaDeliveryman({
      document: '12345678900',
    })
    const accessToken = jwtService.sign({
      sub: admin.id,
    })

    const response = await request(app.getHttpServer())
      .patch('/deliveryman/reset-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        deliverymanId: deliveryman.id,
        password: 'johnDoe123',
      })

    expect(response.statusCode).toBe(204)

    const deliverymanOnDatabase = await prisma.user.findUnique({
      where: {
        id: deliveryman.id,
      },
    })

    const passwordIsValid = compare(
      'johnDoe123',
      deliverymanOnDatabase.password,
    )

    expect(deliverymanOnDatabase.updatedAt).toBeTruthy()
    expect(passwordIsValid).toBeTruthy()
  })

  afterAll(async () => {
    await app.close()
  })
})
