const generateRandomOtp = () => {
  let otp = Math.floor(100000 + Math.random() * 900000); // Generates a random number between 100000 and 999999
  if (['localhost'].includes(process.env.NODE_ENV)) {
    otp = 123456;
  }
  return otp;
};

export default generateRandomOtp;
