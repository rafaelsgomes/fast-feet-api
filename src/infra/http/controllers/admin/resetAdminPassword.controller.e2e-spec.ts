import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { AdminFactory } from 'test/factories/makeAdmin'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma.service'

describe('Reset admin password  (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
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
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test(`[PATCH] /admin/admin/reset-password`, async () => {
    const admin = await prisma.user.create({
      data: {
        document: '01234567899',
        name: 'John Doe',
        email: 'john@doe.com',
        password: 'johnDoe123456789',
        roles: ['ADMIN'],
      },
    })

    const admin2 = await adminFactory.makePrismaAdmin({
      document: '12345678900',
    })
    const accessToken = jwtService.sign({
      sub: admin2.id,
    })

    const response = await request(app.getHttpServer())
      .patch('/admin/admin/reset-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        adminId: admin.id,
        password: 'johnDoe123',
      })

    expect(response.statusCode).toBe(204)

    const adminOnDatabase = await prisma.user.findUnique({
      where: {
        id: admin.id,
      },
    })

    expect(adminOnDatabase.updatedAt).toBeTruthy()
  })

  afterAll(async () => {
    await app.close()
  })
})
