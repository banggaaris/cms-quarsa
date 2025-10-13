# Google reCAPTCHA Setup Guide

This application now includes Google reCAPTCHA v2 protection on the admin login page to prevent automated bots and brute force attacks.

## 🔧 Setup Instructions

### 1. Get Google reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create)
2. Sign in with your Google account
3. Fill in the form:
   - **Label**: PT Quasar Capital Admin Panel
   - **reCAPTCHA type**: reCAPTCHA v2 ("I'm not a robot" Checkbox)
   - **Domains**:
     - `localhost` (for development)
     - `yourdomain.com` (for production)
     - `www.yourdomain.com` (for production)
4. Accept the terms of service
5. Click **Submit**

### 2. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Add your reCAPTCHA keys to your `.env` file:
```env
# Google reCAPTCHA Configuration
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
VITE_RECAPTCHA_ENABLED=true
```

### 3. Development vs Production

**Development**: Uses Google's test site key by default, so reCAPTCHA will work out of the box.

**Production**: Replace `VITE_RECAPTCHA_SITE_KEY` with your actual production site key.

## 🛡️ Security Features

- **Bot Prevention**: Blocks automated login attempts
- **Token Validation**: Verifies reCAPTCHA tokens before allowing login
- **Automatic Reset**: Resets reCAPTCHA on login failures
- **Expiration Handling**: Handles expired reCAPTCHA tokens gracefully
- **Configurable**: Can be enabled/disabled via environment variables

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_RECAPTCHA_SITE_KEY` | Your Google reCAPTCHA site key | Google test key |
| `VITE_RECAPTCHA_ENABLED` | Enable/disable reCAPTCHA | `true` |

### Disabling reCAPTCHA (for testing)

Set `VITE_RECAPTCHA_ENABLED=false` in your `.env` file to disable reCAPTCHA.

## 🧪 Testing

### Development Testing
The application uses Google's test site key, so reCAPTCHA will work immediately without additional setup.

### Production Testing
1. Deploy to your production domain
2. Ensure your domain is registered in Google reCAPTCHA console
3. Test the login functionality

## 🔍 Troubleshooting

### "reCAPTCHA expired" error
- Solution: User needs to complete the reCAPTCHA again
- This happens automatically when the token expires (2 minutes)

### "Please complete the reCAPTCHA verification" error
- Solution: User must check the "I'm not a robot" box
- This validation happens before login attempts

### reCAPTCHA not showing
- Check that `VITE_RECAPTCHA_ENABLED=true`
- Verify your site key is correct
- Ensure your domain is registered in Google reCAPTCHA console

### Invalid domain error
- Make sure your domain is added to the reCAPTCHA console
- For local development, ensure `localhost` is in your allowed domains

## 📝 Important Notes

- The reCAPTCHA token expires after 2 minutes
- Tokens are automatically reset on login failures
- The test key (`6LeIxAcTAAAAAJcZVRqyHh71UMIEbUjQ3JbP9PUb`) should only be used for development
- Always use your production site key in production environments