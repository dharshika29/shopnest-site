import twilio from 'twilio';
import User from '../models/User.js';

// @desc    Broadcast a message to users via WhatsApp
// @route   POST /api/whatsapp/broadcast
// @access  Private
const broadcastWhatsAppMessage = async (req, res, next) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886'; // Twilio Sandbox Number
    
    let client = null;
    if (accountSid && authToken) {
      client = twilio(accountSid, authToken);
    }

    const { receiverIds, message } = req.body;

    if (!receiverIds || receiverIds.length === 0 || !message) {
      return res.status(400).json({ message: 'Please provide receivers and message' });
    }

    // Fetch users to get their phone numbers
    const users = await User.find({ _id: { $in: receiverIds } });
    
    let successCount = 0;
    let failCount = 0;
    const logs = [];

    for (let user of users) {
      // If user doesn't have a phone number, skip
      if (!user.phoneNumber) {
        logs.push(`${user.name} does not have a phone number.`);
        failCount++;
        continue;
      }

      // Format phone number to E.164 format if not already
      let phone = user.phoneNumber;
      if (!phone.startsWith('+')) {
        // Default to Indian country code if no '+' is present (Can be customized)
        phone = '+91' + phone; 
      }

      try {
        if (client) {
          // Send Real WhatsApp Message using Twilio
          const response = await client.messages.create({
            body: message,
            from: `whatsapp:${fromWhatsAppNumber}`,
            to: `whatsapp:${phone}`
          });
          logs.push(`Successfully sent to ${user.name} (${phone}): SID ${response.sid}`);
          successCount++;
        } else {
          // Mock mode: Just log it
          logs.push(`MOCK MODE: Sent to ${user.name} (${phone}). Add Twilio keys to send for real.`);
          successCount++;
        }
      } catch (err) {
        console.error(`Failed to send to ${user.name}:`, err);
        logs.push(`Failed to send to ${user.name} (${phone}): ${err.message}`);
        failCount++;
      }
    }

    res.json({
      message: `WhatsApp Broadcast Completed: ${successCount} sent, ${failCount} failed.`,
      logs
    });
  } catch (error) {
    next(error);
  }
};

export { broadcastWhatsAppMessage };
