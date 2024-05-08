import { Admin } from '@/domain/fastFeet/enterprise/entities/admin'

export class AdminPresenter {
  static toHttp(admin: Admin) {
    return {
      id: admin.id,
      document: admin.document,
      name: admin.name,
      email: admin.email,
      createdAt: admin.createdAt,
    }
  }
}
