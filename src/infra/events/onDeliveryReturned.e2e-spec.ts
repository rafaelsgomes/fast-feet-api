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
import { DeliveryFactory } from 'test/factories/makeDelivery'
import { RecipientFactory } from 'test/factories/makeRecipient'
import { waitFor } from 'test/utils/waitFor'

describe('On delivery returned (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let deliveryFactory: DeliveryFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AdminFactory,
        RecipientFactory,
        AttachmentFactory,
        DeliveryFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)

    jwtService = moduleRef.get(JwtService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when delivery is set as returned', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const recipient = await recipientFactory.makePrismaRecipient()
    const delivery = await deliveryFactory.makePrismaDelivery({
      recipientId: recipient.id,
    })

    const accessToken = jwtService.sign({ sub: admin.id })

    await request(app.getHttpServer())
      .patch(`/delivery/${delivery.id}/return`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

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
