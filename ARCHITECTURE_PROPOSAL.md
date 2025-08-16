# Server-Side Architecture Proposal for Journal for Me

## Current Problem

The client-only IndexedDB storage architecture has a critical flaw: user data is isolated to individual browser instances. This means:

- Users can't access their journals from different browsers/devices
- Data is lost if browser storage is cleared
- No true account portability across devices
- Registration appears to "work" but data doesn't persist globally

## Proposed Solution: Hybrid Zero-Knowledge Architecture

Maintain the zero-knowledge encryption principle while adding server-side encrypted data storage.

### Architecture Overview

```
Client (Browser)                    Server (Backend)
┌─────────────────┐                ┌──────────────────┐
│ User Interface  │                │ API Endpoints    │
│ ├─ Auth Forms   │                │ ├─ /auth/login   │
│ ├─ Editor       │                │ ├─ /auth/register│
│ └─ Dashboard    │                │ ├─ /entries      │
├─────────────────┤                │ └─ /user         │
│ Encryption      │                ├──────────────────┤
│ ├─ AES-256      │   HTTPS        │ Database         │
│ ├─ PBKDF2       │ ◄─────────────► │ ├─ Users         │
│ └─ Client Keys  │                │ ├─ Entries       │
├─────────────────┤                │ └─ Sessions      │
│ Local Storage   │                └──────────────────┘
│ ├─ Session      │
│ ├─ Cache        │
│ └─ Offline      │
└─────────────────┘
```

### Data Flow

1. **Registration**:
   - Client generates encryption key from password (PBKDF2)
   - Client encrypts user data with key
   - Client sends encrypted data to server
   - Server stores encrypted blob (can't decrypt)

2. **Login**:
   - Client derives key from password
   - Client requests encrypted data from server
   - Client decrypts data locally
   - Client caches decrypted data in IndexedDB for offline use

3. **Entry Creation**:
   - Client encrypts entry with user's key
   - Client sends encrypted entry to server
   - Client updates local cache
   - Server stores encrypted blob

### Implementation Plan

#### Phase 1: Backend Infrastructure
- Set up Node.js/Express server
- Implement user authentication endpoints
- Create encrypted data storage endpoints
- Deploy to serverless platform (Vercel/Netlify Functions)

#### Phase 2: Client Integration
- Modify StorageManager to sync with server
- Implement offline-first with server sync
- Add conflict resolution for concurrent edits
- Maintain backward compatibility with existing local data

#### Phase 3: Enhanced Features
- Multi-device session management
- Data export/import functionality
- Account recovery mechanisms

## Technical Specifications

### Server API Endpoints

```typescript
POST /api/auth/register
{
  email: string
  encryptedUserData: string  // AES-256 encrypted user object
  passwordHash: string       // For server-side auth (not encryption key)
}

POST /api/auth/login
{
  email: string
  passwordHash: string
}
Response: { token: string, encryptedUserData: string }

GET /api/entries
Headers: { Authorization: Bearer <token> }
Response: { entries: EncryptedEntry[] }

POST /api/entries
{
  encryptedEntry: string     // AES-256 encrypted entry
}

PUT /api/entries/:id
{
  encryptedEntry: string
}

DELETE /api/entries/:id
```

### Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,  -- For auth, not encryption
  encrypted_data TEXT NOT NULL,         -- Encrypted user preferences
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Entries table
CREATE TABLE entries (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  encrypted_data TEXT NOT NULL,         -- Encrypted entry content
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions table (optional, for token management)
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Security Considerations

1. **Zero-Knowledge Principle**: Server never has access to encryption keys
2. **Password Separation**: 
   - User password → PBKDF2 → encryption key (client-side only)
   - User password → bcrypt → auth hash (server-side only)
3. **Transport Security**: All data encrypted in transit (HTTPS)
4. **Token-Based Auth**: JWT or similar for API authentication
5. **Data Validation**: Server validates encrypted blob structure without decrypting

### Migration Strategy

1. **Detect Existing Data**: Check for local IndexedDB data on app start
2. **Migration Prompt**: Ask users to sync existing data to server
3. **Gradual Rollout**: 
   - Phase 1: Optional server sync (local + server)
   - Phase 2: Server-first with local cache
   - Phase 3: Full server dependency

### Benefits

- **Cross-Device Access**: Users can access journals from any device
- **Data Persistence**: No more lost data from browser clearing
- **Offline Capability**: Local cache still works offline
- **Zero-Knowledge**: Server can't read user data
- **Scalability**: Can handle multiple users and large datasets
- **Backup**: Natural data backup through server storage

### Costs & Considerations

- **Infrastructure**: Need backend hosting (estimated $10-20/month initially)
- **Complexity**: More complex deployment and maintenance
- **Development Time**: 2-3 weeks for full implementation
- **Data Migration**: Need to migrate existing local users

## Recommendation

Implement this hybrid architecture to solve the fundamental data persistence issue while maintaining the privacy-first approach. The zero-knowledge encryption ensures user data remains private even with server-side storage.

This addresses the core problem: users expect their journal to be accessible from multiple devices, which is impossible with client-only storage.
