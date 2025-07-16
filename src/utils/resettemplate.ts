export const resetTemplate = (password: string) => `
 <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      .email-container {
        background-color: #ffffff;
        margin: 30px auto;
        border-radius: 8px;
        overflow: hidden;
        padding: 20px;
        box-shadow: 0px 1px 25px rgba(0, 0, 0, 0.15);
      }
      .header {
        background-color: #4caf50;
        color: white;
        padding: 10px 0;
        text-align: center;
        border-radius: 4px;
        width: 50%;
        margin: auto;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
        text-align: center;
      }
      .content {
        padding: 20px 0;
        font-size: 16px;
        color: #333;
      }
      .content p {
        width: 50%;
        margin: auto;
      }
      .reset-button {
        background-color: #4caf50;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        text-align: center;
        width: 50%;
        margin: 50px auto;
      }
      .reset-button p {
        margin: 50px 0;
        color: #FFFFFF;
        font-size: 34px;
      }
      .footer {
        text-align: center;
        padding: 10px 0;
        font-size: 14px;
        color: #555;
        border-radius: 0 0 8px 8px;
      }
      .footer a {
        color: #3498db;
        text-decoration: none;
      }
      .footer a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="content">
        <p>Hello Sir/Ma'am,</p>
        <p>
          We received a request to reset your password for your account at
          <strong>Babu khushi</strong>.
        </p>

        <div class="reset-button">
          <p>${password}</p>
        </div>

        <p>Or you can copy and paste the your reset password</p>

        <p>
          This is your reset password. If you continue to have issues, feel free
          to contact us at
          <a href="mailto:babukhushi@gmail.com"
            >babukhuushi@gmail.com</a
          >.
        </p>
      </div>

      <div class="footer">
        <p>
          Thank you for being with us,<br />
          <strong>Babu khushi</strong>
        </p>
      </div>
    </div>
  </body>
</html>

  `;
