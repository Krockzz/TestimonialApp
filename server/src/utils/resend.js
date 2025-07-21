import { Resend} from "resend";

// console.log("Resend API Key:", process.env.RESEND_API_KEY); 
// console.log("Recipient Email:", to);


const resend  = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, html) => {
    try {
        await resend.emails.send({
            from: "noreply@ichigo.resend.dev",
            to,
            subject,
            html,
        });

        

        console.log(`✅ Email sent to ${to}`);
        return true;
    } catch (error) {
        console.error("❌ Error sending email:", error);
        return false;
    }
};