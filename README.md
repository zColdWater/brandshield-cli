# BrandShield v6.4 — Free 78-TLD Instant Domain, Real Aftermarket & USPTO Trademark Auditor

**Check startup & product name availability in under 1 second across 78+ TLDs via public Anycast DNS & authoritative IANA RDAP (zero domain front-running), live 17-rule DNS NS aftermarket detection, USPTO Class 009/042 federal trademarks, iOS/Android app stores, and GitHub/npm/PyPI/X handles — 100% free forever in your browser, via zero-install `curl /cli.sh`, or in CI via `zColdWater/brandshield-cli@v1`.**

[![BrandShield Clearance](https://brand.shipbastion.com/badge/brand/BrandShieldCLI.svg)](https://brand.shipbastion.com/report/BrandShieldCLI)
[![Email Security](https://inbox.shipbastion.com/badge/inbox/stripe.com.svg)](https://inbox.shipbastion.com/?domain=stripe.com)
[![AI CiteReady](https://cite.shipbastion.com/badge/citeready/stripe.com.svg)](https://cite.shipbastion.com/?url=https://stripe.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node.js >= 18](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](./package.json)
[![GitHub Action](https://img.shields.io/badge/GitHub%20Action-v1-2088FF.svg?logo=githubactions&logoColor=white)](./action.yml)

### Live Free Tools & Interactive Benchmarks

- **Flagship v6.5 Web App (100% Free Forever — 78+ TLDs, Real NS Aftermarket, USPTO, 50-Brand CSV, A4 PDF):** [https://brand.shipbastion.com](https://brand.shipbastion.com)
- **Live Startup Typosquatting & Lookalike Domain Shield (28 DNSTwist Variants + RDAP/MX):** [Live `/typos` App](https://brand.shipbastion.com/typos) · [Interactive Static Scanner](https://zcoldwater.github.io/brandshield-cli/typosquatting-udrp-checker.html)
- **78-TLD Cross-Registrar Price Matrix (Cloudflare At-Cost vs. Porkbun vs. Namecheap vs. GoDaddy):** [https://brand.shipbastion.com/tlds](https://brand.shipbastion.com/tlds)
- **Free AI Brand Namer (60 Ideas + Live `.com`/`.ai`/`.io` RDAP):** [https://brand.shipbastion.com/namer](https://brand.shipbastion.com/namer)
- **Startup Domain Renewal & 5-Year TLD Cost Calculator:** [Interactive Calculator](https://zcoldwater.github.io/brandshield-cli/domain-renewal-5yr-calculator.html)
- **Live Domain Hack & Prefix/Suffix Brand Generator (185+ IANA TLDs):** [Interactive Generator](https://zcoldwater.github.io/brandshield-cli/domain-hack-generator.html)
- **2026 Top 100 AI Startups TLD Benchmark (`.ai` 41% vs `.com` 40% & Aftermarket Study):** [Interactive Report](https://zcoldwater.github.io/brandshield-cli/ai-startup-tld-benchmark-2026.html) · [Raw JSON Dataset (N=100)](https://zcoldwater.github.io/brandshield-cli/ai-startup-tld-benchmark-2026.json)
- **Honest Comparisons:** [InstantDomainSearch vs. BrandShield](https://zcoldwater.github.io/launch-audit-reports/compare/instantdomainsearch-vs-brandshield.html) · [vs. Namecheap, Namechk & USPTO](https://zcoldwater.github.io/brandshield-cli/compare.html)
- **OmniForge 4-in-1 Launch Audit Suite (`$5` Launch Special, was `$29` — Unlocks VibeShield + InboxShield + CiteReady Pro; BrandShield 100% Free):** [Gumroad Bundle](https://api.shipbastion.com/go/gumroad/launch-stack) · [Direct Checkout](https://api.shipbastion.com/checkout/launch-stack)

---

## Zero-Install 1-Line Terminal Audit (`GET /cli.sh`)

Run a live RDAP + handle + USPTO brand clearance check directly from any POSIX shell with zero installs:

```bash
# Instant colored terminal report (78+ TLDs, handles, USPTO, /tlds pricing)
curl -fsSL https://brand.shipbastion.com/cli.sh | sh -s -- Lumora

# Machine-readable JSON output for scripts & CI pipelines
curl -fsSL https://brand.shipbastion.com/cli.sh | sh -s -- --json Lumora

# CI/CD clearance gate (exits code 2 if score < 75)
curl -fsSL https://brand.shipbastion.com/cli.sh | sh -s -- --fail-below 75 Lumora
```

---

## Why Founders Switch to BrandShield v6.4 (`100% Free Forever`)

1. **78+ TLDs in Under 1 Second + Direct IANA RDAP (Zero Front-Running):** Queries public Anycast DNS (`1.1.1.1`/`8.8.8.8`) and official registry RDAP servers directly (`verisign`, `identitydigital`, `registry.google`, `pir.org`) in read-only mode — never logs, caches, or front-runs searched startup names.
2. **Real Authoritative DNS NS Aftermarket Detection (Zero Invented Prices):** Detects active broker parking nameservers (`afternic.com`, `sedoparking.com`, `dan.com`, `atom.com`, `bodis.com`, `spaceship.net`) so you immediately see which taken domains are genuinely listed for sale, with 1-click multi-registrar price comparison (`Cloudflare At-Cost`, `Porkbun`, `Namecheap`, `GoDaddy`, `Sedo`, `Afternic`).
3. **USPTO Class 009/042 Trademark + App Store Screening in One Screen:** Surfaces live federal word marks with serial/registration numbers and software Nice Classes alongside Apple App Store, Google Play, GitHub, npm, PyPI, and X handles.
4. **All Pro Workflows 100% Free Forever:** 60-candidate AI Brand Namer with phonetic scoring, 50-brand online batch scanner with UTF-8 Excel/CSV export, 5-platform brand protection wizard, and custom-header printable A4 PDF clearance dossiers — zero paywall, zero login, zero monthly subscriptions.

---

## BrandShield Free Forever vs. OmniForge Launch Audit Suite

| Capability | BrandShield v6.4 (`100% Free`) | Single Audit Fix Pack (`$2` Once) | Complete Launch Suite (`$5`, was `$29`) |
| :--- | :---: | :---: | :---: |
| **Live 78+ TLD Instant Search & IANA RDAP** | **100% Free Forever** | Included Free | Included Free |
| **Real NS Aftermarket + 78-TLD Registrar Matrix (`/tlds`)** | **100% Free Forever** | Included Free | Included Free |
| **USPTO Class 009/042 + App Store + Dev Handles** | **100% Free Forever** | Included Free | Included Free |
| **60-Idea Brand Namer, 50-Brand Batch CSV & A4 PDF** | **100% Free Forever** | Included Free | Included Free |
| **VibeShield Pro Fix Pack** (JS secrets, CSP, Supabase RLS) | Free Live Audit | [$2 Once](https://api.shipbastion.com/go/gumroad/vibeshield) | **Included** |
| **InboxShield Pro Fix Pack** (SPF Flattener, DKIM, DMARC) | Free Live Audit | [$2 Once](https://api.shipbastion.com/go/gumroad/inboxshield) | **Included** |
| **CiteReady Pro Fix Pack** (10 AI Bots, Schema, `/llms.txt`) | Free Live Audit | [$2 Once](https://api.shipbastion.com/go/gumroad/citeready) | **Included** |

**[Open BrandShield v6.4 Free](https://brand.shipbastion.com)** · **[Complete Launch Suite ($5, was $29)](https://api.shipbastion.com/go/gumroad/launch-stack)** · **[Direct Checkout](https://api.shipbastion.com/checkout/launch-stack)**

---

## Optional Open-Source Node.js CLI & GitHub Action (`uses: zColdWater/brandshield-cli@v1`)

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
[![BrandShield Clearance](https://brand.shipbastion.com/badge/brand/YourBrandName.svg)](https://brand.shipbastion.com/report/YourBrandName)
```

---

## OmniForge Pre-Launch Audit Suite (2026)

| App | What It Audits Live in `<2s` | Live Free Web App | Fix Pack (One-Time) |
| :--- | :--- | :--- | :---: |
| **BrandShield v6.4** | 78+ TLD instant RDAP, real NS aftermarket, USPTO Class 009/042 & 60-idea Namer | [brand.shipbastion.com](https://brand.shipbastion.com) | **100% Free Forever** |
| **VibeShield v7.0** | JS bundle secrets (38 rules), 10/10 security headers & read-only Supabase RLS probe | [shipbastion.com](https://shipbastion.com) | [$2 Once (was $9)](https://api.shipbastion.com/go/gumroad/vibeshield) |
| **InboxShield v6.0** | Recursive SPF `<=10` flattener, 24-selector DKIM, DMARC, MX & 5 DNSBLs | [inbox.shipbastion.com](https://inbox.shipbastion.com) | [$2 Once (was $15)](https://api.shipbastion.com/go/gumroad/inboxshield) |
| **CiteReady v7.0** | 10 global & China AI search bots, Schema.org Entity Graph & `/llms.txt` compiler | [cite.shipbastion.com](https://cite.shipbastion.com) | [$2 Once (was $12)](https://api.shipbastion.com/go/gumroad/citeready) |
| **4-in-1 Launch Stack** | Unlocks VibeShield + InboxShield + CiteReady Pro in one key (Save 83%) | All 4 Live Web Apps | [$5 Once (was $29)](https://api.shipbastion.com/go/gumroad/launch-stack) |

## Privacy, Support & Legal Notice

- **Read-only guarantee:** BrandShield never registers, reserves, caches, logs, or resells any name, domain, or handle you check.
- **Not legal advice:** Preliminary public USPTO trademark screening helps eliminate obvious collisions early and is not formal legal counsel from a trademark attorney.
- **Support & Refunds:** OmniForge · Agent Arena Studio — `agentarenastudio@proton.me` · [@agentarenastudi](https://x.com/agentarenastudi) · [Support Portal](https://api.shipbastion.com/support) · [14-Day Refund Policy](https://api.shipbastion.com/refund-policy)

## License

MIT © OmniForge · Agent Arena Studio
