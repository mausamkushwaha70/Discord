import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service:'gmail',
     auth:{
       user:process.env.GOOGLE_APP_USERNAME,
       pass:process.env.GOOGLE_APP_PASSWORD
}
})

transporter.verify((error) => {
	try {
		console.log("Eamil server is ready to send : message")
	} catch (error) {
		
		console.error('Email server connection failed:', error.message);
		return;
	};
});


export const sendEmail = async (to, subject, text, html) => {
	try {
		const info = await transporter.sendMail({
			from: `"DISCORD" <${process.env.GOOGLE_USER}>`,
			to,
			subject,
			text,
			html,
		});

		console.log('Message sent:', info.messageId);
	} catch (error) {
		console.error('Error sending email:', error.message);
		throw error;
	}
};
