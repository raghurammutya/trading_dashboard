# OAuth Setup Guide

This guide explains how to set up real OAuth authentication with social media providers for the Trading Dashboard.

## Quick Start

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Configure OAuth providers in `.env.local` with your real credentials

3. Restart the development server to load new environment variables

## Provider Setup Instructions

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure consent screen if prompted
6. Set Application Type to "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback/google`
   - `http://localhost:3001/auth/callback/google` (if using different port)
   - Your production domain: `https://yourdomain.com/auth/callback/google`
8. Copy the Client ID to `.env.local`:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your_actual_google_client_id.apps.googleusercontent.com
   ```

### LinkedIn OAuth

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps)
2. Create a new app
3. Select "Sign In with LinkedIn" product
4. In app settings, add redirect URLs:
   - `http://localhost:3000/auth/callback/linkedin`
   - `http://localhost:3001/auth/callback/linkedin`
   - Your production domain: `https://yourdomain.com/auth/callback/linkedin`
5. Copy the Client ID to `.env.local`:
   ```
   REACT_APP_LINKEDIN_CLIENT_ID=your_actual_linkedin_client_id
   ```

### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. In Facebook Login settings, add Valid OAuth Redirect URIs:
   - `http://localhost:3000/auth/callback/facebook`
   - `http://localhost:3001/auth/callback/facebook`
   - Your production domain: `https://yourdomain.com/auth/callback/facebook`
5. Copy the App ID to `.env.local`:
   ```
   REACT_APP_FACEBOOK_APP_ID=your_actual_facebook_app_id
   ```

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in application details
4. Set Authorization callback URL:
   - `http://localhost:3000/auth/callback/github`
   - For production: `https://yourdomain.com/auth/callback/github`
5. Copy the Client ID to `.env.local`:
   ```
   REACT_APP_GITHUB_CLIENT_ID=your_actual_github_client_id
   ```

## Security Considerations

### For Development
- The current implementation handles OAuth flow in the frontend for simplicity
- Client secrets are not used (as they should not be exposed in frontend)
- State parameter is used for CSRF protection

### For Production
- **Recommended**: Implement OAuth flow in your backend
- Use backend endpoints to handle token exchange
- Store client secrets securely on the server
- Validate OAuth responses server-side
- Consider using your user_service OAuth endpoints when available

## Backend Integration

When your user_service is running, the app will automatically:
1. Try real OAuth providers (if configured)
2. Fall back to user_service OAuth endpoints
3. Fall back to mock authentication (for development)

This provides a seamless development experience while supporting real OAuth when properly configured.

## Testing OAuth

1. Configure at least one provider (Google is recommended for testing)
2. Restart your development server
3. Navigate to login/register page
4. You should see:
   - Green "Real OAuth Active" status if all providers are configured
   - Blue "Partial OAuth Configuration" if some are configured
   - Orange warning if none are configured
5. Click the OAuth button to test the flow

## Troubleshooting

### "OAuth configuration error"
- Check that your client ID is correctly set in `.env.local`
- Ensure redirect URIs match exactly (including protocol and port)
- Verify the OAuth app is active/published

### "Invalid redirect URI"
- Double-check redirect URIs in your OAuth app settings
- Ensure you're using the correct port (3000 or 3001)
- For HTTPS in production, make sure certificates are valid

### "State parameter invalid"
- This is a security check - try the OAuth flow again
- Clear browser storage if the issue persists

## Example Complete `.env.local`

```bash
# Real OAuth Configuration
REACT_APP_GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
REACT_APP_LINKEDIN_CLIENT_ID=78abcdefgh123456
REACT_APP_FACEBOOK_APP_ID=123456789012345
REACT_APP_GITHUB_CLIENT_ID=abc123def456ghi789

# Backend Configuration
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_USER_SERVICE_URL=http://localhost:8001
REACT_APP_USE_MOCK_DATA=false
```

## Next Steps

1. Set up OAuth apps with your preferred providers
2. Update `.env.local` with real credentials
3. Test OAuth flows
4. Integrate with your user_service backend when ready
5. Deploy with production OAuth app settings