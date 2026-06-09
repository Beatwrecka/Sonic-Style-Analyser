## 2025-02-28 - Sentinel Journal Entry
**Vulnerability:** The Vite configuration used `define` to statically replace `process.env.GEMINI_API_KEY` and `process.env.API_KEY` with the actual API key string during the build process. Furthermore, the `geminiService.ts` file contained fallback logic looking for `process.env.GEMINI_API_KEY` and `process.env.API_KEY`. This meant that the backend API key from the local `.env` file was being injected in plaintext into the public client-side JavaScript bundle during the Vite build process.
**Learning:** Using `define` in `vite.config.ts` to map `process.env` to sensitive secrets will compile those secrets into the client-side JavaScript. This exposes secrets directly to the client browser.
**Prevention:** Avoid injecting `process.env.*` secrets into the client build. Exclusively use Vite's built-in `import.meta.env.VITE_*` mechanism for variables that are safe to be exposed to the public frontend. Remove fallback checks for `process.env` within client-side code.

## 2026-04-28 - Input Validation and SSRF Mitigation
**Vulnerability:** The application was passing user-provided URLs directly to the backend/API calls without verifying the protocol (e.g., allowing `javascript:`, `file:`, or `data:` schemas). Additionally, generic catch blocks were indiscriminately passing underlying error messages directly to the UI, potentially exposing internal stack traces or API responses.
**Learning:** Accepting arbitrary URL input can lead to SSRF-like behavior or malicious code execution if the parsing library processes unsafe protocols. Catch-all error handlers often leak internal system state if not properly sanitized before presentation.
**Prevention:** Always parse and explicitly allow-list accepted protocols (e.g., `http:` and `https:`) before using remote URLs. Implement safe error boundaries that only pass generic or explicitly approved error strings to client interfaces.
## 2024-05-03 - Stack Trace Leakage and File Upload Validation
**Vulnerability:** The application was using raw `console.error` to log unhandled exceptions directly to the browser console. This could expose internal stack traces and application paths to end users. Furthermore, file uploads were not explicitly validated for an `audio/` MIME type before processing, posing a risk of malicious file handling.
**Learning:** Raw `console` methods should not be used for error handling in production client-side code as they can leak sensitive details. Unvalidated file uploads can allow arbitrary files to be passed to backend processing APIs.
**Prevention:** Always use a centralized logging utility that sanitizes error objects in production (`import.meta.env.DEV` check) to prevent stack trace leakage. Always validate that uploaded files explicitly start with the expected MIME type (e.g., `audio/`) before processing.

## 2025-05-04 - Dev Server Binding
**Vulnerability:** The Vite configuration used `server: { host: '0.0.0.0' }`, which bound the development server to all available network interfaces. This could unintentionally expose the local development server, and potentially sensitive environment variables, to anyone on the same local network.
**Learning:** Binding to `0.0.0.0` in a default config is a common oversight that opens local development environments up to lateral access on public or shared networks (e.g. coffee shop WiFi).
**Prevention:** Always use `localhost` (the default) for the development server host unless explicit network access is required, in which case it should be explicitly passed as a CLI flag (`--host`) by the developer when needed.

## 2025-05-04 - Unvalidated Resource Loading and Content Security Policy
**Vulnerability:** The application was missing a Content Security Policy (CSP), which left it vulnerable to Cross-Site Scripting (XSS) attacks. Without a CSP, an attacker who successfully injects malicious scripts could execute them within the context of the application, potentially stealing sensitive user data or performing unauthorized actions.
**Learning:** A missing CSP allows browsers to load resources from any source, increasing the attack surface. Implementing a strict CSP is a crucial defense-in-depth measure.
**Prevention:** Always implement a Content Security Policy (CSP) to restrict the sources from which resources (scripts, styles, fonts, etc.) can be loaded. This mitigates the impact of XSS vulnerabilities by preventing the execution of unauthorized scripts.

## 2026-05-13 - Strict Domain Allowlist for External Link Analysis
**Vulnerability:** The application was parsing external URLs and allowing any domain over HTTP/HTTPS, enabling users to inject arbitrary site content into LLM prompts (Prompt Injection) or trigger Server-Side Request Forgery (SSRF) during the search-assisted Gemini flow if an attacker provided malicious URLs.
**Learning:** Checking only the protocol of a URL isn't sufficient when incorporating that URL into a backend task or an LLM prompt, as arbitrary domains open vectors for SSRF or prompt injection depending on the parsing backend tool configuration.
**Prevention:** Always validate external, user-provided URLs against a strict allowlist of domains (e.g., specific target platforms like YouTube, Spotify, SoundCloud) before incorporating them into LLM contexts or backend execution. Centralize this validation logic into utility functions to ensure consistent protection.

## 2025-05-29 - Defense in Depth: Service-Level Input Validation
**Vulnerability:** The `analyzeAudioFile` function in `services/geminiService.ts` was relying entirely on UI-level checks in `App.tsx` to validate that uploaded files were actually audio files (`audio/*` MIME type). If the API was called directly or if the UI validation was bypassed, it could attempt to process non-audio files.
**Learning:** Depending solely on client-side UI validation is insufficient. Core services and backend-facing API wrappers must independently validate their inputs to ensure defense in depth. This prevents unexpected behavior or potential exploitation if the UI layer is circumvented.
**Prevention:** Always enforce independent input validation at the service layer (e.g., MIME type checks before making external API calls), even if the UI also performs similar checks for user experience.

## 2025-06-10 - Defense in Depth: Service-Level URL Validation
**Vulnerability:** The `analyzeLink` function in `services/geminiService.ts` was relying entirely on UI-level checks (if any) or assuming valid URL inputs. If the API was called directly or if the UI validation was bypassed, it could attempt to process arbitrary URLs (including those vulnerable to SSRF or prompt injection).
**Learning:** Depending solely on UI validation or missing service-level validation is insufficient. Core services and backend-facing API wrappers must independently validate their inputs to ensure defense in depth.
**Prevention:** Always enforce independent input validation at the service layer (e.g., strict URL validation before making external API calls), even if the UI might perform similar checks.
