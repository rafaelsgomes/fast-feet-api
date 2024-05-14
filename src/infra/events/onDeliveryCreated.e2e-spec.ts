import { AppModule } from '@/app.module'
import { DomainEvents } from '@/core/events/domainEvents'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/makeAdmin'
import { AttachmentFactory } from 'test/factories/makeAttachment'
import { RecipientFactory } from 'test/factories/makeRecipient'
import { waitFor } from 'test/utils/waitFor'

describe('On delivery created (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)

    jwtService = moduleRef.get(JwtService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when delivery is created', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const recipient = await recipientFactory.makePrismaRecipient()

    const accessToken = jwtService.sign({ sub: admin.id })

    await request(app.getHttpServer())
      .post('/delivery')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        latitude: -23.5201136,
        longitude: -46.5258994,
        zipCode: '00000-000',
        address: 'Street 01',
        city: 'City 01',
        state: 'State 01',
        additionalAddressInformation: 'Apt. 01',
        recipientId: recipient.id,
      })

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: recipient.id,
        },
      })

      expect(notificationOnDatabase).toBeTruthy()
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
