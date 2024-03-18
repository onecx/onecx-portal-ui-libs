export class ObjectUtils {
  public static resolveFieldData(data: any, field: any): any {
    if (data && field) {
      if (this.isFunction(field)) {
        return field(data)
      } else if (field.indexOf('.') == -1) {
        return data[field]
      } else {
        const fields: string[] = field.split('.')
        let value = data
        for (let i = 0, len = fields.length; i < len; ++i) {
          if (value == null) {
            return null
          }
          value = value[fields[i]]
        }
        return value
      }
    } else {
      return null
    }
  }

  public static isFunction(obj: any) {
    return !!(obj && obj.constructor && obj.call && obj.apply)
  }
}
