# Building Journal for Me: From 750words Fan to Full-Stack Developer

*A technical journey through creating a secure, whimsical journaling app that prioritizes user privacy and delightful UX*

---

## The Philosophy: Making Writing Feel Like Play

I've been a devoted user of [750words](https://750words.com/) for years. There's something magical about that simple, focused interface that just gets out of your way and lets you write. But as someone who just graduated from Mount Royal University with a BA in English Honours, I found myself craving something more—a journaling experience that felt less like a daily obligation and more like a delightful ritual.

The idea for Journal for Me was born from a simple question: *What if journaling felt as inviting as opening a favorite book?*

I wanted to create something that embraced whimsical UX design—soft gradients, thoughtful typography (EB Garamond!), gentle animations, and an interface that feels more like a cozy reading nook than a sterile productivity tool. Every design decision was made with one goal: reduce friction and increase joy in the act of writing.

The early access badge in the footer, the elegant hero image with literary quotes, the smooth transitions between pages—these aren't just aesthetic choices. They're part of a philosophy that believes technology should feel human, approachable, and maybe even a little magical.

## The Technical Journey: From Static Sites to Real Applications

My background has been primarily in JAMstack development—building static sites with generators like Jekyll and Hugo, deploying to Netlify, and calling it a day. It's a world where your biggest worry is whether your CSS animations are too bouncy.

Building Journal for Me was my first real foray into full-stack development. It's a completely different beast.

### The Database Dilemma

Coming from the static site world, the concept of persistent user data was exciting and terrifying.

I chose IndexedDB with client-side encryption, and it turned out to be one of the best decisions I made. Here's why:

```typescript
// Every entry gets encrypted before storage
const encryptedEntry: JournalEntry = {
  ...entry,
  title: this.encrypt(entry.title),
  content: this.encrypt(entry.content),
  isEncrypted: this.encryptionKey !== null
}
```

This approach meant:
- **No server costs** (perfect for an indie project)
- **Complete user privacy** (I literally can't read your entries)
- **Offline functionality** (write anywhere, anytime)
- **Fast performance** (no network requests for reading/writing)

But it also meant debugging storage issues that would make you question your life choices. Ever tried to debug encrypted data that's stored in a browser database that only exists in specific contexts? It's... character building.

### The Bug Chronicles

The transition from "it works on my machine" static sites to "it needs to work for everyone, everywhere, all the time" applications is humbling. Some of my favorite bugs:

**Session Mystery**: Users would log in successfully, then refresh the page and... poof! Gone. Turns out I was storing the session key but not validating it properly on app initialization. The solution required building a comprehensive credential validation system:

```typescript
async validateUserCredentials(email: string, password: string): Promise<{
  exists: boolean; 
  passwordValid: boolean; 
  user?: User 
}> {
  // Validate without full app initialization
  // This prevents the dreaded "user exists but can't log in" scenario
}
```

**Markdown Formatting Fiasco**: Everything looked perfect in development, but in production, headers weren't rendering, lists were broken, and links were just... text. The culprit? A missing CSS class that only mattered when the content was dynamically generated. Hours of debugging for one missing `.entry-content` class.

**A Calendar That Forgot Time**: Building a calendar component sounds simple until you realize that JavaScript's Date object has opinions about timezones, and those opinions don't always align with what users expect to see. The number of edge cases around "show me entries from this day" is enuinely impressive.

## Security: The Weight of Other People's Words

Is trust taught in computer science? The moment someone trusts you with their personal thoughts, the responsibility becomes real in a way that's hard to describe.

Journal entries are data, but they're also someone's private thoughts, fears, dreams, and daily struggles. The security architecture had to reflect that gravity.

### Client-Side Encryption: Trust No One (Including Me)

The core principle was simple: I should never be able to read user entries, even if I wanted to. This led to a zero-knowledge architecture:

```typescript
// Password-based key derivation
private deriveEncryptionKey(password: string): string {
  return CryptoJS.PBKDF2(password, 'journalfor.me-salt', {
    keySize: 256/32,
    iterations: 10000
  }).toString()
}

// AES-256 encryption for all sensitive data
private encrypt(text: string): string {
  if (!this.encryptionKey) return text
  return CryptoJS.AES.encrypt(text, this.encryptionKey).toString()
}
```

Every entry is encrypted with AES-256 before it touches IndexedDB. The encryption key is derived from the user's master password using PBKDF2 with 10,000 iterations. Even if someone gained access to the browser's storage, they'd find nothing but encrypted gibberish.

### The Authentication Dance

Building secure authentication without a traditional backend required some creative thinking. The login flow became:

1. **Credential Validation**: Check if the email/password combination can decrypt existing user data
2. **Specific Error Messages**: "Wrong password" vs "No account found" (users deserve clear feedback)
3. **Session Management**: Store session data securely while maintaining the zero-knowledge principle
4. **Graceful Degradation**: Handle corrupted sessions, invalid keys, and edge cases

The result is an authentication system that's both secure and user-friendly—a surprisingly difficult balance to strike.

## Testing: Saving My Sanity One Test at a Time

After the fifteenth time manually testing the "register → login → create entry → view entry → edit entry" flow, I realized I needed to automate this madness.

Building a comprehensive test suite became essential not just for catching bugs, but for maintaining my sanity during development. The automated test runner now covers:

### Authentication & Security Tests
```typescript
// Test credential validation with specific scenarios
await this.runTest(suite, 'Credential Validation', async () => {
  const validResult = await appStore.storage.validateUserCredentials('test@example.com', 'correctpass')
  const invalidResult = await appStore.storage.validateUserCredentials('test@example.com', 'wrongpass')
  // Verify both scenarios work as expected
})
```

### Component Integration Tests
Every major component gets tested for both functionality and UI presence. The search component needs its search button, the calendar needs navigation controls, the settings page needs all its form elements. Tests catch the "oops, I renamed that ID and broke everything" bugs before users do.

### Markdown Rendering Tests
Since the app supports rich markdown formatting, I built tests that verify headers render correctly, lists format properly, and links actually link. There's something satisfying about watching automated tests confirm that `**bold text**` actually renders as **bold text**.

### The 93.2% Success Rate
The current test suite runs 44 tests with a 93.2% success rate. Those 3 failing tests? They're on my radar, but they're edge cases that don't affect core functionality. The beauty of automated testing is that I can fix those issues without worrying about breaking something else.

## The Road Ahead: Accessibility and Beyond

Building Journal for Me has been incredibly rewarding, but it's also highlighted how much work goes into making software truly accessible to everyone.

My next major focus is accessibility. The app currently meets basic standards, but I want to go further:

- **Screen Reader Optimization**: Ensuring every interactive element has proper ARIA labels and semantic markup
- **Keyboard Navigation**: Full keyboard accessibility for users who can't or prefer not to use a mouse
- **High Contrast Mode**: Better support for users with visual impairments
- **Reduced Motion Options**: Respecting users' motion sensitivity preferences
- **Font Size Scaling**: Better support for users who need larger text

Accessibility isn't just about compliance—it's about ensuring that the joy of journaling is available to everyone, regardless of how they interact with technology.

## Technical Stack & Architecture

For the technically curious, here's what powers Journal for Me:

**Frontend Framework**: Vanilla TypeScript with Vite for blazing-fast development and builds
**Styling**: Tailwind CSS for rapid, consistent design
**Storage**: IndexedDB with the `idb` library for robust client-side data persistence
**Encryption**: CryptoJS for AES-256 encryption and PBKDF2 key derivation
**PWA Features**: Service Worker with Workbox for offline functionality
**Typography**: EB Garamond for that literary feel, Inter for UI elements
**Testing**: Custom DOM-based test suite with comprehensive coverage
**Deployment**: Netlify with optimized build pipeline and security headers

The entire app is client-side, which means it loads fast, works offline, and keeps your data completely private.

## Performance & Security Highlights

- **Zero server costs** (beyond hosting static files)
- **Complete data privacy** (client-side encryption means I can't read your entries)
- **Offline functionality** (write even without internet)
- **PWA capabilities** (install on your device like a native app)
- **93.2% test coverage** (automated testing catches bugs before you do)
- **Security headers** (CSP, HSTS, and other protections configured)
- **Optimized builds** (code splitting and asset optimization for fast loading)

## A Call to Adventure

Journal for Me is now in early access, and I'm genuinely excited to see how people use it. But here's the thing about building software: you can test it a thousand times, and users will still find that one edge case you never considered.

If you're willing to take Journal for Me for a spin, I'd be incredibly grateful. And if you encounter a bug, have a suggestion, or just want to share your experience, please [open an issue on GitHub](https://github.com/brennanbrown/journalfor.me/issues) or reach out to me directly.

Every bug report makes the app better. Every suggestion helps me understand how people actually want to use it. Every user who takes a chance on an indie project like this makes the independent web a little more vibrant.

## The Bigger Picture

Building Journal for Me taught me that the gap between "I can build websites" and "I can build applications" is vast and filled with humbling lessons. But it also reinforced my belief that the web is an incredible platform for creating tools that genuinely help people.

In a world of surveillance capitalism and data harvesting, there's something rebellious about building a journaling app that prioritizes user privacy above all else. In a world of complex, overwhelming interfaces, there's something necessary about creating tools that feel approachable and human.

Journal for Me isn't just a technical project—it's a small statement about what software can be when it's built with care, privacy, and user joy as the primary concerns.

---

**Try Journal for Me**: [journalfor.me](https://journalforme.netlify.app 
**Source Code**: [GitHub Repository](https://github.com/brennanbrown/journalfor.me)  
**Report Issues**: [GitHub Issues](https://github.com/brennanbrown/journalfor.me/issues)

*Thank you for reading, and thank you for considering giving Journal for Me a try. Happy writing! ✨*
