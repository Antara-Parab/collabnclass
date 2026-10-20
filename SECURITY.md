# Security Policy — CollabClass

**CollabClass** is a real-time collaborative virtual classroom and video conferencing platform built with React, Express, Stream.io, Clerk, and Supabase.

---

## 🔒 Security Architecture & Practices

1. **Authentication & Identity Verification:**
   - User identity is managed using Clerk's secure OAuth/passwordless infrastructure.
   - All backend API endpoints require cryptographically verified Clerk Bearer tokens using `@clerk/clerk-sdk-node`.

2. **Encrypted Media Transport:**
   - Audio and video streams are transmitted through Stream's global SFU network using standard **DTLS-SRTP** encryption in transit.
   - Screen-sharing channels and WebRTC data streams follow strict browser sandboxing policies.

3. **Least-Privilege Token Generation:**
   - Stream.io call tokens are generated on-demand by the backend with short time-to-live (1 hour expiration) and strictly mapped to the caller's verified Clerk User ID.

4. **Origin & CORS Enforcement:**
   - The Express API Gateway enforces explicit origin allowlisting for development environments and verified production Vercel deployment domains.

5. **Secrets & Credential Isolation:**
   - Server-side API secrets (`CLERK_SECRET_KEY`, `STREAM_SECRET_KEY`, `GROQ_API_KEY`, `GITHUB_TOKEN`) are strictly confined to the backend environment and never exposed to client bundles.

---

## 🚨 Vulnerability Reporting

If you discover a security vulnerability within CollabClass, please report it privately:

- **Primary Contact:** `tanmaynileshshinde@gmail.com`
- **Subject:** `[SECURITY] CollabClass Vulnerability Report`

Please include:
- A detailed description of the vulnerability.
- Steps or a minimal proof of concept to reproduce the issue.
- Potential impact and affected components.

We appreciate responsible disclosure and will acknowledge reports promptly.
