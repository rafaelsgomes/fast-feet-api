import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { AdminFactory } from 'test/factories/makeAdmin'
import { JwtService } from '@nestjs/jwt'

describe('Get Admin (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test(`[GET] /admin/document?document=12345678900`, async () => {
    const admin = await adminFactory.makePrismaAdmin({
      document: '12345678900',
    })

    const accessToken = jwtService.sign({
      sub: admin.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/admin/document`)
      .query({
        document: admin.document,
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      admin: expect.objectContaining({
        document: '12345678900',
      }),
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
