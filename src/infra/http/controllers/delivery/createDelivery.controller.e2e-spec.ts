import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma.service'
import { AppModule } from '@/app.module'
import { AdminFactory } from 'test/factories/makeAdmin'
import { JwtService } from '@nestjs/jwt'
import { DatabaseModule } from '@/infra/database/database.module'
import { RecipientFactory } from 'test/factories/makeRecipient'

describe('Create delivery (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let prisma: PrismaService
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwtService = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test(`[POST] /delivery`, async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const recipient = await recipientFactory.makePrismaRecipient()

    const accessToken = jwtService.sign({
      sub: admin.id,
    })

    const response = await request(app.getHttpServer())
      .post('/delivery')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        latitude: -23.5201136,
        longitude: -46.5258994,
        zipCode: '00000-000',
        address: 'Street 01',
        city: 'City 01',
        state: 'State 01',
        additionalAddressInformation: 'Apt. 01',
        recipientId: recipient.id,
      })

    expect(response.statusCode).toBe(201)

    const deliveryOnDatabase = await prisma.delivery.findFirst({
      where: {
        recipientId: recipient.id,
      },
    })

    expect(deliveryOnDatabase).toBeTruthy()
  })

  afterAll(async () => {
    await app.close()
  })
})
