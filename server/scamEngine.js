// Server-side helper for combining technical signals into a simple risk heuristic.
// This file is CommonJS for Node.

const dns = require('dns').promises;
const tls = require('tls');
const whois = require('whois-json');

// parse domain from input - best effort
function extractHost(input) {
  if (!input) return null;
  try {
    // try as URL
    const u = new URL(input.includes('://') ? input : `http://${input}`);
    return u.hostname;
  } catch (e) {
    // fallback: extract token that looks like a domain
    const m = String(input).match(/([a-z0-9-]+\.[a-z]{2,})/i);
    return m ? m[1] : input;
  }
}

// WHOIS lookup (returns object or null)
async function whoisLookup(host, timeout = 8000) {
  try {
    const res = await Promise.race([
      whois(host),
      new Promise((_, rej) => setTimeout(() => rej(new Error('whois timeout')), timeout))
    ]);
    return res;
  } catch (e) {
    return null;
  }
}

// get SSL certificate info via TLS handshake
async function fetchSSLCert(host, timeout = 5000) {
  return new Promise((resolve) => {
    const opts = { host, port: 443, servername: host, rejectUnauthorized: false };
    const sock = tls.connect(opts, () => {
      try {
        const cert = sock.getPeerCertificate(true);
        sock.end();
        if (!cert || Object.keys(cert).length === 0) {
          resolve(null);
        } else {
          resolve(cert);
        }
      } catch (err) {
        resolve(null);
      }
    });
    sock.setTimeout(timeout, () => {
      try { sock.destroy(); } catch (e) {}
      resolve(null);
    });
    sock.on('error', () => resolve(null));
  });
}

async function resolveIPs(host) {
  try {
    const addrs = await dns.resolve(host);
    return addrs || [];
  } catch (e) {
    try {
      // fallback to lookup
      const l = await dns.lookup(host, { all: true });
      return l.map(x => x.address);
    } catch (err) {
      return [];
    }
  }
}

// combine a simple heuristic score from tech signals
function computeScoreFromTech({ domainAgeDays, sslValid, blacklistHits }) {
  let score = 60;
  if (typeof domainAgeDays === 'number') {
    if (domainAgeDays < 30) score -= 30;
    else if (domainAgeDays < 365) score -= 10;
    else score += 5;
  }
  if (!sslValid) score -= 25;
  if (blacklistHits && blacklistHits.length) score -= 30;
  // clamp
  score = Math.max(0, Math.min(100, score));
  return score;
}

module.exports = {
  extractHost,
  whoisLookup,
  fetchSSLCert,
  resolveIPs,
  computeScoreFromTech
};
