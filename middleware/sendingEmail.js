const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID =
  "372692425442-12ur3e1st65qoq58ih8ib8a7pp8ftjv3.apps.googleusercontent.com";
const CLIENT_SECRET = "_mkEh-o_OyINdN5XgxFYKqti";
const REDIRECT_URL = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04cbHlkLVjwxtCgYIARAAGAQSNwF-L9Irj1Z_w0jNkPeJXvr8to_nau7DyVSIlU95cFSX9AdYxOOtg-zTjk4ZA2eKkLPUHxEd0s0";

const oAuth2client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);
oAuth2client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(email) {
  try {
    const accessToken = await oAuth2client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "cuongndgch18641@fpt.edu.vn",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOption = {
      from: "ARTICLE MANAGEMENT SYSTEM 🎡 <cuongndgch18641@fpt.edu.vn>",
      to: `${email}`,
      subject: "Hello from Gmail using API: You have receive a new submission",
      text: "You have receive a new submission",
      html: "<h3>You have receive a new submission from a student</h3>",
    };

    const result = await transport.sendMail(mailOption);
    return result;
  } catch (error) {
    return error;
  }
}

module.exports = sendMail;
