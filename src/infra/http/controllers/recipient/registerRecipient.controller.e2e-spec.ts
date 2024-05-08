import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma.service'
import { AppModule } from '@/app.module'

describe('Register recipient (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test(`[POST] /recipient/register`, async () => {
    const response = await request(app.getHttpServer())
      .post('/recipient/register')
      .send({
        name: 'John Doe',
        email: 'john@doe.com',
        password: 'johnDoe123',
        document: '12345678900',
      })

    expect(response.statusCode).toBe(201)

    const recipientOnDatabase = await prisma.user.findUnique({
      where: {
        document: '12345678900',
      },
    })

    expect(recipientOnDatabase).toBeTruthy()
  })

  afterAll(async () => {
    await app.close()
  })
})
