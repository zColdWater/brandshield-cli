# BrandShield CLI (`brandshield-cli`)

**Check startup & product name availability across domains (via authoritative RDAP), social/developer handles, iOS/Android app stores, and USPTO federal trademarks — without leaking your ideas to domain-broker search bars.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node.js >= 18](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](./package.json)

- **Live Free Web Scanner:** [https://brand-checker.appwrite.network](https://brand-checker.appwrite.network)
- **Landing Page & Docs:** [https://zcoldwater.github.io/brandshield-cli/](https://zcoldwater.github.io/brandshield-cli/)
- **BrandShield Pro (Batch 500-Name Kit, Nice Class Scoring & Agency Reports):** [https://agentarenastudi.gumroad.com/l/omniforge-brandshield](https://agentarenastudi.gumroad.com/l/omniforge-brandshield)

---

## Why Founders Use BrandShield Instead of Registrar Search Bars

1. **Zero Domain Front-Running:** Typing unreleased startup names into third-party domain search widgets can expose queries to affiliate/drop-catch pipelines. BrandShield queries **official IANA RDAP registry endpoints** directly (`verisign`, `identitydigital`, `registry.google`, `pir.org`) with read-only lookups.
2. **USPTO Federal Trademark Reality Check:** Discovering a `.ai` domain is free means nothing if an active US Class 9 or Class 42 software trademark blocks your Stripe account, App Store listing, or seed round.
3. **Honest Social Handle Verification:** Platforms like Instagram and TikTok serve identical login walls for free and taken handles. Instead of guessing and giving false "available" signals, BrandShield verifies public endpoints (GitHub, X, YouTube, Bluesky, npm, PyPI) and explicitly flags unauthenticated walls as `Unconfirmed`.
4. **One Timestamped Report:** Domains + handles + Apple App Store + Google Play + USPTO trademarks in a single terminal command.

---

## Quick Start (Zero Install via `npx`)

Requires **Node.js 18+** (zero `npm` dependencies):

```bash
# Check a candidate startup or SaaS name
npx github:zColdWater/brandshield-cli check Lumora

# Custom domain extensions
npx github:zColdWater/brandshield-cli check BrightPath --tlds com,io,ai,dev,app,co

# Machine-readable JSON output for scripts
npx github:zColdWater/brandshield-cli check Notion --json
```

Or clone locally:

```bash
git clone https://github.com/zColdWater/brandshield-cli.git
cd brandshield-cli
node ./bin/brandshield.mjs check Notion
```

---

## Free Lite CLI vs. BrandShield Pro

`brandshield-cli` (this repository) is our free, MIT-licensed **1-name diagnostic CLI**. When you are shortlisting dozens of candidates for a startup, SaaS launch, or branding client, upgrade to **[BrandShield Pro](https://agentarenastudi.gumroad.com/l/omniforge-brandshield)** (instant ZIP download, 100% local Node.js source code, no subscriptions):

| Capability | BrandShield Lite (Free OSS) | BrandShield Pro Solo ($19) | BrandShield Pro Agency ($39) |
| :--- | :---: | :---: | :---: |
| **Live RDAP / WHOIS Domain Check** | 1 name / run | Up to **500 names / batch** (CSV/JSON) | Up to **500 names / batch** + custom TLDs |
| **Social & Developer Handles (15)** | Quick check | Full parallel matrix + rate-limit pacing | Full parallel matrix + exportable links |
| **Apple App Store & Google Play** | Exact match | Exact + prefix collision scan | Exact + prefix collision scan |
| **USPTO Trademark Screening** | Exact word mark | **Nice Class 9/35/42 + phonetic/fuzzy risk score** | **Nice Class + phonetic score + counsel brief** |
| **60-Variation Name Generator** | — | **Included** (auto-verified free on domains) | **Included** (60+ prefixes/suffixes/compounds) |
| **Offline HTML Comparison Workbench** | — | **Included** (sortable local UI, 0 cloud lock-in) | **Included** |
| **White-Label Client Reports (HTML/MD)** | — | Personal projects | **Agency license + custom client branding** |

👉 **[Download BrandShield Pro ($19 Solo / $39 Agency) on Gumroad](https://agentarenastudi.gumroad.com/l/omniforge-brandshield)**

---

## Privacy & Legal Notice

- **Read-only guarantee:** BrandShield never registers, reserves, caches, logs, or resells any name, domain, or handle you check.
- **Not legal advice:** USPTO trademark search results are an informational screening tool to eliminate obvious collisions early, not a formal legal clearance opinion from a trademark attorney.

## License

MIT © OmniForge Studio
