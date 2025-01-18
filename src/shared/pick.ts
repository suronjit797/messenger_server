const pic = <T extends object, K extends keyof T>(obj: T, keys: K[]): Partial<T> => {
  const findObject: Partial<T> = {}

  for (const key of keys) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
      findObject[key] = obj[key]
    }
  }
  return findObject
}

export default pic
