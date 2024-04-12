const nodemailer=require("nodemailer")
module.exports.sendConfirmationEmail = async (email) => {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'boodyahmed825@gmail.com',
            pass: 'wvzi twzq sfuj gqqt'
        }
    });

    // Send confirmation email
    const mailOptions = {
        from: 'boodyahmed825@gmail.com',
        to: email,
        subject: 'Welcome to Our App',
        text: 'Thank you for signing up! Your account has been successfully created.'
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent successfully');
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
};
