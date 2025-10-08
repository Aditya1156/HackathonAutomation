// Fix: Changed to a type-only import for better practice. The original error was due to an empty types.ts file.
import type { Team } from '../types';

// Use a randomized delay to feel more realistic
const getSimulatedDelay = () => 1000 + Math.random() * 1000;

/**
 * Simulates sending an email notification with registration details.
 * In a real application, this would use a service like SendGrid, Mailgun, etc.
 * @param team The team object containing leader's details.
 * @param password The generated password for the team.
 * @returns A promise that resolves when the "email" has been "sent".
 */
export const sendEmailNotification = (team: Team, password: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`
      ==================================================
      📧 [MOCK EMAIL SERVICE] - SUCCESS 📧
      --------------------------------------------------
      NOTE: This is a simulated email. In a real app, an email would be sent.
      To: ${team.leader.email}
      Subject: ✅ Welcome to Hackathon Fusion!

      Hello ${team.leader.name},

      Your team, "${team.name}", has been successfully registered!

      Here are your credentials to access the Student Dashboard:
      - Team ID: ${team.id}
      - Password: ${password}
      - Submission Ticket: ${team.submissionTicket}

      We're excited to see what you build!
      
      Best regards,
      The Hackathon Fusion Team
      ==================================================
      `);
      resolve();
    }, getSimulatedDelay());
  });
};

/**
 * Simulates sending a WhatsApp notification with registration details.
 * In a real application, this would use an API like Twilio for WhatsApp.
 * @param team The team object containing leader's details.
 * @param password The generated password for the team.
 * @returns A promise that resolves when the "message" has been "sent", or rejects if no contact number is provided.
 */
export const sendWhatsAppNotification = (team: Team, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!team.leader.contactNumber) {
            console.warn(`[MOCK WHATSAPP SERVICE] No contact number for team ${team.name}, skipping notification.`);
            // Reject because it's a failure condition the UI can act on
            reject(new Error('No contact number provided.'));
            return;
        }

        setTimeout(() => {
          console.log(`
          ==================================================
          📱 [MOCK WHATSAPP SERVICE] - SUCCESS 📱
          --------------------------------------------------
          NOTE: This is a simulated message. In a real app, a WhatsApp message would be sent.
          To: ${team.leader.contactNumber}

          Hey ${team.leader.name}! 👋 Your team "${team.name}" is registered for Hackathon Fusion!
          
          Login Details:
          Team ID: ${team.id}
          Password: ${password}
          Submission Ticket: ${team.submissionTicket}

          See you there! 🚀
          ==================================================
          `);
          resolve();
        }, getSimulatedDelay());
      });
}

/**
 * Simulates sending an SMS notification with registration details.
 * In a real application, this would use an API like Twilio.
 * @param team The team object containing leader's details.
 * @param password The generated password for the team.
 * @returns A promise that resolves when the "SMS" has been "sent", or rejects if no contact number is provided.
 */
export const sendSmsNotification = (team: Team, password: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!team.leader.contactNumber) {
      console.warn(`[MOCK SMS SERVICE] No contact number for team ${team.name}, skipping notification.`);
      reject(new Error('No contact number provided.'));
      return;
    }

    setTimeout(() => {
      console.log(`
      ==================================================
      💬 [MOCK SMS SERVICE] - SUCCESS 💬
      --------------------------------------------------
      NOTE: This is a simulated SMS.
      To: ${team.leader.contactNumber}

      Hello ${team.leader.name}! Your team "${team.name}" is registered for Hackathon Fusion. Team ID: ${team.id}, Password: ${password}, Ticket: ${team.submissionTicket}.
      ==================================================
      `);
      resolve();
    }, getSimulatedDelay());
  });
};