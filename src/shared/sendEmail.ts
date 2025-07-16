import nodemailer from 'nodemailer';

import config from '../config';

export async function sendEmail(email: string, subject: string, text: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: config.mail.user,
        pass: config.mail.pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"Babukhusi" <${config.mail.user}>`,
      to: email,
      subject: `${subject} ✔`,
      text: text,
      html: `
           <!DOCTYPE html>
           <html lang="en">
           <head>
             <meta charset="UTF-8">
             <meta name="viewport" content="width=device-width, initial-scale=1.0">
             <title>Email Notification</title>
                      <style>
           /* Reset styles */
           body, html {
             margin: 0;
             padding: 0;
             font-family: Arial, sans-serif;
           }
           
           /* Container styles */
           .container {
             max-width: 1000px;
             margin: 20px auto;
             padding: 20px;
             border: 1px solid #ccc;
             border-radius: 5px;
             background-color: #f9f9f9;
             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
           }
   
           /* Header styles */
           .header {
             text-align: center;
             margin-bottom: 20px;
           }
   
           /* Content styles */
           .content {
             margin-bottom: 20px;
           }
   
           /* Footer styles */
           .footer {
             text-align: center;
             font-size: 12px;
             color: #666;
           }
         </style>
           </head>
            <body>
              <div class="container">
                <div class="content">
                 ${text}
                </div>
                <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} Admin Notification</p>
                </div>
              </div>
           </html>
         `,
    });
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    console.log({ error });
  }
}
