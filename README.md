# BrandShield — Online Startup Name, RDAP Domain & USPTO Trademark Auditor (`v5.0` Web App + OSS CLI & GitHub Action)

**Check startup & product name availability across 8 TLDs via authoritative IANA RDAP (zero domain front-running), USPTO Class 009/042 federal trademarks, iOS/Android app stores, and GitHub/npm/PyPI/X handles — free in 2 seconds directly in your browser, or in CI via `zColdWater/brandshield-cli@v1`.**

[![BrandShield Clearance](https://brand-checker.appwrite.network/badge/brand/BrandShieldCLI.svg)](https://brand-checker.appwrite.network/report/BrandShieldCLI)
[![Email Security](https://inbox-checker.appwrite.network/badge/inbox/stripe.com.svg)](https://inbox-checker.appwrite.network/?domain=stripe.com)
[![AI CiteReady](https://citeready-checker.appwrite.network/badge/citeready/stripe.com.svg)](https://citeready-checker.appwrite.network/?url=https://stripe.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node.js >= 18](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](./package.json)
[![GitHub Action](https://img.shields.io/badge/GitHub%20Action-v1-2088FF.svg?logo=githubactions&logoColor=white)](./action.yml)

- **Flagship v5.0 Online Web App (Zero Signup, Search-as-You-Type):** [https://brand-checker.appwrite.network](https://brand-checker.appwrite.network)
- **Free AI Brand Namer (60 Ideas + Live `.com/.ai/.io` RDAP):** [https://brand-checker.appwrite.network/namer](https://brand-checker.appwrite.network/namer)
- **Landing Page & Honest Comparisons:** [https://zcoldwater.github.io/brandshield-cli/](https://zcoldwater.github.io/brandshield-cli/) · [InstantDomainSearch vs. BrandShield](https://zcoldwater.github.io/launch-audit-reports/compare/instantdomainsearch-vs-brandshield.html) · [vs. Namecheap & Namechk](https://zcoldwater.github.io/brandshield-cli/compare.html)
- **2026 SaaS Launch Readiness Benchmarks (228 Live Public Audits):** [https://zcoldwater.github.io/launch-audit-reports/](https://zcoldwater.github.io/launch-audit-reports/)
- **BrandShield Web Pro ($2 Launch Special (was $12) — Instant In-Browser Unlock, 14-Day Refund):** [Gumroad Checkout](https://omnipulse-x402.appwrite.network/go/gumroad/brandshield) · [Direct 7-Chain Checkout](https://omnipulse-x402.appwrite.network/checkout/brandshield)
- **OmniForge Complete Suite ($5 Launch Special, was $29 — Unlocks VibeShield + InboxShield + CiteReady; BrandShield 100% Free):** [Gumroad Bundle](https://omnipulse-x402.appwrite.network/go/gumroad/launch-stack) · [Direct Checkout](https://omnipulse-x402.appwrite.network/checkout/launch-stack)

---

## Why Founders Use BrandShield v5.0

1. **Zero Domain Front-Running (Authoritative IANA RDAP):** Typing unreleased startup names into affiliate registrar widgets can leak ideas to commercial pipelines. BrandShield queries official registry RDAP servers directly (`verisign`, `identitydigital`, `registry.google`, `pir.org`) across `.com`, `.ai`, `.io`, `.dev`, `.app`, `.co`, `.org`, and `.xyz` with expandable RDAP registration details.
2. **USPTO Class 009/042 Trademark + App Store Screening in One Screen:** Finding an open `.ai` domain means nothing if an active software trademark or iOS/Android app already owns the name. BrandShield screens public USPTO filings alongside Apple App Store, Google Play, GitHub, npm, PyPI, and X handles.
3. **60-Candidate AI Brand Namer + 50-Brand Batch CSV + A4 PDF:** Shortlist up to 50 candidate names live in your browser, export clean UTF-8 CSV spreadsheets for Excel, follow 5-platform protection guides (Cloudflare, Aliyun, DNSPod, GoDaddy, USPTO), and print executive A4 clearance dossiers.
4. **Open-Source CLI & GitHub Action (`@v1`):** Need terminal or CI checks? This MIT repository ships a zero-dependency Node.js CLI and reusable GitHub Action.

---

## Free Online Web App vs. BrandShield v6.2 (`100% Free`)

Zero software installs, zero monthly subscriptions. Unlock Web Pro right inside [brand-checker.appwrite.network](https://brand-checker.appwrite.network) with one-time payment (Card / Apple Pay / PayPal via Gumroad or 7-chain USDT/USDC) and a **14-day refund guarantee**:

| Capability | Free Online Scanner & OSS CLI | BrandShield v6.2 (100% Free) | Complete Suite ($5, was $29) |
| :--- | :---: | :---: | :---: |
| **Live 8-TLD IANA RDAP + Detail Drawer** | Unlimited 1-by-1 | **Unlimited** | **All 4 v5.0 Web Apps Included** |
| **USPTO Class 009/042 + App Store + Dev Handles** | Live scan + score | **Full conflict matrix + Soundex scoring** | **BrandShield + VibeShield ($2)** |
| **AI Brand Namer (60 Candidates + Live RDAP)** | Preview top ideas | **Full 60-idea scoring matrix** | **+ CiteReady GEO ($12)** |
| **5-Platform Brand Protection Fix Wizard** | Step 1 preview | **Full unmasked 3-step guides** | **+ InboxShield Email ($2)** |
| **Online Batch Scanner + Excel/CSV Export** | Preview 3 brands | **Up to 50 brands / batch + UTF-8 CSV** | **50-item batch CSV on all 4 apps** |
| **Printable A4 Client Clearance PDF Report** | Summary only | **Custom-header A4 PDF (`@media print`)** | **Branded A4 PDF on all 4 apps** |

**[Unlock BrandShield v6.2 (100% Free)](https://omnipulse-x402.appwrite.network/go/gumroad/brandshield)** · **[Complete Suite ($5, was $29)](https://omnipulse-x402.appwrite.network/go/gumroad/launch-stack)** · **[Direct Multi-Chain Checkout](https://omnipulse-x402.appwrite.network/checkout/brandshield)**

---

## Optional Open-Source CLI & GitHub Action (`uses: zColdWater/brandshield-cli@v1`)

Requires **Node.js 18+** (zero `npm` dependencies):

```bash
# Check a candidate startup or SaaS name from your terminal
npx github:zColdWater/brandshield-cli check Lumora

# Custom domain extensions & Markdown CI gate
npx github:zColdWater/brandshield-cli check Lumora --tlds com,io,ai,dev,app,co --markdown --min-score 70 --fail-on-trademark
```

```yaml
name: Brand Name Clearance
on:
  workflow_dispatch:
    inputs:
      name:
        description: "Candidate startup or package name"
        required: true
        default: "Lumora"

jobs:
  brand-check:
    runs-on: ubuntu-latest
    steps:
      - name: Run BrandShield Clearance Check
        id: brand
        uses: zColdWater/brandshield-cli@v1
        with:
          name: ${{ github.event.inputs.name }}
          tlds: "com,io,ai,co,app,dev"
          min-score: "70"
          fail-on-trademark: "true"
          post-summary: "true"
```

---

## Embed a Live Brand Clearance Badge

```markdown
[![BrandShield Clearance](https://brand-checker.appwrite.network/badge/brand/YourBrandName.svg)](https://brand-checker.appwrite.network/report/YourBrandName)
```

---

## OmniForge v5.0 Pre-Launch Web Pro Suite

| App | What It Audits Live in `<2s` | Live Free Web App | Web Pro (One-Time) |
| :--- | :--- | :--- | :---: |
| **VibeShield v5.0** | JS bundle secrets (38 rules), 7 security headers & read-only Supabase RLS probe | [vibe-checker.appwrite.network](https://vibe-checker.appwrite.network) | [$9 Once](https://omnipulse-x402.appwrite.network/go/gumroad/vibeshield) |
| **BrandShield v5.0** | 8-TLD IANA RDAP, USPTO Class 009/042 trademarks, App Stores & 60-idea Namer | [brand-checker.appwrite.network](https://brand-checker.appwrite.network) | [$2 (was $12)](https://omnipulse-x402.appwrite.network/go/gumroad/brandshield) |
| **CiteReady v5.0** | 10 global & China AI search bots, Schema.org Entity Graph & `/llms.txt` compiler | [citeready-checker.appwrite.network](https://citeready-checker.appwrite.network) | [$2 (was $12)](https://omnipulse-x402.appwrite.network/go/gumroad/citeready) |
| **InboxShield v5.0** | Recursive SPF `<=10` flattener, 24-selector DKIM, DMARC, MX & 5 DNSBLs | [inbox-checker.appwrite.network](https://inbox-checker.appwrite.network) | [$15 Once](https://omnipulse-x402.appwrite.network/go/gumroad/inboxshield) |
| **4-in-1 Launch Stack** | Unlocks Web Pro across all 4 apps in one license key (Save `$19`) | All 4 Live Web Apps | [$5 (was $29)](https://omnipulse-x402.appwrite.network/go/gumroad/launch-stack) |

## Privacy, Support & Legal Notice

- **Read-only guarantee:** BrandShield never registers, reserves, caches, logs, or resells any name, domain, or handle you check.
- **Not legal advice:** Preliminary public USPTO trademark screening helps eliminate obvious collisions early and is not formal legal counsel from a trademark attorney.
- **Support & Refunds:** OmniForge · Agent Arena Studio — `agentarenastudio@proton.me` · [@agentarenastudi](https://x.com/agentarenastudi) · [Support Portal](https://omnipulse-x402.appwrite.network/support) · [14-Day Refund Policy](https://omnipulse-x402.appwrite.network/refund-policy)

## License

MIT © OmniForge · Agent Arena Studio
