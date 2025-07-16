import otpGenerator from 'otp-generator';

export const generateOTP = () => {
  // Generate OTP logic here
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  return otp;
};

export const generatePassword = () => {
  // Generate password logic here
  const password = otpGenerator.generate(8, {
    upperCaseAlphabets: true,
    specialChars: false,
    lowerCaseAlphabets: true,
  });
  return password;
};

// Function to send OTP
export const sendOTP = (phone: string, otp: any) => {
  // Send OTP logic here
  console.log(`OTP sent to ${phone}: ${otp}`);
};
