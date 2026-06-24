/**
 * SMS Provider Architecture for Supabase Auth OTP Verification & Production Fallbacks.
 * Supports Twilio and MSG91 with automated failover handling.
 */

export interface SMSProvider {
  name: string;
  sendSMS(to: string, message: string, otp?: string): Promise<boolean>;
}

export interface SMSProviderConfig {
  twilio: {
    accountSid?: string;
    authToken?: string;
    fromNumber?: string;
  };
  msg91: {
    authKey?: string;
    senderId?: string;
    templateId?: string;
  };
  primaryProvider: 'twilio' | 'msg91';
}

// Get configuration from environment variables
const proc = (globalThis as any).process;
const config: SMSProviderConfig = {
  twilio: {
    accountSid: proc?.env?.TWILIO_ACCOUNT_SID,
    authToken: proc?.env?.TWILIO_AUTH_TOKEN,
    fromNumber: proc?.env?.TWILIO_FROM_NUMBER,
  },
  msg91: {
    authKey: proc?.env?.MSG91_AUTH_KEY,
    senderId: proc?.env?.MSG91_SENDER_ID || 'EVENTO',
    templateId: proc?.env?.MSG91_OTP_TEMPLATE_ID,
  },
  primaryProvider: (proc?.env?.PRIMARY_SMS_PROVIDER as 'twilio' | 'msg91') || 'twilio',
};

/**
 * Twilio SMS Provider Implementation using Twilio REST API
 */
export class TwilioProvider implements SMSProvider {
  name = 'Twilio';

  async sendSMS(to: string, message: string): Promise<boolean> {
    const { accountSid, authToken, fromNumber } = config.twilio;

    if (!accountSid || !authToken || !fromNumber) {
      console.warn('Twilio configuration missing. Skipping Twilio provider.');
      return false;
    }

    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const params = new URLSearchParams({
        To: to,
        From: fromNumber,
        Body: message,
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`Twilio API Error (${response.status}):`, errorData);
        return false;
      }

      const data = await response.json();
      console.log(`Twilio message sent successfully. SID: ${data.sid}`);
      return true;
    } catch (error) {
      console.error('Exception in TwilioProvider sendSMS:', error);
      return false;
    }
  }
}

/**
 * MSG91 SMS Provider Implementation using MSG91 REST API
 */
export class MSG91Provider implements SMSProvider {
  name = 'MSG91';

  async sendSMS(to: string, message: string, otp?: string): Promise<boolean> {
    const { authKey, senderId, templateId } = config.msg91;

    if (!authKey) {
      console.warn('MSG91 configuration missing (authKey). Skipping MSG91 provider.');
      return false;
    }

    try {
      // Clean phone number (remove '+' if present as MSG91 expects country code + number without +)
      const cleanPhone = to.replace(/^\+/, '');

      // If OTP and Template ID are provided, use MSG91 OTP API
      if (otp && templateId) {
        const url = `https://api.msg91.com/api/v5/otp?template_id=${templateId}&mobile=${cleanPhone}&otp=${otp}&authkey=${authKey}`;
        const response = await fetch(url, { method: 'POST' });

        if (!response.ok) {
          const errorData = await response.text();
          console.error(`MSG91 OTP API Error (${response.status}):`, errorData);
          return false;
        }

        console.log('MSG91 OTP sent successfully.');
        return true;
      }

      // Otherwise, use generic SMS Send API (V5 Flow / SMS)
      const url = 'https://api.msg91.com/api/v5/flow/';
      const payload = {
        sender: senderId,
        mobiles: cleanPhone,
        var1: message,
        // Fallback flow/template ID if needed, or default payload structure
        template_id: templateId || ((globalThis as any).process?.env?.MSG91_DEFAULT_FLOW_ID),
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authkey: authKey,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`MSG91 Flow API Error (${response.status}):`, errorData);
        return false;
      }

      console.log('MSG91 SMS sent successfully.');
      return true;
    } catch (error) {
      console.error('Exception in MSG91Provider sendSMS:', error);
      return false;
    }
  }
}

/**
 * Fallback SMS Manager that coordinates primary and backup providers
 */
export class SMSManager {
  private primary: SMSProvider;
  private backup: SMSProvider;

  constructor() {
    const twilio = new TwilioProvider();
    const msg91 = new MSG91Provider();

    if (config.primaryProvider === 'msg91') {
      this.primary = msg91;
      this.backup = twilio;
    } else {
      this.primary = twilio;
      this.backup = msg91;
    }
  }

  /**
   * Sends an SMS/OTP using the primary provider, automatically falling back to the backup provider upon failure.
   * @param to Phone number with country code (e.g., +1234567890)
   * @param message Full message body text
   * @param otp Optional exact OTP string (useful for MSG91 template matching)
   * @returns Promise resolving to true if sent successfully by any provider, false otherwise
   */
  async sendVerificationOTP(to: string, message: string, otp?: string): Promise<boolean> {
    console.log(`Attempting to send SMS to ${to} using primary provider: ${this.primary.name}`);
    const primarySuccess = await this.primary.sendSMS(to, message, otp);

    if (primarySuccess) {
      return true;
    }

    console.warn(`Primary provider (${this.primary.name}) failed. Initiating fallback to backup provider: ${this.backup.name}`);
    const backupSuccess = await this.backup.sendSMS(to, message, otp);

    if (backupSuccess) {
      console.log(`Backup provider (${this.backup.name}) sent SMS successfully.`);
      return true;
    }

    console.error('Both primary and backup SMS providers failed to send the message.');
    return false;
  }
}

// Export a singleton instance for ease of use across the application
export const smsManager = new SMSManager();
