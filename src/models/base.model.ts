export default abstract class BaseModel {
    toDTO<T>(excludeFields: string[] = []): T {
        const modelKeys = Object.keys(this)
        const result = modelKeys.reduce((acc: Record<string, any>, key: string) => {
            if (!excludeFields.includes(key)) {
                acc[key] = this[key]
            }
            return acc
        }, {})
        return result as T
    }

    get(fieldName: string): any {
        if (this.hasOwnProperty(fieldName)) {
            return this[fieldName]
        }
        return undefined
    }

    toString(): string {
        return JSON.stringify(this)
    }
}
