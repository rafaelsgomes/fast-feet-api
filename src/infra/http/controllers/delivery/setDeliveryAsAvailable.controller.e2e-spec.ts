import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { JwtService } from '@nestjs/jwt'
import { DatabaseModule } from '@/infra/database/database.module'
import { RecipientFactory } from 'test/factories/makeRecipient'
import { DeliveryFactory } from 'test/factories/makeDelivery'
import { AdminFactory } from 'test/factories/makeAdmin'
import { PrismaService } from '@/infra/database/prisma.service'

describe('Set delivery as available (E2E)', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let adminFactory: AdminFactory
  let deliveryFactory: DeliveryFactory
  let prisma: PrismaService
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, DeliveryFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    recipientFactory = moduleRef.get(RecipientFactory)
    adminFactory = moduleRef.get(AdminFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    jwtService = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test(`[PATCH] /delivery/:deliveryId/available`, async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const recipient = await recipientFactory.makePrismaRecipient()
    const delivery = await deliveryFactory.makePrismaDelivery({
      recipientId: recipient.id,
    })

    const accessToken = jwtService.sign({
      sub: admin.id,
    })

    const response = await request(app.getHttpServer())
      .patch(`/delivery/${delivery.id}/available`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)
    const deliveryOnDatabase = await prisma.delivery.findUnique({
      where: {
        id: delivery.id,
      },
    })

    expect(deliveryOnDatabase.availableAt).toEqual(expect.any(Date))
    expect(deliveryOnDatabase.updatedAt).toEqual(expect.any(Date))
  })

  afterAll(async () => {
    await app.close()
  })
})
