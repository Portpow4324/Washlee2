# ngrok Setup Guide for Washlee

**Date**: January 30, 2026  
**Purpose**: Expose local development server to the internet for testing webhooks, API integrations, and mobile app development

---

## What is ngrok?

ngrok creates a secure tunnel from your local machine to the public internet. This allows you to:
- Test webhooks (Stripe, SendGrid, etc.) locally
- Test mobile app integration with your backend
- Share development environment with team members
- Test on real devices without deploying to production
- Expose localhost to external services

**Example:**
```
Your Local: http://localhost:3000
Public URL: https://abc123def456.ngrok.io
```

---

## Installation

### Option 1: Using Homebrew (macOS)
```bash
brew install ngrok/ngrok/ngrok
```

### Option 2: Download from Website
1. Go to [ngrok.com](https://ngrok.com)
2. Sign up for free account
3. Download for macOS
4. Extract and add to PATH

### Verify Installation
```bash
ngrok version
```

---

## Authentication Setup

### Step 1: Create ngrok Account
1. Go to [ngrok.com/sign-up](https://ngrok.com/sign-up)
2. Create free account (or sign in)
3. Go to Dashboard → Your Authtoken
4. Copy the auth token

### Step 2: Add Auth Token to ngrok
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

Verify it worked:
```bash
cat ~/.ngrok2/ngrok.yml
```

---

## Basic Usage

### Start ngrok Tunnel
```bash
# Expose port 3000 (your Next.js dev server)
ngrok http 3000
```

**Output:**
```
ngrok                                       (Ctrl+C to quit)

Session Status                online
Account                       yourname@email.com
Version                        3.x.x
Region                         us (United States)
Latency                        45ms
Web Interface                  http://127.0.0.1:4040

Forwarding                     https://abc123def456.ngrok.io -> http://localhost:3000
```

Copy the **Forwarding URL**: `https://abc123def456.ngrok.io`

### Test It Works
1. Open terminal
2. Run `npm run dev` (in another terminal)
3. Run `ngrok http 3000`
4. Visit the ngrok URL in browser
5. Should see your Washlee app! ✅

---

## Configuration File

Create or edit `~/.ngrok2/ngrok.yml`:

```yaml
authtoken: YOUR_AUTH_TOKEN
version: "2"
tunnels:
  washlee:
    proto: http
    addr: 3000
    bind-tls: true
    # Optional: custom domain (paid feature)
    # domain: yourdomain.ngrok.io
```

### Start with Config
```bash
ngrok start washlee
```

---

## Using ngrok in Your App

### 1. Get Your ngrok URL
Run ngrok and note the Forwarding URL:
```
https://abc123def456.ngrok.io
```

### 2. Update Environment Variables

Create `.env.local.ngrok`:
```env
# Base URLs
NEXT_PUBLIC_APP_URL=https://abc123def456.ngrok.io
NEXT_PUBLIC_API_URL=https://abc123def456.ngrok.io/api

# Webhook URLs (for Stripe, SendGrid, etc.)
STRIPE_WEBHOOK_URL=https://abc123def456.ngrok.io/api/webhooks/stripe
SENDGRID_WEBHOOK_URL=https://abc123def456.ngrok.io/api/webhooks/email

# OAuth Callbacks (update in Google Cloud Console)
GOOGLE_OAUTH_REDIRECT=https://abc123def456.ngrok.io/auth/google/callback
NEXTAUTH_URL=https://abc123def456.ngrok.io
```

### 3. Run Dev Server with ngrok URLs
```bash
# Terminal 1: Start Next.js dev server
npm run dev

# Terminal 2: Start ngrok
ngrok http 3000

# Terminal 3: Use the ngrok URL
export NEXT_PUBLIC_APP_URL=https://abc123def456.ngrok.io
npm run dev  # or just reference the URL in your config
```

---

## Use Cases

### Testing Stripe Webhooks
1. Get ngrok URL: `https://abc123def456.ngrok.io`
2. Go to [Stripe Dashboard](https://dashboard.stripe.com)
3. Developers → Webhooks → Add endpoint
4. Endpoint URL: `https://abc123def456.ngrok.io/api/webhooks/stripe`
5. Select events to listen to
6. Save
7. Test webhook from Stripe dashboard

### Testing Mobile App Connections
1. Run `npm run dev` (Next.js)
2. Run `ngrok http 3000`
3. In mobile app, use ngrok URL instead of localhost:
   ```
   API_BASE_URL = "https://abc123def456.ngrok.io/api"
   ```
4. Mobile app can now connect to your local backend! ✅

### Testing with Team Members
1. Share ngrok URL: `https://abc123def456.ngrok.io`
2. Team members visit the URL
3. See the same app running on your machine
4. Perfect for demos and pair programming!

---

## Monitoring & Debugging

### Web Interface
While ngrok is running, visit **http://127.0.0.1:4040** to see:
- All incoming requests
- Request/response headers
- Request body and response
- Real-time traffic monitoring

Perfect for debugging API calls!

### Example: Check Webhook Requests
1. Start ngrok
2. Go to http://127.0.0.1:4040
3. Trigger webhook (e.g., Stripe test payment)
4. See request details in real-time
5. Debug without checking server logs

---

## Advanced: Custom Subdomains (Paid Feature)

With ngrok Pro ($12/month):
```bash
ngrok http 3000 --subdomain=washlee-dev
```

Result: `https://washlee-dev.ngrok.io` (always the same!)

Benefits:
- Same URL every time
- No need to update configs
- Better for team sharing

---

## Troubleshooting

### "Connection refused"
```bash
# Make sure Next.js is running
npm run dev  # in another terminal
```

### "Auth token not valid"
```bash
# Re-add your auth token
ngrok config add-authtoken YOUR_NEW_TOKEN
```

### "ngrok: command not found"
```bash
# Add ngrok to PATH
export PATH="/opt/homebrew/bin:$PATH"
# Add to ~/.zshrc for permanent fix
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
```

### "Address already in use"
```bash
# Another process is using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
```

---

## Production Considerations

⚠️ **DO NOT use ngrok URLs in production**

Instead:
- Deploy to Vercel/AWS/Heroku
- Use proper domain names
- Use environment-specific credentials
- Enable CORS for your domain only

For production:
```env
# Development
NEXT_PUBLIC_APP_URL=https://abc123def456.ngrok.io

# Production
NEXT_PUBLIC_APP_URL=https://www.washlee.com.au
```

---

## Quick Start Commands

```bash
# Install ngrok
brew install ngrok/ngrok/ngrok

# Add auth token (do once)
ngrok config add-authtoken YOUR_TOKEN

# Start Next.js dev server (Terminal 1)
npm run dev

# Start ngrok tunnel (Terminal 2)
ngrok http 3000

# Copy the Forwarding URL and use it!
```

---

## Environment Files

### Development (localhost)
`.env.local`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXTAUTH_URL=http://localhost:3000
```

### Development with ngrok
`.env.ngrok`:
```env
NEXT_PUBLIC_APP_URL=https://abc123def456.ngrok.io
NEXT_PUBLIC_API_URL=https://abc123def456.ngrok.io/api
NEXTAUTH_URL=https://abc123def456.ngrok.io
STRIPE_WEBHOOK_URL=https://abc123def456.ngrok.io/api/webhooks/stripe
```

### How to Use
```bash
# With ngrok, manually replace URLs or create .env.ngrok and use it
cat .env.ngrok >> .env.local  # Append to override localhost URLs
```

---

## Useful Links

- **ngrok Official**: https://ngrok.com
- **ngrok Docs**: https://ngrok.com/docs
- **ngrok Dashboard**: https://dashboard.ngrok.com
- **Web Inspector**: http://127.0.0.1:4040 (while ngrok runs)

---

## Next Steps

1. ✅ Install ngrok
2. ✅ Add auth token
3. ✅ Run `npm run dev` and `ngrok http 3000`
4. ✅ Test the ngrok URL in browser
5. ✅ Update webhook URLs in Stripe/SendGrid
6. ✅ Test with mobile app or team members

---

**Status**: Ready to use ✅

Start tunneling your local development to the world!
