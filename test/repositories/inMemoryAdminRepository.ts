import { IAdminRepository } from '@/domain/fastFeet/application/repositories/IAdminRepository'
import { Admin } from '@/domain/fastFeet/enterprise/entities/admin'

export class InMemoryAdminRepository implements IAdminRepository {
  public items: Admin[] = []

  async create(admin: Admin): Promise<void> {
    this.items.push(admin)
  }

  async save(admin: Admin): Promise<void> {
    const adminIndex = this.items.findIndex((item) => item.id === admin.id)

    this.items[adminIndex] = admin
  }

  async findByDocument(document: string): Promise<Admin> {
    const admin = this.items.find((item) => item.document === document)

    if (!admin) {
      return null
    }

    return admin
  }

  async findByEmail(email: string): Promise<Admin> {
    const admin = this.items.find((item) => item.email === email)

    if (!admin) {
      return null
    }

    return admin
  }

  async findById(adminId: string): Promise<Admin> {
    const admin = this.items.find((item) => item.id === adminId)

    if (!admin) {
      return null
    }

    return admin
  }

  async delete(adminId: string): Promise<void> {
    const adminIndex = this.items.findIndex((item) => item.id === adminId)

    this.items.splice(adminIndex, 1)
  }
}
