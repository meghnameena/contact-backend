const express = require("express");
const { Resend } = require("resend");

const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/", async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !phone || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const { data, error } = await resend.emails.send({
            from: "Contact Form <onboarding@resend.dev>",
            to: [process.env.OWNER_EMAIL],
            subject: `New Contact Form: ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>

                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Subject:</strong> ${subject}</p>

                <h3>Message</h3>
                <p>${message}</p>
            `
        });

        if (error) {
            console.error("Resend Error:", error);

            return res.status(500).json({
                success: false,
                message: "Email could not be sent",
                error: error.message
            });
        }

        res.status(200).json({
            success: true,
            message: "Message sent successfully",
            data
        });

    } catch (error) {
        console.error("Contact API Error:", error);

        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
});

module.exports = router;