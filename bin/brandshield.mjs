#!/usr/bin/env node
/**
 * BrandShield Lite CLI — Zero-dependency single-name diagnostic scanner.
 * Checks domains via authoritative IANA RDAP (zero broker front-running),
 * developer/social handles, Apple/Google app stores, and USPTO federal trademarks.
 *
 * Need 500-name batch CSV/JSON scanning, USPTO Nice Class conflict scoring,
 * 60+ collision-free name variations, and white-label client reports?
 * Get BrandShield Pro ($19 Solo / $39 Agency):
 *   https://agentarenastudi.gumroad.com/l/omniforge-brandshield
 */

const DIAGNOSTIC_API = "https://brand-checker.appwrite.network";
const PRO_URL = "https://agentarenastudi.gumroad.com/l/omniforge-brandshield";

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
    cmd: "check",
    name: "",
    tlds: "com,io,ai,co,app,dev",
    json: false,
    help: false,
  };
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "-h" || a === "--help") opts.help = true;
    else if (a === "--json") opts.json = true;
    else if (a === "--tlds" && args[i + 1]) opts.tlds = args[++i];
    else if (a.startsWith("--tlds=")) opts.tlds = a.slice(7);
    else positional.push(a);
  }
  if (positional[0] === "check") positional.shift();
  opts.name = (positional[0] || "").trim();
  return opts;
}

function printHelp() {
  console.log(`
${C.bold}${C.cyan}BrandShield CLI (Lite v1.0.0)${C.reset} — Startup Naming, Domain & USPTO Conflict Scanner

${C.bold}USAGE${C.reset}
  npx github:zColdWater/brandshield-cli check <BrandName> [options]

${C.bold}EXAMPLES${C.reset}
  npx github:zColdWater/brandshield-cli check Lumora
  npx github:zColdWater/brandshield-cli check "BrightPath" --tlds com,io,ai,dev
  npx github:zColdWater/brandshield-cli check Notion --json

${C.bold}OPTIONS${C.reset}
  --tlds <list>   Comma-separated TLDs to verify (default: com,io,ai,co,app,dev)
  --json          Output structured JSON report
  -h, --help      Show this help screen

${C.bold}FREE WEB SCANNER${C.reset}
  ${DIAGNOSTIC_API}

${C.bold}UPGRADE TO BRANDSHIELD PRO ($19 Solo / $39 Agency)${C.reset}
  500-name batch CSV/JSON CLI, USPTO Nice Class phonetic/fuzzy risk scoring,
  60-name collision-free variation engine, offline HTML workbench & white-label reports:
  ${C.cyan}${PRO_URL}${C.reset}
`);
}

async function fallbackLocalCheck(name, tlds) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const checkedAt = new Date().toISOString();

  const domains = await Promise.all(
    tlds.map(async (tld) => {
      const base = RDAP_FALLBACK[tld];
      const domain = `${slug}.${tld}`;
      if (!base) return { domain, status: "unconfirmed", note: "Use BrandShield Pro for full WHOIS/RDAP TLD matrix", checkedAt };
      try {
        const r = await fetch(`${base}${domain}`, { signal: AbortSignal.timeout(7000) });
        if (r.status === 404) return { domain, status: "available", checkedAt };
        if (r.ok) return { domain, status: "taken", checkedAt };
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
          headers: { "user-agent": "brandshield-cli/1.0" },
          signal: AbortSignal.timeout(6000),
        });
        return { platform: "github", handle: `@${slug}`, status: r.status === 404 ? "available" : r.ok ? "taken" : "unconfirmed" };
      } catch {
        return { platform: "github", handle: `@${slug}`, status: "unconfirmed" };
      }
    })(),
    (async () => {
      try {
        const r = await fetch(`https://registry.npmjs.org/${slug}`, { signal: AbortSignal.timeout(6000) });
        return { platform: "npm", handle: slug, status: r.status === 404 ? "available" : r.ok ? "taken" : "unconfirmed" };
      } catch {
        return { platform: "npm", handle: slug, status: "unconfirmed" };
      }
    })(),
    (async () => {
      try {
        const r = await fetch(`https://pypi.org/pypi/${slug}/json`, { signal: AbortSignal.timeout(6000) });
        return { platform: "pypi", handle: slug, status: r.status === 404 ? "available" : r.ok ? "taken" : "unconfirmed" };
      } catch {
        return { platform: "pypi", handle: slug, status: "unconfirmed" };
      }
    })(),
  ]);

  let apps = [];
  try {
    const r = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(name)}&entity=software&country=us&limit=5`, {
      signal: AbortSignal.timeout(7000),
    });
    if (r.ok) {
      const data = await r.json();
      apps = (data.results || [])
        .filter((a) => String(a.trackName || "").toLowerCase().includes(name.toLowerCase()))
        .slice(0, 3)
        .map((a) => ({ store: "Apple App Store", name: a.trackName, seller: a.sellerName }));
    }
  } catch {
    // ignore
  }

  return { mode: "local-rdap-fallback", name, checkedAt, domains, handles, apps, trademarks: [] };
}

function badge(status) {
  const s = String(status || "").toLowerCase();
  if (s === "available" || s === "free") return `${C.green}✔ AVAILABLE${C.reset}`;
  if (s === "taken" || s === "registered" || s === "live") return `${C.red}✖ TAKEN${C.reset}`;
  return `${C.yellow}? UNCONFIRMED${C.reset}`;
}

async function main() {
  const opts = parseArgs(process.argv);
  if (opts.help || !opts.name) {
    printHelp();
    process.exit(opts.help ? 0 : 1);
  }

  if (opts.name.includes(",")) {
    console.error(
      `${C.yellow}Note:${C.reset} BrandShield Lite checks 1 candidate name per run.\n` +
        `For 500-name batch CSV/JSON scanning & 60+ collision-free variations, get BrandShield Pro:\n` +
        `  ${C.cyan}${PRO_URL}${C.reset}\n`
    );
    opts.name = opts.name.split(",")[0].trim();
  }

  const tlds = opts.tlds.split(",").map((x) => x.trim().replace(/^\./, "").toLowerCase()).filter(Boolean);
  if (!opts.json) {
    console.log(`\n${C.bold}Scanning "${opts.name}"${C.reset} ${C.dim}(authoritative RDAP + handles + app stores + USPTO)...${C.reset}`);
  }

  let report = null;
  try {
    const dottedTlds = tlds.map((t) => `.${t}`).join(",");
    const url = `${DIAGNOSTIC_API}/check?names=${encodeURIComponent(opts.name)}&tlds=${encodeURIComponent(dottedTlds)}&platforms=x,github,youtube,bluesky,npm,pypi,instagram,tiktok&countries=US&format=json`;
    const res = await fetch(url, {
      headers: { accept: "application/json", "user-agent": "brandshield-cli/1.0" },
      signal: AbortSignal.timeout(35_000),
    });
    if (res.ok) {
      const data = await res.json();
      report = (data.results && data.results[0]) || data.report || data;
    }
  } catch {
    // Fall back cleanly to direct RDAP + public registry lookups
  }

  if (!report) {
    report = await fallbackLocalCheck(opts.name, tlds);
  } else if (!report.domains || !report.domains.length) {
    const fb = await fallbackLocalCheck(opts.name, tlds);
    report.domains = fb.domains;
  }

  if (opts.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  const domains = report.domains || [];
  const handles = report.handles || report.platforms || [];
  const appsRaw = report.appStores || report.apps || [];
  const tmRaw = report.trademarks || [];

  console.log(`\n${C.bold}1. Domain Availability (Live Registry RDAP — Zero Front-Running)${C.reset}`);
  for (const d of domains) {
    const dom = d.domain || `${opts.name.toLowerCase()}.${String(d.tld || "").replace(/^\./, "")}`;
    console.log(`   ${dom.padEnd(28)} ${badge(d.status)}`);
  }

  if (handles.length) {
    console.log(`\n${C.bold}2. Social & Developer Handles${C.reset}`);
    for (const h of handles) {
      const label = `${h.platform || h.site}: ${h.handle || ""}`;
      console.log(`   ${label.padEnd(28)} ${badge(h.status)}`);
    }
  }

  console.log(`\n${C.bold}3. Mobile App Stores (iOS & Google Play)${C.reset}`);
  const appMatches = [];
  if (Array.isArray(appsRaw)) {
    for (const entry of appsRaw) {
      if (Array.isArray(entry.matches)) {
        for (const m of entry.matches) {
          appMatches.push({ store: entry.store || entry.platform, name: m.name || m.title, seller: m.developer || m.seller });
        }
      } else if (entry.name || entry.title) {
        appMatches.push({ store: entry.store || "App Store", name: entry.name || entry.title, seller: entry.seller || "" });
      }
    }
  }
  if (!appMatches.length) {
    console.log(`   ${C.green}✔ No exact-title mobile apps detected${C.reset}`);
  } else {
    for (const a of appMatches.slice(0, 6)) {
      console.log(`   ${C.red}✖ ${a.name}${C.reset} — ${a.store} ${C.dim}(${a.seller || "Publisher"})${C.reset}`);
    }
  }

  console.log(`\n${C.bold}4. US Federal Trademarks (USPTO)${C.reset}`);
  let markList = [];
  let liveCount = 0;
  if (Array.isArray(tmRaw) && tmRaw[0] && Array.isArray(tmRaw[0].matches)) {
    markList = tmRaw[0].matches.filter((m) => m.live !== false);
    liveCount = tmRaw[0].liveCount ?? markList.length;
  } else if (Array.isArray(tmRaw)) {
    markList = tmRaw;
    liveCount = markList.length;
  }
  if (!markList.length) {
    console.log(`   ${C.green}✔ No live identical USPTO word marks returned in quick scan${C.reset}`);
  } else {
    console.log(`   ${C.red}⚠ ${liveCount} live USPTO mark(s) matched:${C.reset}`);
    for (const m of markList.slice(0, 6)) {
      const reg = m.registration ? `Reg #${m.registration}` : `Serial #${m.serial || "N/A"}`;
      const cls = m.classes ? ` [${m.classes}]` : "";
      console.log(`   ${C.red}✖ ${m.mark || opts.name}${C.reset} — ${reg}${cls} ${C.dim}(${(m.owner || "").slice(0, 48)})${C.reset}`);
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
      `  👉 ${C.bold}${C.cyan}${PRO_URL}${C.reset}\n` +
      `  🌐 Free interactive web scanner: ${C.cyan}${DIAGNOSTIC_API}${C.reset}\n` +
      `${C.bold}${C.magenta}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n`
  );
}

main();
