# Album Encryption System

This project includes a password protection system for sensitive albums using AES encryption.

## How It Works

### Password Validation
- **No hardcoded passwords**: The system validates passwords by attempting to decrypt the encrypted data
- **If decryption succeeds and produces valid JSON**: Password is correct
- **If decryption fails**: Password is incorrect

### Session Management
- **Authentication state**: Stored in browser's `sessionStorage`
- **No repeated prompts**: Once authenticated, users won't be asked for password again in the same session
- **Automatic cleanup**: Authentication state is cleared when browser session ends

## Files Overview

### Core Components

1. **`encrypt-album-helper.js`** - Helper script for encrypting album data
2. **`src/app/shared/services/encryption.service.ts`** - AES encryption/decryption service
3. **`src/app/shared/services/album-auth.service.ts`** - Authentication management
4. **`src/app/shared/components/password-modal/`** - Password input modal

### Album Data Structure

```json
{
  "id": "album-id",
  "title": "Album Title",
  "isLocked": true,
  "encryptedPhotos": "encrypted_string_here",
  "photoCount": 10
}
```

## Using the Encryption Helper

### 1. Install Dependencies
```bash
npm install crypto-js
```

### 2. Run the Helper Script
```bash
node encrypt-album-helper.js
```

### 3. Update Album Data
1. Copy the generated encrypted string
2. Replace the `encryptedPhotos` field in `album-data.json`
3. Set `"isLocked": true`
4. Remove the `photos` array if it exists

### 4. Modify Raw Data
Edit the `rawAlbumData` array in `encrypt-album-helper.js` to update the album content:

```javascript
const rawAlbumData = [
  {
    "id": "photo-1",
    "url": "assets/images/path/to/image.jpg",
    "title": "Photo Title",
    "description": "Photo description"
  },
  // Add more photos...
];
```

## Security Features

### ✅ What's Secure
- **AES Encryption**: Industry-standard encryption for photo data
- **No password storage**: Passwords are never stored in the frontend
- **Session-based auth**: Authentication expires with browser session
- **Validation by decryption**: Password correctness verified by successful decryption

### ⚠️ Security Considerations
- **Client-side encryption**: Data is encrypted on the client, so the encryption key (password) must be known by the client
- **Obfuscation, not security**: This provides privacy/obfuscation rather than true security against determined attackers
- **Suitable for**: Personal projects, family albums, content that needs basic privacy protection

## Usage Flow

### For Locked Albums

1. **User clicks locked album** → Password modal appears
2. **User enters password** → System attempts decryption
3. **If successful** → Album opens, auth state saved
4. **If failed** → Error message shown
5. **Subsequent visits** → No password prompt (same session)

### For Direct URL Access

1. **User visits album URL directly** → System checks if locked
2. **If locked and not authenticated** → Password modal appears
3. **Authentication flow** → Same as above
4. **If user cancels** → Redirected to album list

## Development

### Adding New Locked Albums

1. Create photo data in `encrypt-album-helper.js`
2. Run the script to generate encrypted data
3. Update `album-data.json` with encrypted data and `"isLocked": true`
4. Test the password flow

### Changing Passwords

1. Update the `PASSCODE` in `encrypt-album-helper.js`
2. Re-run the script to generate new encrypted data
3. Update `album-data.json` with the new encrypted string

### Testing

- Test password validation (correct/incorrect passwords)
- Test session persistence
- Test direct URL access
- Test modal interactions (close, cancel)

## Troubleshooting

### Common Issues

1. **"Invalid password" for correct password**
   - Check if encrypted data is properly formatted
   - Verify no extra characters in the encrypted string

2. **Modal not showing**
   - Check if `isLocked: true` is set in album data
   - Verify component imports are correct

3. **Authentication not persisting**
   - Check browser's sessionStorage
   - Verify authentication service is properly injected

### Debug Mode

Add console logs in `album-auth.service.ts` to debug authentication flow:

```typescript
console.log('Authentication attempt for album:', albumId);
console.log('Decryption successful:', decryptedData);
```

## Future Enhancements

- Server-side encryption for better security
- Multiple password support
- Password expiration
- Admin panel for managing locked albums
- Audit logging for access attempts

