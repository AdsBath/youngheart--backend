"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTP = exports.generatePassword = exports.generateOTP = void 0;
const otp_generator_1 = __importDefault(require("otp-generator"));
const generateOTP = () => {
    // Generate OTP logic here
    const otp = otp_generator_1.default.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
    });
    return otp;
};
exports.generateOTP = generateOTP;
const generatePassword = () => {
    // Generate password logic here
    const password = otp_generator_1.default.generate(8, {
        upperCaseAlphabets: true,
        specialChars: false,
        lowerCaseAlphabets: true,
    });
    return password;
};
exports.generatePassword = generatePassword;
// Function to send OTP
const sendOTP = (phone, otp) => {
    // Send OTP logic here
    console.log(`OTP sent to ${phone}: ${otp}`);
};
exports.sendOTP = sendOTP;
