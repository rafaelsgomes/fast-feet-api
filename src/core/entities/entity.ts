import { randomUUID } from 'node:crypto'

export abstract class Entity<Props> {
  private _id: string
  protected props: Props

  get id() {
    return this._id
  }

  protected constructor(props: Props, id?: string) {
    this.props = props
    this._id = id ?? randomUUID()
  }

  public equals(entity: Entity<unknown>) {
    if (entity === this || entity.id === this._id) {
      return true
    }

    return false
  }
}
