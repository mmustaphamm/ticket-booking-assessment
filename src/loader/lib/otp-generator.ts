class OTP {
    generate(length: number) {
        try {
            if (Object.is('number', typeof length)) {
                let OTP = ''
                let date = new Date()
                let time = date.getTime()
                //Get the last five digit
                let digit = String(time).split('').reverse().join('').substring(0, length)
                OTP += digit
                return OTP
            }
            throw {
                name: 'ArgumentError : The argument provided for the length of the OTP is not a number',
                message: 'Kindly specify the length of the OTP using Number',
            }
        } catch (error: any) {
            let message = error.message
            return message
        }
    }
}

export default new OTP()
