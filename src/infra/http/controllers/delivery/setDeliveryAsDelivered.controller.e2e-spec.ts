import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { JwtService } from '@nestjs/jwt'
import { DatabaseModule } from '@/infra/database/database.module'
import { RecipientFactory } from 'test/factories/makeRecipient'
import { DeliveryFactory } from 'test/factories/makeDelivery'
import { DeliverymanFactory } from 'test/factories/makeDeliveryman'
import { PrismaService } from '@/infra/database/prisma.service'
import { AttachmentFactory } from 'test/factories/makeAttachment'

describe('Set delivery as delivered (E2E)', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let deliverymanFactory: DeliverymanFactory
  let deliveryFactory: DeliveryFactory
  let attachmentFactory: AttachmentFactory
  let prisma: PrismaService
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        RecipientFactory,
        DeliveryFactory,
        DeliverymanFactory,
        AttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    recipientFactory = moduleRef.get(RecipientFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    jwtService = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test(`[PATCH] /delivery/:deliveryId/delivered`, async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()
    const recipient = await recipientFactory.makePrismaRecipient()
    const delivery = await deliveryFactory.makePrismaDelivery({
      recipientId: recipient.id,
      deliverymanId: deliveryman.id,
    })

    const attachments = Promise.all([
      await attachmentFactory.makePrismaAttachment(),
      await attachmentFactory.makePrismaAttachment(),
    ])

    const accessToken = jwtService.sign({
      sub: deliveryman.id,
    })

    const response = await request(app.getHttpServer())
      .patch(`/delivery/${delivery.id}/delivered`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        attachments: (await attachments).map((attachment) => attachment.id),
      })

    expect(response.statusCode).toBe(204)
    const deliveryOnDatabase = await prisma.delivery.findUnique({
      where: {
        id: delivery.id,
      },
    })

    expect(deliveryOnDatabase.deliveredAt).toEqual(expect.any(Date))
    expect(deliveryOnDatabase.updatedAt).toEqual(expect.any(Date))
  })

  afterAll(async () => {
    await app.close()
  })
})
