# Codex Changes

## 2026-07-11

- Reviewed Gemini's backend hardening pass in `C:\Users\hp\Downloads\PrinterFarm`.
- Fixed static file safety so browser URL paths such as `/app.js` and `/theme.css` resolve inside `public/` instead of being rejected on Windows.
- Added `resolveSafePath()` and expanded path traversal tests for leading-slash browser paths.
- Tightened `sanitizeFilename()` to replace unsafe filename characters before storing queued G-code.
- Updated upload handling to use a single response helper and return `413 Payload Too Large` when the 100 MB limit is exceeded.
- Fixed the raw debug frontend path so missing `.raw-debug-view` markup does not crash normal dashboard rendering.
- Verified with `node --test`, `node --check`, and a temporary localhost boot/load check.
