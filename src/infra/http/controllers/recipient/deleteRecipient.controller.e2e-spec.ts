import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { RecipientFactory } from 'test/factories/makeRecipient'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma.service'

describe('Delete Recipient (E2E)', () => {
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

  test(`[DELETE] /admin/recipient`, async () => {
    const admin = await prisma.user.create({
      data: {
        document: '01234567899',
        name: 'John Doe',
        email: 'john@doe.com',
        password: 'johnDoe123456789',
        roles: ['ADMIN'],
      },
    })

    const recipient = await recipientFactory.makePrismaRecipient({
      document: '12345678900',
    })

    const accessToken = jwtService.sign({
      sub: admin.id,
    })

    const response = await request(app.getHttpServer())
      .delete(`/admin/recipient/${recipient.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const recipientOnDatabase = await prisma.user.findUnique({
      where: {
        id: recipient.id,
      },
    })

    expect(recipientOnDatabase).toBeNull()
  })

  afterAll(async () => {
    await app.close()
  })
})
