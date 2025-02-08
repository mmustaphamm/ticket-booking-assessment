/* eslint-disable no-console */
export default class DateUtils {
    static now(): Date {
        return new Date()
    }

    static dateInSeconds(date: Date | string | number): number {
        if (!(date instanceof Date)) {
            date = new Date(date)
        }
        return Math.floor(date.getTime() / 1000)
    }

    static durationSince(
        date1: Date,
        date2: Date,
        unit: 'seconds' | 'minutes' | 'hours' | 'days' = 'seconds',
    ): number {
        const diffInMilliseconds = date2.getTime() - date1.getTime()

        switch (unit) {
            case 'seconds':
                return diffInMilliseconds / 1000
            case 'minutes':
                return diffInMilliseconds / (1000 * 60)
            case 'hours':
                return diffInMilliseconds / (1000 * 60 * 60)
            case 'days':
                return diffInMilliseconds / (1000 * 60 * 60 * 24)
            default:
                throw new Error(`Unsupported unit: ${unit}`)
        }
    }

    static nowInISOString(): string {
        return new Date().toISOString()
    }

    static toDate(str: string): Date {
        return new Date(str)
    }

    static toISOString(date: Date): string {
        return date.toISOString()
    }

    static add(
        date: Date | number,
        amount: number,
        unit: 'seconds' | 'minutes' | 'hours' | 'days',
    ): Date {
        const newDate = new Date(date)
        switch (unit) {
            case 'seconds':
                newDate.setSeconds(newDate.getSeconds() + amount)
                break
            case 'minutes':
                newDate.setMinutes(newDate.getMinutes() + amount)
                break
            case 'hours':
                newDate.setHours(newDate.getHours() + amount)
                break
            case 'days':
                newDate.setDate(newDate.getDate() + amount)
                break
        }
        return newDate
    }

    static subtract(
        date: Date | number,
        amount: number,
        unit: 'seconds' | 'minutes' | 'hours' | 'days',
    ): Date {
        return DateUtils.add(date, -amount, unit)
    }

    static yesterday(): Date {
        return DateUtils.subtract(DateUtils.now(), 1, 'days')
    }

    static tomorrow(): Date {
        return DateUtils.add(DateUtils.now(), 1, 'days')
    }

    static isToday(date: Date): boolean {
        const today = new Date()
        return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        )
    }

    static isAfter(date1: Date | number, date2: Date | number): boolean {
        if (date1 instanceof Date) {
            date1 = Math.floor(date1.getTime() / 1000)
        }
        if (date2 instanceof Date) {
            date2 = Math.floor(date2.getTime() / 1000)
        }
        return date1 > date2
    }

    static currentDate() {
        const currentDate = new Date()

        const year = currentDate.getFullYear()
        // Months are zero-based, so we add 1 to get the correct month
        const month = String(currentDate.getMonth() + 1).padStart(2, '0')
        const day = String(currentDate.getDate()).padStart(2, '0')

        // Form the date string in the desired format
        const formattedDate = `${year}-${month}-${day}`

        console.log(formattedDate) // Output: e.g., 2024-05-13

        return formattedDate
    }
}
