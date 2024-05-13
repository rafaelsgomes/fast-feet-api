import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { RecipientFactory } from 'test/factories/makeRecipient'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma.service'
import { AdminFactory } from 'test/factories/makeAdmin'
import { compare } from 'bcryptjs'

describe('Reset recipient password  (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let recipientFactory: RecipientFactory
  let adminFactory: AdminFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    recipientFactory = moduleRef.get(RecipientFactory)
    adminFactory = moduleRef.get(AdminFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test(`[PATCH] /recipient/reset-password`, async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const recipient = await recipientFactory.makePrismaRecipient({
      document: '12345678900',
    })
    const accessToken = jwtService.sign({
      sub: admin.id,
    })

    const response = await request(app.getHttpServer())
      .patch('/recipient/reset-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientId: recipient.id,
        password: 'johnDoe123',
      })

    expect(response.statusCode).toBe(204)

    const recipientOnDatabase = await prisma.user.findUnique({
      where: {
        id: recipient.id,
      },
    })

    const passwordIsValid = compare('johnDoe123', recipientOnDatabase.password)

    expect(recipientOnDatabase.updatedAt).toBeTruthy()
    expect(passwordIsValid).toBeTruthy()
  })

  afterAll(async () => {
    await app.close()
  })
})
