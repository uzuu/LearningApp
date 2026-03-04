<!-- GitHub Copilot instructions for AI coding agents -->

# Project-specific guidance for AI coding agents

Purpose

- Provide focused, actionable guidance for AI contributors working in this repository.

Big picture

- This repository is a React Native app bootstrapped for Expo (see README.md and read.me).
- Typical developer flow: install dependencies, run `npx expo start`, choose target (Android/iOS/web) or scan the QR with Expo Go.

Key commands (from README)

- Install dependencies: `npm install`
- Start dev server: `npx expo start`
- Clear Metro cache / restart: `npx expo start --clear`
- Health checks: `npx expo-doctor`
- EAS builds: `npx eas build`

What to look for in the tree

- Primary app entry is expected in `App.js` or `app.json` (standard Expo layout). If missing, ask the maintainer.
- README and read.me contain Mongolian-language guidance — double-check before editing localized text.

Project conventions and patterns (discoverable)

- Uses Expo CLI workflows and EAS for builds; prefer using `npx expo` and `npx eas` rather than global installs.
- Development device choices are selected interactively in the Expo UI: press `a` (Android), `i` (iOS), or `w` (web).
- Metro caching can cause confusing stale behavior — run `npx expo start --clear` when debugging bundling/module changes.

Integration points and external services

- Expo Go for on-device testing (QR code flow).
- EAS (Expo Application Services) used for cloud builds — changes to native config (if present) may require EAS rebuilds.

What not to assume

- There is no `package.json` or CI config visible in the repository root; do not assume test or lint scripts exist unless you find them.
- Don't modify global environment (Node/npm) instructions without confirming which versions the maintainers expect.

Actionable examples for common tasks

- Start developing:
  ```bash
  npm install
  npx expo start
  # then press a/i/w or scan QR with Expo Go
  ```
- Run quick health check:
  ```bash
  npx expo-doctor
  ```
- Clear cache and restart:
  ```bash
  npx expo start --clear
  ```

If you need clarification

- If a file mentioned by this guidance (e.g., `App.js`, `package.json`, `app.json`) is missing, open an issue or ask the repo owner before making broad changes.

Notes for AI agents

- Keep edits minimal and focused: favor small, testable diffs (start server locally to verify UI changes).
- Preserve Mongolian text in `README.md` / `read.me` unless asked to translate.
- When suggesting new scripts or CI, reference the exact files you will modify.

Referenced files

- [README.md](README.md)
- [read.me](read.me)
