import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { RecipientFactory } from 'test/factories/makeRecipient'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma.service'

describe('Update Recipient (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let recipientFactory: RecipientFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test(`[PUT] /recipient/:recipientId`, async () => {
    const recipient = await recipientFactory.makePrismaRecipient({
      document: '12345678900',
    })

    const accessToken = jwtService.sign({
      sub: recipient.id,
    })

    const response = await request(app.getHttpServer())
      .put(`/recipient/${recipient.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'john@doe.com',
      })

    expect(response.statusCode).toBe(204)

    const recipientOnDatabase = await prisma.user.findUnique({
      where: {
        id: recipient.id,
      },
    })

    expect(recipientOnDatabase.updatedAt).toBeTruthy()
    expect(recipientOnDatabase.email).toEqual('john@doe.com')
  })

  afterAll(async () => {
    await app.close()
  })
})
