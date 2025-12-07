// Minimal Express server providing /api/analyze
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const { extractHost, whoisLookup, fetchSSLCert, resolveIPs, computeScoreFromTech } = require('./scamEngine');

const BL_PATH = path.join(__dirname, 'blacklist.json');
let BL = { domains: [], ips: [] };
try {
  BL = JSON.parse(fs.readFileSync(BL_PATH, 'utf8'));
} catch (e) {
  console.warn('Could not load blacklist.json, continuing with empty list.');
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '10kb' }));

// health
app.get('/health', (req, res) => res.json({ ok: true }));

// POST /api/analyze { type, input }
app.post('/api/analyze', async (req, res) => {
  const { type, input } = req.body || {};
  if (!input) return res.status(400).json({ error: 'input required' });

  const host = extractHost(input);
  const result = {
    tech: {
      host: host || null,
      domain: null,
      domainAgeDays: null,
      sslValid: null,
      sslIssuer: null,
      hostingIPs: [],
      blacklistMatches: []
    },
    social: {
      summary: 'Server did not evaluate social heuristics.',
      urgency: false,
      brand: false,
      otp: false
    },
    community: {
      count: 0,
      social: 'No data',
      trust: 'Unknown',
      trend: 'Stable'
    },
    score: 50,
    riskLevel: 'medium'
  };

  try {
    if (host) {
      result.tech.host = host;

      // DNS / IPs
      const ips = await resolveIPs(host);
      result.tech.hostingIPs = ips;

      // Blacklist checks against host and ips
      const blMatches = [];
      const lowerHost = host.toLowerCase();
      if (BL.domains.some(d => lowerHost.includes(d))) blMatches.push(host);
      for (const ip of ips) {
        if (BL.ips.includes(ip)) blMatches.push(ip);
      }
      result.tech.blacklistMatches = blMatches;

      // WHOIS
      const who = await whoisLookup(host);
      if (who && (who.creationDate || who.created || who['Creation Date'])) {
        const dateStr = who.creationDate || who.created || who['Creation Date'];
        // try parse date
        const createdAt = new Date(dateStr);
        if (!Number.isNaN(createdAt.valueOf())) {
          const ageDays = Math.floor((Date.now() - createdAt.valueOf()) / (1000 * 60 * 60 * 24));
          result.tech.domainAgeDays = ageDays;
          result.tech.domain = `Created ${ageDays} days ago`;
        } else {
          result.tech.domain = 'Creation date unknown';
        }
      } else {
        result.tech.domain = 'WHOIS not available';
      }

      // SSL certificate
      const cert = await fetchSSLCert(host);
      if (cert && cert.valid_from && cert.valid_to) {
        const now = Date.now();
        const validFrom = Date.parse(cert.valid_from);
        const validTo = Date.parse(cert.valid_to);
        const sslValid = (!Number.isNaN(validFrom) && !Number.isNaN(validTo) && now >= validFrom && now <= validTo);
        result.tech.sslValid = sslValid;
        result.tech.sslIssuer = cert.issuer && cert.issuer.O ? cert.issuer.O : (cert.issuer ? JSON.stringify(cert.issuer) : 'Unknown');
        result.tech.sslDisplay = sslValid ? `Valid until ${cert.valid_to}` : 'Invalid / Expired';
      } else {
        result.tech.sslValid = false;
        result.tech.sslDisplay = 'No cert or unable to fetch';
      }

      // derive a score from tech signals
      const s = computeScoreFromTech({
        domainAgeDays: result.tech.domainAgeDays,
        sslValid: result.tech.sslValid,
        blacklistHits: result.tech.blacklistMatches
      });
      result.score = s;
      result.riskLevel = s < 30 ? 'high' : (s > 85 ? 'safe' : 'medium');
    }

    // For social heuristics & community, the server returns placeholders.
    // In production you would call text-analysis APIs, community DBs, threat intel, etc.
    // We'll keep a light-weight local heuristic here:
    const text = String(input).toLowerCase();
    if (/(winner|congrat|prize|claim|urgent|act now|verify your|confirm your)/i.test(text)) {
      result.social.summary = 'Server-detected manipulative language triggers (e.g., prize/urgent).';
      result.social.urgency = true;
    } else {
      result.social.summary = 'No clear manipulative language detected by server heuristics.';
    }

    // Example community aggregation (stub) - a real implementation should query your telemetry/databases
    if (result.tech.blacklistMatches.length) {
      result.community.count = 12;
      result.community.social = `${result.tech.blacklistMatches.length} blacklist hits`;
      result.community.trust = '1.0/5 (Bad)';
      result.community.trend = 'Spiking';
    } else {
      result.community.count = 0;
      result.community.social = 'No mentions';
      result.community.trust = 'Unknown';
      result.community.trend = 'Stable';
    }

    return res.json(result);
  } catch (err) {
    console.error('Analyze error', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'internal_error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Scam analysis server listening on ${port}`));
