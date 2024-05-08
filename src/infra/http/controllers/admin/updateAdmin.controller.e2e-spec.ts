import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { AdminFactory } from 'test/factories/makeAdmin'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma.service'

describe('Update Admin (E2E)', () => {
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

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test(`[PUT] /admin/:adminId`, async () => {
    const admin = await adminFactory.makePrismaAdmin({
      document: '12345678900',
    })

    const accessToken = jwtService.sign({
      sub: admin.id,
    })

    const response = await request(app.getHttpServer())
      .put(`/admin/${admin.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'john@doe.com',
      })

    expect(response.statusCode).toBe(204)

    const adminOnDatabase = await prisma.user.findUnique({
      where: {
        id: admin.id,
      },
    })

    expect(adminOnDatabase.updatedAt).toBeTruthy()
    expect(adminOnDatabase.email).toEqual('john@doe.com')
  })

  afterAll(async () => {
    await app.close()
  })
})
