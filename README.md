# BrandShield CLI & GitHub Action (`brandshield-cli`)

**Check startup & product name availability across domains (via authoritative RDAP), social/developer handles, iOS/Android app stores, and USPTO federal trademarks — from your terminal or GitHub Actions CI, without leaking ideas to domain-broker search bars.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node.js >= 18](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](./package.json)
[![GitHub Action](https://img.shields.io/badge/GitHub%20Action-v1-2088FF.svg?logo=githubactions&logoColor=white)](./action.yml)

- **Live Free Web Scanner:** [https://brand-checker.appwrite.network](https://brand-checker.appwrite.network)
- **Landing Page & Docs:** [https://zcoldwater.github.io/brandshield-cli/](https://zcoldwater.github.io/brandshield-cli/)
- **Comparison & Live Benchmarks (BrandShield vs. Namecheap, Namechk & USPTO):** [https://zcoldwater.github.io/brandshield-cli/compare.html](https://zcoldwater.github.io/brandshield-cli/compare.html)
- **BrandShield Pro (Batch 500-Name Kit, Nice Class Scoring & Agency Reports):** [https://agentarenastudi.gumroad.com/l/omniforge-brandshield](https://agentarenastudi.gumroad.com/l/omniforge-brandshield)
- **⚡ Instant Direct / Agent Checkout (24/7 Instant ZIP Download):** [https://omnipulse-x402.appwrite.network/checkout/brandshield](https://omnipulse-x402.appwrite.network/checkout/brandshield) | **3-in-1 Founder Launch Stack ($49/$89):** [https://omnipulse-x402.appwrite.network/checkout/launch-stack](https://omnipulse-x402.appwrite.network/checkout/launch-stack)

---

## Why Founders Use BrandShield Instead of Registrar Search Bars

1. **Zero Domain Front-Running:** Typing unreleased startup names into third-party domain search widgets can expose queries to commercial broker pipelines. BrandShield queries **official IANA RDAP registry endpoints** directly (`verisign`, `identitydigital`, `registry.google`, `pir.org`) with read-only lookups.
2. **USPTO Federal Trademark Reality Check:** Discovering a `.ai` domain is free means nothing if an active US Class 9 or Class 42 software trademark blocks your Stripe account, App Store listing, or seed round.
3. **Honest Social Handle Verification:** Platforms like Instagram and TikTok serve identical login walls for free and taken handles. Instead of guessing and giving false "available" signals, BrandShield verifies public endpoints (GitHub, X, YouTube, Bluesky, npm, PyPI) and explicitly flags unauthenticated walls as `Unconfirmed`.
4. **Deterministic Clearance Score + CI Gates:** Get an instant `0–100` clearance score (`GREENLIGHT` / `CAUTION` / `HIGH_RISK` / `DO_NOT_USE`) in your terminal or directly inside GitHub Actions Job Summaries.

---

## Quick Start (Zero Install via `npx`)

Requires **Node.js 18+** (zero `npm` dependencies):

```bash
# Check a candidate startup or SaaS name
npx github:zColdWater/brandshield-cli check Lumora

# Custom domain extensions
npx github:zColdWater/brandshield-cli check BrightPath --tlds com,io,ai,dev,app,co

# GitHub-Flavored Markdown table + CI exit-code gates
npx github:zColdWater/brandshield-cli check Lumora --markdown --min-score 70 --fail-on-trademark

# Machine-readable JSON output for scripts
npx github:zColdWater/brandshield-cli check Notion --json --out report.json
```

---

## One-Click GitHub Action (`uses: zColdWater/brandshield-cli@v1`)

Add automated brand & USPTO trademark clearance directly to product launch checklists or naming-PR workflows. Runs in ~3–8 seconds on any Ubuntu/macOS runner with zero `npm install` overhead and renders a full Markdown table in the **GitHub Actions Job Summary**:

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
          min-score: "70"           # Optional: fail if score < 70/100
          fail-on-trademark: "true" # Optional: fail on live USPTO conflict
          fail-on-taken-com: "false"
          post-summary: "true"      # Writes formatted Markdown table to Job Summary
          out-file: "brandshield-report.json"

      - name: Print Outputs
        run: |
          echo "Score: ${{ steps.brand.outputs.score }}/100"
          echo "Verdict: ${{ steps.brand.outputs.verdict }}"
          echo "USPTO Risk: ${{ steps.brand.outputs.tm-risk }}"
          echo ".com Available: ${{ steps.brand.outputs.com-available }}"
          echo "Live Trademarks: ${{ steps.brand.outputs.live-trademarks }}"
```

---

## Free Lite CLI vs. BrandShield Pro

`brandshield-cli` (this repository) is our free, MIT-licensed **1-name diagnostic CLI & GitHub Action**. When you are shortlisting dozens of candidates for a startup, SaaS launch, or branding client, upgrade to **[BrandShield Pro](https://agentarenastudi.gumroad.com/l/omniforge-brandshield)** (instant ZIP download, 100% local Node.js source code, no subscriptions):

| Capability | BrandShield Lite (Free OSS) | BrandShield Pro Solo ($19) | BrandShield Pro Agency ($39) |
| :--- | :---: | :---: | :---: |
| **Live RDAP / WHOIS Domain Check** | 1 name / run | Up to **500 names / batch** (CSV/JSON) | Up to **500 names / batch** + custom TLDs |
| **Social & Developer Handles (15)** | Quick check | Full parallel matrix + rate-limit pacing | Full parallel matrix + exportable links |
| **Apple App Store & Google Play** | Exact match | Exact + prefix collision scan | Exact + prefix collision scan |
| **USPTO Trademark Screening** | Live scan + score | **Nice Class 9/35/42 + phonetic/fuzzy matrix** | **Nice Class + phonetic score + counsel brief** |
| **60-Variation Name Generator** | — | **Included** (auto-verified free on domains) | **Included** (60+ prefixes/suffixes/compounds) |
| **Offline HTML Comparison Workbench** | — | **Included** (sortable local UI, 0 cloud lock-in) | **Included** |
| **GitHub Actions CI Support** | **Included (`@v1`)** | **Included** | **Included + agency white-label reports** |
| **White-Label Client Reports (HTML/MD)** | — | Personal projects | **Agency license + custom client branding** |

👉 **[Download BrandShield Pro ($19 Solo / $39 Agency) on Gumroad](https://agentarenastudi.gumroad.com/l/omniforge-brandshield)** · **[⚡ Instant Direct Checkout](https://omnipulse-x402.appwrite.network/checkout/brandshield)** · **[Compare vs. Namecheap & Namechk](https://zcoldwater.github.io/brandshield-cli/compare.html)**

---

## Privacy & Legal Notice

- **Read-only guarantee:** BrandShield never registers, reserves, caches, logs, or resells any name, domain, or handle you check.
- **Not legal advice:** USPTO trademark search results are an informational screening tool to eliminate obvious collisions early, not a formal legal clearance opinion from a trademark attorney.

## License

MIT © OmniForge Studio
