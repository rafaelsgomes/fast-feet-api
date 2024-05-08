import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { RecipientFactory } from 'test/factories/makeRecipient'
import { JwtService } from '@nestjs/jwt'
import { AdminFactory } from 'test/factories/makeAdmin'

describe('Get Recipient (E2E)', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let adminFactory: AdminFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test(`[GET] /admin/recipient/email?email=john@doe.com`, async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const recipient = await recipientFactory.makePrismaRecipient({
      email: 'john@doe.com',
    })

    const accessToken = jwtService.sign({
      sub: admin.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/admin/recipient/email`)
      .query({
        email: recipient.email,
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      recipient: expect.objectContaining({
        email: 'john@doe.com',
      }),
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
