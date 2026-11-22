#!/usr/bin/env node
/**
 * BrandShield Lite CLI v1.1.0 — Zero-dependency startup name & trademark clearance scanner.
 * Checks domains via authoritative IANA RDAP (zero broker front-running),
 * developer/social handles, Apple/Google app stores, and USPTO federal trademarks.
 * Supports terminal, JSON, GitHub Actions Step Summary (--markdown), and CI exit gates.
 *
 * Need 500-name batch CSV/JSON scanning, USPTO Nice Class conflict scoring,
 * 60+ collision-free name variations, and white-label client reports?
 * Get BrandShield Pro ($19 Solo / $39 Agency):
 *   https://agentarenastudi.gumroad.com/l/omniforge-brandshield
 */

import fs from "node:fs";

const DIAGNOSTIC_API = "https://brand-checker.appwrite.network";
const PRO_URL = "https://agentarenastudi.gumroad.com/l/omniforge-brandshield";
const DIRECT_URL = "https://omnipulse-x402.appwrite.network/checkout/brandshield";
const STACK_URL = "https://agentarenastudi.gumroad.com/l/omniforge-launch-stack";
const STACK_DIRECT_URL = "https://omnipulse-x402.appwrite.network/checkout/launch-stack";
const COMPARE_URL = "https://zcoldwater.github.io/brandshield-cli/compare.html";

const RDAP_FALLBACK = {
  com: "https://rdap.verisign.com/com/v1/domain/",
  net: "https://rdap.verisign.com/net/v1/domain/",
  org: "https://rdap.publicinterestregistry.org/rdap/domain/",
  io: "https://rdap.identitydigital.services/rdap/domain/",
  ai: "https://rdap.identitydigital.services/rdap/domain/",
  app: "https://pubapi.registry.google/rdap/domain/",
  dev: "https://pubapi.registry.google/rdap/domain/",
};

const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = {
    name: "",
    tlds: "com,io,ai,co,app,dev",
    json: false,
    markdown: false,
    ci: false,
    out: "",
    minScore: 0,
    failOnTrademark: false,
    failOnTakenCom: false,
    help: false,
  };
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "-h" || a === "--help") opts.help = true;
    else if (a === "--json") opts.json = true;
    else if (a === "--markdown" || a === "--summary") opts.markdown = true;
    else if (a === "--ci") opts.ci = true;
    else if (a === "--fail-on-trademark") opts.failOnTrademark = true;
    else if (a === "--fail-on-taken-com") opts.failOnTakenCom = true;
    else if (a === "--tlds" && args[i + 1]) opts.tlds = args[++i];
    else if (a.startsWith("--tlds=")) opts.tlds = a.slice(7);
    else if (a === "--out" && args[i + 1]) opts.out = args[++i];
    else if (a.startsWith("--out=")) opts.out = a.slice(6);
    else if (a === "--min-score" && args[i + 1]) opts.minScore = Number(args[++i]) || 0;
    else if (a.startsWith("--min-score=")) opts.minScore = Number(a.slice(12)) || 0;
    else positional.push(a);
  }
  if (positional[0] === "check") positional.shift();
  opts.name = (positional[0] || "").trim();
  return opts;
}

function printHelp() {
  console.log(`
${C.bold}${C.cyan}BrandShield CLI (Lite v1.1.0)${C.reset} — Startup Naming, Domain & USPTO Conflict Scanner

${C.bold}USAGE${C.reset}
  npx github:zColdWater/brandshield-cli check <BrandName> [options]

${C.bold}EXAMPLES${C.reset}
  npx github:zColdWater/brandshield-cli check Lumora
  npx github:zColdWater/brandshield-cli check "BrightPath" --tlds com,io,ai,dev
  npx github:zColdWater/brandshield-cli check Notion --json
  npx github:zColdWater/brandshield-cli check Lumora --markdown --min-score 70

${C.bold}OPTIONS${C.reset}
  --tlds <list>         Comma-separated TLDs to verify (default: com,io,ai,co,app,dev)
  --json                Output structured JSON report
  --markdown            Output GitHub-Flavored Markdown table (great for CI summaries)
  --out <path>          Write structured JSON report to a file
  --min-score <0-100>   Exit with code 2 if BrandShield clearance score is below threshold
  --fail-on-trademark   Exit with code 2 if live USPTO federal trademarks conflict
  --fail-on-taken-com   Exit with code 2 if the .com domain is already registered
  --ci                  Write outputs to $GITHUB_OUTPUT (when running in GitHub Actions)
  -h, --help            Show this help screen

${C.bold}FREE WEB SCANNER & COMPARISON${C.reset}
  Live Scanner: ${DIAGNOSTIC_API}
  Comparison:   ${COMPARE_URL}

${C.bold}UPGRADE TO BRANDSHIELD PRO ($19 Solo / $39 Agency)${C.reset}
  500-name batch CSV/JSON CLI, USPTO Nice Class phonetic/fuzzy risk scoring,
  60-name collision-free variation engine, offline HTML workbench & white-label reports:
  Gumroad: ${C.cyan}${PRO_URL}${C.reset}
  Direct:  ${C.cyan}${DIRECT_URL}${C.reset}
`);
}

async function fallbackLocalCheck(name, tlds) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const checkedAt = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

  const domains = await Promise.all(
    tlds.map(async (tld) => {
      const base = RDAP_FALLBACK[tld];
      const domain = `${slug}.${tld}`;
      if (!base) return { domain, status: "unconfirmed", detail: "WHOIS TLD — use BrandShield Pro or Web Scanner", checkedAt };
      try {
        const r = await fetch(`${base}${domain}`, { signal: AbortSignal.timeout(7000) });
        if (r.status === 404) return { domain, status: "available", source: "RDAP", checkedAt };
        if (r.ok) return { domain, status: "taken", source: "RDAP", checkedAt };
        return { domain, status: "unconfirmed", checkedAt };
      } catch {
        return { domain, status: "unconfirmed", checkedAt };
      }
    })
  );

  const handles = await Promise.all([
    (async () => {
      try {
        const r = await fetch(`https://api.github.com/users/${slug}`, {
          headers: { "user-agent": "brandshield-cli/1.1" },
          signal: AbortSignal.timeout(6000),
        });
        return { platform: "GitHub", key: "github", handle: slug, status: r.status === 404 ? "available" : r.ok ? "taken" : "unconfirmed", checkedAt };
      } catch {
        return { platform: "GitHub", key: "github", handle: slug, status: "unconfirmed", checkedAt };
      }
    })(),
    (async () => {
      try {
        const r = await fetch(`https://registry.npmjs.org/${slug}`, { signal: AbortSignal.timeout(6000) });
        return { platform: "npm (package)", key: "npm", handle: slug, status: r.status === 404 ? "available" : r.ok ? "taken" : "unconfirmed", checkedAt };
      } catch {
        return { platform: "npm (package)", key: "npm", handle: slug, status: "unconfirmed", checkedAt };
      }
    })(),
    (async () => {
      try {
        const r = await fetch(`https://pypi.org/pypi/${slug}/json`, { signal: AbortSignal.timeout(6000) });
        return { platform: "PyPI (package)", key: "pypi", handle: slug, status: r.status === 404 ? "available" : r.ok ? "taken" : "unconfirmed", checkedAt };
      } catch {
        return { platform: "PyPI (package)", key: "pypi", handle: slug, status: "unconfirmed", checkedAt };
      }
    })(),
  ]);

  let apps = [{ store: "Apple App Store (US)", status: "unconfirmed", matches: [], checkedAt }];
  try {
    const r = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(name)}&entity=software&country=us&limit=10`, {
      signal: AbortSignal.timeout(7000),
    });
    if (r.ok) {
      const data = await r.json();
      const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const target = norm(name);
      const matches = (data.results || [])
        .filter((a) => norm(String(a.trackName || "").split(/\s[-–—:|]\s|:\s/)[0]) === target)
        .slice(0, 5)
        .map((a) => ({ title: a.trackName, developer: a.sellerName || a.artistName, url: a.trackViewUrl }));
      apps = [{ store: "Apple App Store (US)", status: "checked", matches, checkedAt }];
    }
  } catch {
    // ignore
  }

  let trademarks = [{ country: "US", database: "USPTO Trademark Search", status: "unconfirmed", live: [], liveCount: 0, checkedAt }];
  try {
    const r = await fetch("https://tmsearch.uspto.gov/prod-stage-v1-0-0/tmsearch", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "https://tmsearch.uspto.gov", referer: "https://tmsearch.uspto.gov/search/search-results" },
      body: JSON.stringify({
        query: { bool: { must: [{ match_phrase: { wordmark: name } }] } },
        size: 25,
        _source: ["id", "registrationId", "wordmark", "statusDescription", "alive", "ownerName", "internationalClass"],
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (r.ok) {
      const j = await r.json();
      const live = (j.hits?.hits || [])
        .map((h) => h.source)
        .filter((s) => s && s.alive && s.wordmark)
        .map((s) => ({
          mark: s.wordmark,
          match: String(s.wordmark).toLowerCase().replace(/[^a-z0-9]/g, "") === slug ? "identical" : "very similar",
          serial: s.id,
          registration: s.registrationId || null,
          status: s.statusDescription || "LIVE",
          live: true,
          owner: Array.isArray(s.ownerName) ? s.ownerName[s.ownerName.length - 1] : s.ownerName,
          classes: (s.internationalClass || []).join(", "),
        }));
      trademarks = [{ country: "US", database: "USPTO Trademark Search (tmsearch.uspto.gov)", status: "checked", live, liveCount: live.length, checkedAt }];
    }
  } catch {
    // ignore
  }

  // Lightweight fallback score
  let score = 100;
  const com = domains.find((d) => d.domain.endsWith(".com"));
  if (com?.status === "taken") score -= 18;
  const liveTm = trademarks[0]?.live || [];
  const identLive = liveTm.filter((m) => m.match === "identical");
  const tmRisk = identLive.length ? "HIGH" : liveTm.length ? "MEDIUM" : "CLEAR";
  if (identLive.length) score -= 40;
  else if (liveTm.length) score -= 14;
  const appHits = apps.reduce((a, s) => a + (s.matches?.length || 0), 0);
  if (appHits) score -= Math.min(16, 8 + appHits * 2);
  score = Math.max(0, Math.min(100, score));
  const verdict = score < 40 ? "DO_NOT_USE" : tmRisk === "HIGH" || score < 65 ? "HIGH_RISK" : score < 82 ? "CAUTION" : "GREENLIGHT";

  return {
    ok: true,
    mode: "local-rdap-fallback",
    name,
    checkedAt,
    risk: {
      score,
      riskScore: 100 - score,
      verdict,
      verdictLabel: verdict.replace(/_/g, " "),
      tmRisk,
      stats: {
        domainsAvailable: domains.filter((d) => d.status === "available").length,
        domainsTotal: domains.length,
        comAvailable: com ? com.status === "available" : null,
        appCollisions: appHits,
        tmLiveTotal: liveTm.length,
        tmIdenticalLive: identLive.length,
      },
      flags: [],
      wins: [],
    },
    domains,
    handles,
    apps,
    trademarks,
  };
}

function extractMarks(tmRaw) {
  if (!Array.isArray(tmRaw)) return { live: [], liveCount: 0, db: "USPTO Trademark Search" };
  const us = tmRaw.find((t) => t && (t.country === "US" || Array.isArray(t.live))) || tmRaw[0];
  if (!us) return { live: [], liveCount: 0, db: "USPTO Trademark Search" };
  if (Array.isArray(us.live)) return { live: us.live, liveCount: us.liveCount ?? us.live.length, db: us.database || "USPTO Trademark Search" };
  if (Array.isArray(us.matches)) {
    const live = us.matches.filter((m) => m.live !== false);
    return { live, liveCount: us.liveCount ?? live.length, db: us.database || "USPTO Trademark Search" };
  }
  return { live: [], liveCount: 0, db: "USPTO Trademark Search" };
}

function extractApps(appsRaw) {
  const out = [];
  if (!Array.isArray(appsRaw)) return out;
  for (const entry of appsRaw) {
    if (Array.isArray(entry.matches)) {
      for (const m of entry.matches) {
        out.push({ store: entry.store || entry.platform || "App Store", name: m.title || m.name, seller: m.developer || m.seller || "", url: m.url || "" });
      }
    } else if (entry.name || entry.title) {
      out.push({ store: entry.store || "App Store", name: entry.name || entry.title, seller: entry.seller || "", url: entry.url || "" });
    }
  }
  return out;
}

function badge(status) {
  const s = String(status || "").toLowerCase();
  if (s === "available" || s === "free") return `${C.green}✔ AVAILABLE${C.reset}`;
  if (s === "taken" || s === "registered" || s === "live") return `${C.red}✖ TAKEN${C.reset}`;
  return `${C.yellow}? UNCONFIRMED${C.reset}`;
}

function mdStatus(status) {
  const s = String(status || "").toLowerCase();
  if (s === "available" || s === "free") return "✅ Available";
  if (s === "taken" || s === "registered" || s === "live") return "❌ Taken";
  return "⚠️ Unconfirmed";
}

function escMd(s) {
  return String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function renderMarkdown(report) {
  const risk = report.risk || {};
  const score = risk.score ?? "N/A";
  const verdict = risk.verdictLabel || risk.verdict || "Checked";
  const tmRisk = risk.tmRisk || "UNKNOWN";
  const domains = report.domains || [];
  const handles = report.handles || [];
  const apps = extractApps(report.apps || report.appStores);
  const { live: marks, liveCount, db } = extractMarks(report.trademarks);

  const icon = risk.verdict === "GREENLIGHT" ? "🟢" : risk.verdict === "CAUTION" ? "🟡" : "🔴";
  const lines = [
    `## 🛡️ BrandShield Diagnostic — \`${escMd(report.name)}\``,
    ``,
    `${icon} **Clearance Score:** **${score}/100** · **Verdict:** ${escMd(verdict)} · **USPTO Risk:** \`${escMd(tmRisk)}\` · _Checked ${escMd(report.checkedAt || new Date().toISOString())}_`,
    ``,
  ];

  if (risk.flags?.length) {
    lines.push(`**Key Risk Flags:**`);
    for (const f of risk.flags) lines.push(`- **[${String(f.severity || "info").toUpperCase()}] ${escMd(f.area)}:** ${escMd(f.message)}`);
    lines.push(``);
  }

  lines.push(`### 1. Domains (Live Registry RDAP / WHOIS)`);
  lines.push(`| Domain | Status | Evidence |`);
  lines.push(`|---|---|---|`);
  for (const d of domains) lines.push(`| \`${escMd(d.domain)}\` | ${mdStatus(d.status)} | ${escMd([d.detail, d.source].filter(Boolean).join(" · ") || "—")} |`);

  if (handles.length) {
    lines.push(``, `### 2. Developer & Social Handles`);
    lines.push(`| Platform | Handle | Status |`);
    lines.push(`|---|---|---|`);
    for (const h of handles) lines.push(`| ${escMd(h.platform || h.site)} | \`${escMd(h.handle)}\` | ${mdStatus(h.status)} |`);
  }

  lines.push(``, `### 3. Mobile App Stores (Apple App Store & Google Play)`);
  if (!apps.length) lines.push(`- ✅ No exact-title mobile app collisions detected.`);
  else for (const a of apps.slice(0, 6)) lines.push(`- ❌ **${escMd(a.name)}** — ${escMd(a.store)}${a.seller ? ` (${escMd(a.seller)})` : ""}`);

  lines.push(``, `### 4. US Federal Trademarks (${escMd(db)})`);
  if (!marks.length) {
    lines.push(`- ✅ No live identical or similar federal USPTO word marks found.`);
  } else {
    lines.push(`⚠️ **${liveCount} live USPTO mark(s) found** (showing top ${Math.min(6, marks.length)}):`, ``);
    lines.push(`| Mark | Match | Reg / Serial | Nice Classes | Status | Owner |`);
    lines.push(`|---|---|---|---|---|---|`);
    for (const m of marks.slice(0, 6)) {
      const id = m.registration ? `Reg #${m.registration}` : `Serial #${m.serial || "N/A"}`;
      lines.push(`| **${escMd(m.mark)}** | ${escMd(m.match || "match")} | ${escMd(id)} | ${escMd(m.classes || "—")} | ${escMd(m.status || "LIVE")} | ${escMd((m.owner || "").slice(0, 48))} |`);
    }
  }

  lines.push(
    ``,
    `---`,
    `> ⚖️ *Trademark results are an informational starting point, not legal advice. Read-only lookup — searched names are never logged or registered.*`,
    `> 🚀 **Need 500-name batch screening, 60+ verified variations & white-label HTML reports?** Get **[BrandShield Pro ($19 Solo / $39 Agency)](${PRO_URL})** ([Instant Direct Checkout](${DIRECT_URL})) · [Free Web Scanner](${DIAGNOSTIC_API}) · [Compare Tools](${COMPARE_URL})`
  );
  return lines.join("\n");
}

function writeGithubOutputs(report, outFile) {
  const ghOut = process.env.GITHUB_OUTPUT;
  if (!ghOut) return;
  const risk = report.risk || {};
  const com = (report.domains || []).find((d) => String(d.domain || "").endsWith(".com"));
  const comStatus = com ? (com.status === "available" ? "true" : com.status === "taken" ? "false" : "unconfirmed") : "unconfirmed";
  const { liveCount } = extractMarks(report.trademarks);
  const pairs = [
    ["score", String(risk.score ?? 0)],
    ["verdict", String(risk.verdict || "UNKNOWN")],
    ["tm-risk", String(risk.tmRisk || "UNKNOWN")],
    ["com-available", comStatus],
    ["live-trademarks", String(liveCount)],
    ["report-json", String(outFile || "")],
  ];
  fs.appendFileSync(ghOut, pairs.map(([k, v]) => `${k}=${v}\n`).join(""), "utf8");
}

async function main() {
  const opts = parseArgs(process.argv);
  if (opts.help || !opts.name) {
    printHelp();
    process.exit(opts.help ? 0 : 1);
  }

  if (opts.name.includes(",")) {
    if (!opts.json && !opts.markdown) {
      console.error(
        `${C.yellow}Note:${C.reset} BrandShield Lite checks 1 candidate name per run.\n` +
          `For 500-name batch CSV/JSON scanning & 60+ collision-free variations, get BrandShield Pro:\n` +
          `  ${C.cyan}${PRO_URL}${C.reset}\n`
      );
    }
    opts.name = opts.name.split(",")[0].trim();
  }

  const tlds = opts.tlds.split(",").map((x) => x.trim().replace(/^\./, "").toLowerCase()).filter(Boolean);
  if (!opts.json && !opts.markdown) {
    console.log(`\n${C.bold}Scanning "${opts.name}"${C.reset} ${C.dim}(authoritative RDAP + handles + app stores + USPTO)...${C.reset}`);
  }

  let report = null;
  try {
    const cleanTlds = tlds.map((t) => encodeURIComponent(t)).join(",");
    const url = `${DIAGNOSTIC_API}/api/free-check?name=${encodeURIComponent(opts.name)}&tlds=${cleanTlds}`;
    const res = await fetch(url, {
      headers: { accept: "application/json", "user-agent": "brandshield-cli/1.1" },
      signal: AbortSignal.timeout(35_000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.ok && data.domains?.length) report = data;
    }
  } catch {
    // Fall back cleanly to direct RDAP + public registry + USPTO lookups
  }

  if (!report) {
    report = await fallbackLocalCheck(opts.name, tlds);
  }

  if (opts.out) {
    fs.writeFileSync(opts.out, JSON.stringify(report, null, 2) + "\n", "utf8");
  }
  if (opts.ci) {
    writeGithubOutputs(report, opts.out);
  }

  if (opts.json) {
    console.log(JSON.stringify(report, null, 2));
  } else if (opts.markdown) {
    console.log(renderMarkdown(report));
  } else {
    const risk = report.risk || {};
    const domains = report.domains || [];
    const handles = report.handles || [];
    const appMatches = extractApps(report.apps || report.appStores);
    const { live: markList, liveCount } = extractMarks(report.trademarks);

    const scoreColor = (risk.score ?? 50) >= 82 ? C.green : (risk.score ?? 50) >= 65 ? C.yellow : C.red;
    console.log(`\n${C.bold}BrandShield Clearance Score:${C.reset} ${scoreColor}${C.bold}${risk.score ?? "N/A"}/100${C.reset} — ${C.bold}${risk.verdictLabel || risk.verdict || ""}${C.reset} ${C.dim}(USPTO Risk: ${risk.tmRisk || "N/A"})${C.reset}`);
    if (risk.flags?.length) {
      for (const f of risk.flags) console.log(`   ${C.red}• [${String(f.severity || "").toUpperCase()}] ${f.area}:${C.reset} ${f.message}`);
    }

    console.log(`\n${C.bold}1. Domain Availability (Live Registry RDAP — Zero Front-Running)${C.reset}`);
    for (const d of domains) {
      console.log(`   ${String(d.domain || "").padEnd(28)} ${badge(d.status)}`);
    }

    if (handles.length) {
      console.log(`\n${C.bold}2. Social & Developer Handles${C.reset}`);
      for (const h of handles) {
        const label = `${h.platform || h.site}: @${String(h.handle || "").replace(/^@/, "")}`;
        console.log(`   ${label.padEnd(32)} ${badge(h.status)}`);
      }
    }

    console.log(`\n${C.bold}3. Mobile App Stores (iOS & Google Play)${C.reset}`);
    if (!appMatches.length) {
      console.log(`   ${C.green}✔ No exact-title mobile apps detected${C.reset}`);
    } else {
      for (const a of appMatches.slice(0, 6)) {
        console.log(`   ${C.red}✖ ${a.name}${C.reset} — ${a.store} ${C.dim}(${a.seller || "Publisher"})${C.reset}`);
      }
    }

    console.log(`\n${C.bold}4. US Federal Trademarks (USPTO)${C.reset}`);
    if (!markList.length) {
      console.log(`   ${C.green}✔ No live identical or similar USPTO word marks found${C.reset}`);
    } else {
      console.log(`   ${C.red}⚠ ${liveCount} live USPTO mark(s) matched:${C.reset}`);
      for (const m of markList.slice(0, 6)) {
        const reg = m.registration ? `Reg #${m.registration}` : `Serial #${m.serial || "N/A"}`;
        const cls = m.classes ? ` [${m.classes}]` : "";
        console.log(`   ${C.red}✖ ${m.mark || opts.name}${C.reset} (${m.match || "match"}) — ${reg}${cls} ${C.dim}(${(m.owner || "").slice(0, 48)})${C.reset}`);
      }
    }

    console.log(`\n${C.dim}Disclaimer: Trademark results are an informational starting point, not legal advice. Searched names are never logged or registered.${C.reset}`);
    console.log(
      `\n${C.bold}${C.magenta}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n` +
        `${C.bold}Need to vet 50–500 candidate names & score phonetic USPTO Nice Class risks?${C.reset}\n` +
        `Upgrade to ${C.bold}BrandShield Pro${C.reset} ($19 Solo / $39 Agency — 100% offline Node 22 source kit):\n` +
        `  • Batch CSV/JSON scanner (up to 500 names) + 60-variation collision-free generator\n` +
        `  • USPTO Nice Class 9/35/42 similarity & phonetic conflict scoring\n` +
        `  • Local interactive HTML comparison workbench & white-label client reports\n` +
        `  👉 Gumroad (Card/PayPal):  ${C.bold}${C.cyan}${PRO_URL}${C.reset}\n` +
        `  ⚡ Instant Direct ZIP:     ${C.cyan}${DIRECT_URL}${C.reset}\n` +
        `  📦 3-in-1 Launch Stack:    ${C.cyan}${STACK_URL}${C.reset} ${C.dim}(Direct: ${STACK_DIRECT_URL})${C.reset}\n` +
        `  🌐 Free Web Scanner:       ${C.cyan}${DIAGNOSTIC_API}${C.reset}\n` +
        `${C.bold}${C.magenta}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n`
    );
  }

  // Optional CI gate assertions
  const score = report.risk?.score ?? 0;
  const tmRisk = report.risk?.tmRisk || "UNKNOWN";
  const com = (report.domains || []).find((d) => String(d.domain || "").endsWith(".com"));
  const failures = [];
  if (opts.minScore > 0 && score < opts.minScore) failures.push(`Clearance score ${score}/100 is below min-score ${opts.minScore}`);
  if (opts.failOnTrademark && tmRisk !== "CLEAR") failures.push(`USPTO trademark risk is ${tmRisk} (expected CLEAR)`);
  if (opts.failOnTakenCom && com?.status === "taken") failures.push(`${com.domain} is already registered`);

  if (failures.length) {
    console.error(`\nBrandShield CI gate failed:\n- ${failures.join("\n- ")}`);
    process.exit(2);
  }
}

main();
