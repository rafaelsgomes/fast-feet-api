import { AppModule } from '@/app.module'
import { DomainEvents } from '@/core/events/domainEvents'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/makeAttachment'
import { DeliveryFactory } from 'test/factories/makeDelivery'
import { DeliverymanFactory } from 'test/factories/makeDeliveryman'
import { RecipientFactory } from 'test/factories/makeRecipient'
import { waitFor } from 'test/utils/waitFor'

describe('On delivery pickup (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory
  let deliveryFactory: DeliveryFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        DeliverymanFactory,
        RecipientFactory,
        AttachmentFactory,
        DeliveryFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)

    jwtService = moduleRef.get(JwtService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when delivery is set as pickup', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()

    const recipient = await recipientFactory.makePrismaRecipient()
    const delivery = await deliveryFactory.makePrismaDelivery({
      recipientId: recipient.id,
      availableAt: new Date(),
    })

    const accessToken = jwtService.sign({ sub: deliveryman.id })

    await request(app.getHttpServer())
      .patch(`/delivery/${delivery.id}/pickup`)
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
