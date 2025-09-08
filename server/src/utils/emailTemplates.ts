export const getPasswordResetTemplate = (url: string) => ({
	subject: "درخواست بازنشانی رمز عبور",
	text: `شما درخواست بازنشانی رمز عبور داده‌اید. برای بازنشانی رمز عبور خود روی لینک زیر کلیک کنید: ${url}`,
	html: `<!doctype html><html lang="fa" dir="rtl"><head>
  <meta charset="UTF-8" />
  <title>قالب ایمیل بازنشانی رمز عبور</title>
  <meta name="description" content="قالب ایمیل بازنشانی رمز عبور." />
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap');
    body { font-family: 'Vazirmatn', sans-serif; direction: rtl; }
    a:hover { text-decoration: underline !important; }
  </style>
</head><body style="margin: 0; background-color: #f2f3f8;">
  <table width="100%" bgcolor="#f2f3f8" style="font-family: 'Vazirmatn', sans-serif;">
    <tr><td>
      <table width="670" align="center" bgcolor="#fff" style="border-radius: 8px; box-shadow: 0 6px 18px rgba(0,0,0,.06); text-align: center;">
        <tr><td style="padding: 40px;">
          <h1 style="color:#1e1e2d; font-size:28px;">درخواست بازنشانی رمز عبور</h1>
          <p style="color:#455056; font-size:16px; line-height:28px; margin-top:20px;">
            لینک منحصربه‌فردی برای بازنشانی رمز عبور شما ایجاد شده است. برای ادامه، روی دکمه زیر کلیک کنید.
          </p>
          <a href="${url}" target="_blank" style="display:inline-block; margin-top:30px; padding:12px 30px; background:#2f89ff; color:#fff; border-radius:50px; text-decoration:none; font-weight:bold;">
            بازنشانی رمز عبور
          </a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
});

export const getVerifyEmailTemplate = (url: string) => ({
	subject: "تأیید آدرس ایمیل",
	text: `برای تأیید آدرس ایمیل خود روی لینک زیر کلیک کنید: ${url}`,
	html: `<!doctype html><html lang="fa" dir="rtl"><head>
  <meta charset="UTF-8" />
  <title>قالب ایمیل تأیید آدرس ایمیل</title>
  <meta name="description" content="قالب ایمیل تأیید آدرس ایمیل." />
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap');
    body { font-family: 'Vazirmatn', sans-serif; direction: rtl; }
    a:hover { text-decoration: underline !important; }
  </style>
</head><body style="margin: 0; background-color: #f2f3f8;">
  <table width="100%" bgcolor="#f2f3f8" style="font-family: 'Vazirmatn', sans-serif;">
    <tr><td>
      <table width="670" align="center" bgcolor="#fff" style="border-radius: 8px; box-shadow: 0 6px 18px rgba(0,0,0,.06); text-align: center;">
        <tr><td style="padding: 40px;">
          <h1 style="color:#1e1e2d; font-size:28px;">لطفاً آدرس ایمیل خود را تأیید کنید</h1>
          <p style="color:#455056; font-size:16px; line-height:28px; margin-top:20px;">
            برای تأیید ایمیل خود، روی دکمه زیر کلیک کنید.
          </p>
          <a href="${url}" target="_blank" style="display:inline-block; margin-top:30px; padding:12px 30px; background:#2f89ff; color:#fff; border-radius:50px; text-decoration:none; font-weight:bold;">
            تأیید ایمیل
          </a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
});
