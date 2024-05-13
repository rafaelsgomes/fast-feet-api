export abstract class ValueObject<Props> {
  protected props: Props

  protected constructor(props: Props) {
    this.props = props
  }

  public equals(value: ValueObject<unknown>) {
    if (value === null || value === undefined || value.props === undefined) {
      return false
    }

    return JSON.stringify(value.props) === JSON.stringify(this.props)
  }
}
