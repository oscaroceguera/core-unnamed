import { Card } from "@repo/ui/Card";

import { BtnSendEmail } from "./BtnSendEmail";

export function SendEmail() {
  return (
    <Card title="Send email with nodemailer" color="primary">
      <p className="py-5">Click the button to send a email</p>
      <BtnSendEmail />
    </Card>
  );
}
