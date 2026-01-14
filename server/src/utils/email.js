import nodemailer from "nodemailer"
import crypto from "crypto"

export const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD

    },

});


export const generateEmailToken = () => {
    return crypto.randomBytes(20).toString("hex")

}

export const sendVerificationEmail = async(email , token) => {

    const verifyLink = `${process.env.CORS_ORIGIN}/verify-email?token=${token}`

    await transporter.sendMail({

         from: `"Testimonials" <${process.env.USER_EMAIL}>`,
    to: email,
    subject: "Verify your email",
    html: `
      <p>Thanks for submitting a testimonial!</p>
      <p>Please verify your email by clicking below:</p>
      <a href="${verifyLink}">Verify Email</a>
      <p> Plz submit within 5 mins .</p>
    `,
    })

}