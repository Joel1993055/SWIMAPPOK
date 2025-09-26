# 🚀 Deployment Setup Guide

This guide explains how to configure Google Console and Supabase for both local development and production deployment on Vercel.

## 📋 Prerequisites

- Vercel account with deployed app: [https://swimappok.vercel.app/](https://swimappok.vercel.app/)
- Supabase project
- Google Cloud Console account

## 🔧 Google Cloud Console Setup

### 1. Create/Select Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API** and **Google Identity API**

### 2. Configure OAuth 2.0
1. Navigate to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth 2.0 Client IDs**
3. Set **Application type** to **Web application**
4. Configure **Authorized redirect URIs**:

#### Development URLs:
```
http://localhost:3000/auth/callback
http://localhost:3002/auth/callback
```

#### Production URLs:
```
https://swimappok.vercel.app/auth/callback
```

### 3. Get Credentials
- Copy **Client ID** and **Client Secret**
- Save these for Supabase configuration

## 🔧 Supabase Configuration

### 1. URL Configuration
In your Supabase project dashboard:

1. Go to **Authentication > URL Configuration**
2. Set **Site URL**:
   ```
   https://swimappok.vercel.app
   ```

3. Add **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3002/auth/callback
   https://swimappok.vercel.app/auth/callback
   ```

### 2. Google Provider Setup
1. Go to **Authentication > Providers**
2. Enable **Google** provider
3. Enter your Google **Client ID** and **Client Secret**
4. Save configuration

### 3. Domain Configuration
Add these domains to **Additional Redirect URLs**:
```
http://localhost:3000/**
http://localhost:3002/**
https://swimappok.vercel.app/**
```

## 🔧 Environment Variables

### Vercel (Production)
In your Vercel project settings:

1. Go to **Settings > Environment Variables**
2. Add these variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=https://swimappok.vercel.app
```

### Local Development
Create `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🔧 Verification

### 1. Check Configuration
Run the verification script:

```bash
npm run verify:config
```

### 2. Test Authentication
1. **Local**: Visit `http://localhost:3000`
2. **Production**: Visit `https://swimappok.vercel.app`
3. Try to access `/dashboard` - should redirect to login
4. Test Google OAuth login

### 3. Verify Routes
Protected routes should redirect to login:
- `/dashboard`
- `/settings`
- `/training`
- `/calendar`
- `/reports`
- `/planning`
- `/clubs`
- `/tools`
- `/log`
- `/ai-coach`
- `/analysis`
- `/notifications`

## 🔧 Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Check Google OAuth redirect URIs
   - Verify Supabase URL configuration

2. **"Invalid client"**
   - Verify Google Client ID and Secret
   - Check Supabase Google provider configuration

3. **"Site URL mismatch"**
   - Update Supabase Site URL
   - Check environment variables

4. **Authentication not working**
   - Verify all environment variables are set
   - Check Supabase project is active
   - Ensure Google APIs are enabled

### Debug Steps

1. Check browser console for errors
2. Verify environment variables with `npm run verify:config`
3. Test Supabase connection in dashboard
4. Check Vercel function logs

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Verify all configurations match exactly
3. Test in incognito mode
4. Check browser console for specific errors

## 🔄 Updates

After making changes:
1. Update environment variables in Vercel
2. Redeploy the application
3. Test authentication flow
4. Verify all protected routes work correctly
