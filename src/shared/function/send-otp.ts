import { MESSAGE } from '../constants/constant';
import { renderFile } from 'ejs';
import { join } from 'path';
import { EmailService } from '../services/email-service';
import { User } from 'src/modules/user/entities/user.entity';

const sendOtp = async (user: User, otp: number) => {
  const emailService = new EmailService();

  const ejsTemplate = await renderFile(
    join(__dirname + '/../../../shared/ejs-templates/verification-otp.ejs'),
    {
      name: user.name,
      minutes: 10,
      otp: otp,
    },
  );
  await emailService.sendMail({
    to: user.email,
    subject: MESSAGE.OTP_VERIFICATION,
    html: ejsTemplate,
  });
  return otp;
};

export default sendOtp;
