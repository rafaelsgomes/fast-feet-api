import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { AdminFactory } from 'test/factories/makeAdmin'
import { hash } from 'bcryptjs'

describe('Authenticate admin (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test(`[POST] /admin/sessions`, async () => {
    await adminFactory.makePrismaAdmin({
      name: 'John Doe',
      email: 'john@doe.com',
      password: await hash('johnDoe123', 8),
      document: '12345678900',
    })

    const response = await request(app.getHttpServer())
      .post('/admin/sessions')
      .send({
        document: '12345678900',
        password: 'johnDoe123',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
