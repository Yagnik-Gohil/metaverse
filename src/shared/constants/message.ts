export const CONSTANT = {
  DEFAULT: 'Your request is successfully executed',
  SIGN_UP: 'Signup Successful',
  LOGIN: 'Login Successful',
  LOGOUT: 'Logout Successful',
  RECORD_CREATED: (record: string) => `${record} created Successfully`,
  RECORD_UPDATED: (record: string) => `${record} Updated Successfully`,
  RECORD_DELETED: (record: string) => `${record} Deleted Successfully`,
  RECORD_FOUND: (record: string) => `${record} Found Successfully`,
  RECORD_NOT_FOUND: (record: string) => `${record} Not Found`,
  METHOD_NOT_ALLOWED: 'Method Not Allowed.',
  MAIL_NOT_SEND: 'Mail not send for this configuration',
  ALREADY_EXISTS: (record: string) => `${record} Already Exists`,
  OTP_VERIFICATION: 'Your Metaverse Verification OTP',
  VERIFY_OTP_SENT_TO: (email: string) =>
    `An OTP has been sent to ${email}. Please check your inbox.`,
  INVALID_OTP: 'Invalid OTP!',
  WRONG_CREDENTIALS: 'Wrong credentials!',
  COMPLETE_VERIFICATION:
    'OTP Sent to your email, Please complete Signup OTP verification',
  ACCOUNT_BLOCKED: 'Your account is blocked by admin',
};
