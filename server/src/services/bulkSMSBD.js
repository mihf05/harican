import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

class BulkSMSBDService {
  constructor() {
    this.apiKey = process.env.BULKSMSBD_API_KEY
    this.senderId = process.env.BULKSMSBD_SENDER_ID
    this.baseUrl = process.env.BULKSMSBD_URL
  }

  async sendSMS(phoneNumber, message) {
    try {
      // Format phone number to BD format if needed
      const formattedNumber = this.formatPhoneNumber(phoneNumber)
      
      const url = `${this.baseUrl}?api_key=${this.apiKey}&type=text&number=${formattedNumber}&senderid=${this.senderId}&message=${encodeURIComponent(message)}`
      
      const response = await axios.get(url)
      
      // Check response for success/error codes
      const result = response.data
      
      if (result == '202') {
        return { success: true, message: 'SMS sent successfully' }
      } else {
        const errorMessage = this.getErrorMessage(result)
        return { success: false, message: errorMessage, code: result }
      }
    } catch (error) {
      console.error('BulkSMSBD Error:', error)
      return { success: false, message: 'Failed to send SMS', error: error.message }
    }
  }

  async sendOTP(phoneNumber, otp) {
    const message = `Your Career Roadmap verification code is: ${otp}. This code will expire in 5 minutes. Do not share this code with anyone.`
    return this.sendSMS(phoneNumber, message)
  }

  formatPhoneNumber(phoneNumber) {
    // Remove any spaces, dashes, or plus signs
    let formatted = phoneNumber.replace(/[\s\-\+]/g, '')
    
    // If it starts with 0, replace with 880
    if (formatted.startsWith('0')) {
      formatted = '88' + formatted
    }
    // If it doesn't start with 88, add 88
    else if (!formatted.startsWith('88')) {
      formatted = '88' + formatted
    }
    
    return formatted
  }

  getErrorMessage(code) {
    const errorCodes = {
      '1001': 'Invalid Number',
      '1002': 'Sender ID not correct/sender ID is disabled',
      '1003': 'Please Required all fields/Contact Your System Administrator',
      '1005': 'Internal Error',
      '1006': 'Balance Validity Not Available',
      '1007': 'Balance Insufficient',
      '1011': 'User Id not found',
      '1012': 'Masking SMS must be sent in Bengali',
      '1013': 'Sender Id has not found Gateway by api key',
      '1014': 'Sender Type Name not found using this sender by api key',
      '1015': 'Sender Id has not found Any Valid Gateway by api key',
      '1016': 'Sender Type Name Active Price Info not found by this sender id',
      '1017': 'Sender Type Name Price Info not found by this sender id',
      '1018': 'The Owner of this (username) Account is disabled',
      '1019': 'The (sender type name) Price of this (username) Account is disabled',
      '1020': 'The parent of this account is not found.',
      '1021': 'The parent active (sender type name) price of this account is not found.',
      '1031': 'Your Account Not Verified, Please Contact Administrator.',
      '1032': 'IP Not whitelisted'
    }
    
    return errorCodes[code] || `Unknown error (Code: ${code})`
  }

  async getBalance() {
    try {
      const url = `http://bulksmsbd.net/api/getBalanceApi?api_key=${this.apiKey}`
      const response = await axios.get(url)
      return { success: true, balance: response.data }
    } catch (error) {
      console.error('Balance check error:', error)
      return { success: false, message: 'Failed to check balance' }
    }
  }
}

export const bulkSMSBDService = new BulkSMSBDService()
export default bulkSMSBDService
