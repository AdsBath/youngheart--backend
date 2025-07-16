"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
function sendEmail(email, subject, text) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transporter = nodemailer_1.default.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: config_1.default.mail.user,
                    pass: config_1.default.mail.pass,
                },
            });
            const info = yield transporter.sendMail({
                from: `"Babukhusi" <${config_1.default.mail.user}>`,
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
        }
        catch (error) {
            console.error('Error sending email:', error);
            console.log({ error });
        }
    });
}
