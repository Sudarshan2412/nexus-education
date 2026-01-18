import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

export const sendEnrollmentEmail = async (
    email: string,
    courseName: string,
) => {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY not found. Skipping email.");
        return;
    }

    await resend.emails.send({
        from: 'Nexus Education <onboarding@resend.dev>',
        to: email,
        subject: `Enrollment Confirmed: ${courseName}`,
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h1 style="color: #22d3ee;">Welcome to Nexus!</h1>
        <p>You have successfully enrolled in <strong>${courseName}</strong>.</p>
        <p>Start your learning journey now by visiting your dashboard.</p>
        <a href="${baseUrl}/dashboard" style="display: inline-block; padding: 10px 20px; background-color: #22d3ee; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666;">If you didn't enroll in this course, please contact support.</p>
      </div>
    `
    });
};

export const sendCompletionEmail = async (
    email: string,
    courseName: string,
) => {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY not found. Skipping email.");
        return;
    }

    await resend.emails.send({
        from: 'Nexus Education <onboarding@resend.dev>',
        to: email,
        subject: `Congratulations! Course Completed: ${courseName}`,
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h1 style="color: #22d3ee;">Great Job!</h1>
        <p>You have successfully completed <strong>${courseName}</strong>.</p>
        <p>Your certificate is now available for download in the course area.</p>
        <a href="${baseUrl}/courses" style="display: inline-block; padding: 10px 20px; background-color: #22d3ee; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold;">Browse More Courses</a>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666;">Keep learning and growing with Nexus Education.</p>
      </div>
    `
    });
};
