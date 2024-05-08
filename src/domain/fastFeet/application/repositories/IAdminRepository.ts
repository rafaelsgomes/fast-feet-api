import { Admin } from '../../enterprise/entities/admin'

export abstract class IAdminRepository {
  abstract create(admin: Admin): Promise<void>
  abstract save(admin: Admin): Promise<void>
  abstract findByDocument(document: string): Promise<Admin | null>
  abstract findByEmail(email: string): Promise<Admin | null>
  abstract findById(adminId: string): Promise<Admin | null>
  abstract delete(adminId: string): Promise<void>
}
