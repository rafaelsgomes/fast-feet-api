import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma.service'
import { AppModule } from '@/app.module'
import { AdminFactory } from 'test/factories/makeAdmin'
import { JwtService } from '@nestjs/jwt'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Register admin (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let prisma: PrismaService
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    jwtService = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test(`[POST] /admin/register`, async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = jwtService.sign({
      sub: admin.id,
    })

    const response = await request(app.getHttpServer())
      .post('/admin/register')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        email: 'john@doe.com',
        password: 'johnDoe123',
        document: '12345678900',
      })

    expect(response.statusCode).toBe(201)

    const adminOnDatabase = await prisma.user.findUnique({
      where: {
        document: '12345678900',
      },
    })

    expect(adminOnDatabase).toBeTruthy()
  })

  afterAll(async () => {
    await app.close()
  })
})
