import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/types/optional'
import { Role } from './role.enum'

export interface AdminProps {
  document: string
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt?: Date | null
  roles: Role[]
}

export class Admin extends Entity<AdminProps> {
  get document() {
    return this.props.document
  }

  set setNewDocument(document: string) {
    this.props.document = document
    this.touch()
  }

  get name() {
    return this.props.name
  }

  set setNewName(name: string) {
    this.props.name = name
    this.touch()
  }

  get email() {
    return this.props.email
  }

  set setNewEmail(email: string) {
    this.props.email = email
    this.touch()
  }

  get password() {
    return this.props.password
  }

  set setNewPassword(hash: string) {
    this.props.password = hash
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get roles() {
    return this.props.roles
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<AdminProps, 'createdAt' | 'roles'>,
    id?: string,
  ) {
    const admin = new Admin(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        roles: props.roles ?? [Role.ADMIN],
      },
      id,
    )

    return admin
  }
}
