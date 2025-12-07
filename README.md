# SVE_02
Scam Verification Engine
<!DOCTYPE html>
<html lang="en" class="bg-gray-50">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LinkTech - Scam Verification Engine</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Phosphor Icons -->
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
    <!-- Chart.js (not used by this patch but kept for visualizations) -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }

        /* Custom Animations */
        @keyframes pulse-ring {
            0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
            100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
        }
        .pulse-animation {
            animation: pulse-ring 2s infinite;
        }

        .result-card {
            transition: all 0.2s ease-out;
        }
        .result-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        /* Gauge Animation */
        .gauge-bg {
            fill: none;
            stroke: #e5e7eb;
            stroke-width: 10;
        }
        .gauge-value {
            fill: none;
            stroke-width: 10;
            stroke-linecap: round;
            transform: rotate(-90deg);
            transform-origin: 50% 50%;
            transition: stroke-dasharray 1.5s ease-out, stroke 0.5s ease;
        }

        /* Marquee helper (kept from original) */
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          gap: 2rem;
          animation: marquee 20s linear infinite;
        }
    </style>
</head>
<body class="text-gray-800 antialiased min-h-screen flex flex-col">

    <!-- Navbar -->
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center gap-2">
                    <i class="ph-fill ph-detective text-indigo-600 text-3xl"></i>
                    <span class="font-bold text-xl tracking-tight text-gray-900">LinkTech <span class="text-indigo-600 font-medium text-base ml-1">Scam Engine</span></span>
                </div>
                <div class="flex items-center gap-4">
                    <a href="#" class="text-sm font-medium text-gray-500 hover:text-gray-900">For Business</a>
                    <button id="get-protected-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                        Get Protected
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">

        <!-- STEP 1: INPUT FORM -->
        <div id="input-section" class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-500">
            <div class="bg-gradient-to-r from-gray-900 to-indigo-900 px-8 py-10 text-center">
                <h1 class="text-3xl font-extrabold text-white mb-2">Is it a Scam?</h1>
                <p class="text-indigo-200 text-lg max-w-2xl mx-auto">Verify websites, phone numbers, emails, or messages instantly using LinkTech's deep-learning engine.</p>
            </div>
            
            <div class="p-8">
                <!-- Input Type Selector -->
                <div id="type-selector" class="flex justify-center space-x-4 mb-6">
                    <button data-type="url" class="type-btn active flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                        <i class="ph-bold ph-globe"></i> Website
                    </button>
                    <button data-type="phone" class="type-btn flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200">
                        <i class="ph-bold ph-phone"></i> Phone/SMS
                    </button>
                    <button data-type="email" class="type-btn flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200">
                        <i class="ph-bold ph-envelope"></i> Email
                    </button>
                    <button data-type="text" class="type-btn flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200">
                        <i class="ph-bold ph-chat-text"></i> Message Text
                    </button>
                </div>

                <form id="verify-form" class="max-w-3xl mx-auto space-y-6">
                    <div class="relative group">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i id="input-icon" class="ph-bold ph-magnifying-glass text-gray-400 text-xl group-focus-within:text-indigo-600 transition-colors"></i>
                        </div>
                        <input type="text" id="scan-input" required 
                            class="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-lg placeholder-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" 
                            placeholder="Paste the suspicious link (e.g., login-fnb-secure.com)...">
                    </div>

                    <div class="text-center">
                        <button type="submit" class="w-full md:w-auto md:px-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mx-auto text-lg">
                            <i class="ph-bold ph-scan"></i>
                            Analyze Risk
                        </button>
                        <p class="mt-4 text-xs text-gray-500 flex items-center justify-center gap-1">
                            <i class="ph-fill ph-lock-key"></i> Searches generic, anonymized databases. Your query is secure.
                        </p>
                    </div>
                </form>
            </div>
            
            <!-- Recent Scams Ticker -->
            <div class="bg-gray-50 border-t border-gray-100 px-6 py-3 flex items-center gap-4 text-sm text-gray-600 overflow-hidden whitespace-nowrap">
                <span class="font-bold text-red-600 flex items-center gap-1"><i class="ph-fill ph-warning-circle"></i> LIVE ALERTS:</span>
                <div class="inline-flex gap-8 animate-marquee">
                    <span>🚨 "Capitec Upgrade" SMS Scheme detected (ZA)</span>
                    <span>🚨 "SAPS Traffic Fine" WhatsApp scam spiking</span>
                    <span>🚨 "Takealot Winner" Phishing emails active</span>
                    <span>🚨 Crypto investment group "FutureWealth" flagged</span>
                </div>
            </div>
        </div>

        <!-- STEP 2: LOADING ORCHESTRATION (Hidden) -->
        <div id="loading-section" class="hidden py-12">
            <div class="max-w-xl mx-auto text-center space-y-8">
                
                <!-- Radar Scanner -->
                <div class="relative w-48 h-48 mx-auto">
                    <div class="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                    <div class="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                    <div class="absolute inset-4 rounded-full bg-indigo-50 flex items-center justify-center">
                        <i class="ph-duotone ph-crosshair text-6xl text-indigo-600"></i>
                    </div>
                    <!-- Pings -->
                    <div class="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    <div class="absolute bottom-10 left-4 w-2 h-2 bg-orange-500 rounded-full animate-ping delay-100"></div>
                </div>

                <div>
                    <h2 class="text-2xl font-bold text-gray-900" id="loading-stage">Initializing Engines...</h2>
                    <p class="text-gray-500 mt-2 font-mono text-sm" id="loading-detail">Connecting to Threat Intel Feed...</p>
                </div>

                <!-- Step Progress -->
                <div class="space-y-3 max-w-sm mx-auto text-left text-sm">
                    <div class="flex items-center justify-between" id="step-tech">
                        <span class="text-gray-500">Technical Signals (DNS/SSL)</span>
                        <i class="ph ph-circle text-gray-300"></i>
                    </div>
                    <div class="flex items-center justify-between" id="step-social">
                        <span class="text-gray-500">Social Engineering Analysis</span>
                        <i class="ph ph-circle text-gray-300"></i>
                    </div>
                    <div class="flex items-center justify-between" id="step-community">
                        <span class="text-gray-500">Community & Blacklist Check</span>
                        <i class="ph ph-circle text-gray-300"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- STEP 3: ANALYSIS RESULTS (Hidden) -->
        <div id="results-section" class="hidden space-y-8 animate-fade-in-up">
            
            <!-- 1. HEADER & SCORE -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 relative overflow-hidden">
                <!-- Background decorative blob -->
                <div class="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full -mr-16 -mt-16 pointer-events-none"></div>

                <div class="flex flex-col md:flex-row items-center gap-10 relative z-10">
                    
                    <!-- Score Gauge -->
                    <div class="relative w-48 h-48 flex-shrink-0">
                        <svg class="w-full h-full" viewBox="0 0 100 100">
                            <!-- Background Circle -->
                            <circle class="gauge-bg" cx="50" cy="50" r="45"></circle>
                            <!-- Value Circle (Animated via JS) -->
                            <circle id="score-circle" class="gauge-value" cx="50" cy="50" r="45" stroke-dasharray="283" stroke-dashoffset="283"></circle>
                        </svg>
                        <div class="absolute inset-0 flex flex-col items-center justify-center">
                            <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Trust Score</span>
                            <span id="score-display" class="text-5xl font-black text-gray-900">0</span>
                            <span id="score-verdict" class="text-sm font-bold px-2 py-0.5 rounded mt-1 bg-gray-100 text-gray-500">Analyzing</span>
                        </div>
                    </div>

                    <!-- Summary Text -->
                    <div class="flex-grow text-center md:text-left space-y-4">
                        <div>
                            <h2 class="text-3xl font-bold text-gray-900 mb-1">Analysis Complete</h2>
                            <p class="text-gray-600 text-lg">We have analyzed <span id="target-display" class="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-800">example.com</span> across multiple data vectors.</p>
                        </div>
                        
                        <div id="alert-box" class="hidden bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                            <div class="flex items-start">
                                <i class="ph-fill ph-warning-octagon text-red-600 text-xl mt-0.5 mr-3"></i>
                                <div>
                                    <h3 class="font-bold text-red-800">High Scam Likelihood</h3>
                                    <p class="text-red-700 text-sm">Do not provide personal information. This entity shows strong indicators of fraud.</p>
                                </div>
                            </div>
                        </div>

                        <div id="safe-box" class="hidden bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                            <div class="flex items-start">
                                <i class="ph-fill ph-check-circle text-green-600 text-xl mt-0.5 mr-3"></i>
                                <div>
                                    <h3 class="font-bold text-green-800">Likely Legitimate</h3>
                                    <p class="text-green-700 text-sm">Technical signals are strong, but always stay vigilant against impersonation.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <!-- 2. TECHNICAL SIGNALS -->
                <div class="result-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-1">
                    <h3 class="font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <i class="ph-duotone ph-cpu text-indigo-600 text-xl"></i>
                        Technical Signals
                    </h3>
                    <div class="space-y-4">
                        <!-- Signal Items -->
                        <div class="flex justify-between items-center pb-3 border-b border-gray-50">
                            <div class="flex items-center gap-3">
                                <div class="bg-gray-100 p-2 rounded-lg"><i class="ph-bold ph-globe text-gray-600"></i></div>
                                <div>
                                    <p class="text-xs text-gray-500 font-semibold">DOMAIN AGE</p>
                                    <p class="text-sm font-medium text-gray-900" id="tech-domain">Checking...</p>
                                </div>
                            </div>
                            <i id="icon-domain" class="ph-fill ph-circle text-gray-300"></i>
                        </div>

                        <div class="flex justify-between items-center pb-3 border-b border-gray-50">
                            <div class="flex items-center gap-3">
                                <div class="bg-gray-100 p-2 rounded-lg"><i class="ph-bold ph-lock-key text-gray-600"></i></div>
                                <div>
                                    <p class="text-xs text-gray-500 font-semibold">SSL VALIDITY</p>
                                    <p class="text-sm font-medium text-gray-900" id="tech-ssl">Checking...</p>
                                </div>
                            </div>
                            <i id="icon-ssl" class="ph-fill ph-circle text-gray-300"></i>
                        </div>

                        <div class="flex justify-between items-center pb-3 border-b border-gray-50">
                            <div class="flex items-center gap-3">
                                <div class="bg-gray-100 p-2 rounded-lg"><i class="ph-bold ph-server text-gray-600"></i></div>
                                <div>
                                    <p class="text-xs text-gray-500 font-semibold">HOSTING RISK</p>
                                    <p class="text-sm font-medium text-gray-900" id="tech-hosting">Checking...</p>
                                </div>
                            </div>
                            <i id="icon-hosting" class="ph-fill ph-circle text-gray-300"></i>
                        </div>

                        <div class="flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="bg-gray-100 p-2 rounded-lg"><i class="ph-bold ph-list-dashes text-gray-600"></i></div>
                                <div>
                                    <p class="text-xs text-gray-500 font-semibold">BLACKLISTS</p>
                                    <p class="text-sm font-medium text-gray-900" id="tech-blacklist">Checking...</p>
                                </div>
                            </div>
                            <i id="icon-blacklist" class="ph-fill ph-circle text-gray-300"></i>
                        </div>
                    </div>
                </div>

                <!-- 3. SOCIAL ENGINEERING -->
                <div class="result-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-1">
                    <h3 class="font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <i class="ph-duotone ph-brain text-purple-600 text-xl"></i>
                        Psychological Analysis
                    </h3>
                    <div class="bg-purple-50 rounded-lg p-4 mb-4 border border-purple-100">
                        <p class="text-sm text-purple-900 italic" id="social-summary">"Analyzing patterns..."</p>
                    </div>
                    
                    <div class="space-y-3">
                        <div class="flex items-center gap-2 text-sm" id="soc-urgency">
                            <i class="ph-bold ph-circle text-gray-300"></i>
                            <span class="text-gray-600">Urgency Cues (e.g., "Act Now")</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm" id="soc-brand">
                            <i class="ph-bold ph-circle text-gray-300"></i>
                            <span class="text-gray-600">Brand Impersonation</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm" id="soc-otp">
                            <i class="ph-bold ph-circle text-gray-300"></i>
                            <span class="text-gray-600">Fake OTP Pattern</span>
                        </div>
                    </div>
                </div>

                <!-- 4. COMMUNITY INTEL -->
                <div class="result-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-1">
                    <h3 class="font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <i class="ph-duotone ph-users-three text-blue-600 text-xl"></i>
                        Community Intel
                    </h3>
                    
                    <div class="text-center py-4 border-b border-gray-100">
                        <div class="text-4xl font-black text-gray-900" id="comm-count">0</div>
                        <div class="text-xs font-bold text-gray-500 uppercase tracking-wide">Recent Complaints</div>
                    </div>

                    <div class="mt-4 space-y-3">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600 flex items-center gap-2"><i class="ph-fill ph-reddit-logo text-orange-600"></i> Social Chatter</span>
                            <span class="font-medium" id="comm-social">--</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600 flex items-center gap-2"><i class="ph-fill ph-star text-green-600"></i> Trust Score</span>
                            <span class="font-medium" id="comm-trust">--</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600 flex items-center gap-2"><i class="ph-fill ph-trend-up text-red-600"></i> Trend (24h)</span>
                            <span class="font-medium" id="comm-trend">--</span>
                        </div>
                    </div>
                </div>

            </div>

            <!-- CTA (Get Policy button removed per request) -->
            <div class="bg-gray-900 rounded-xl p-6 text-center text-white">
                <h3 class="text-lg font-bold mb-2">Don't guess. Know for sure.</h3>
                <p class="text-gray-400 text-sm mb-4">LinkTech Policyholders get detailed human verification for cases like this.</p>
                <div class="flex justify-center gap-4">
                    <button id="report-scam-btn" class="border border-gray-600 text-gray-300 px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition">Report This Scam</button>
                </div>
            </div>

        </div>

    </main>

    <footer class="bg-white border-t border-gray-200 py-6 mt-auto">
        <div class="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
            &copy; 2025 LinkTech. Powered by the Scam Verification Engine v1.0.
        </div>
    </footer>

    <!-- Client-side module & logic -->
    <script type="module">
        import { generateResult as clientGenerateResult, computeGaugeOffset, chooseGaugeColor } from './src/scamEngine.mjs';

        // UI references
        const typeSelector = document.getElementById('type-selector');
        const inputEl = document.getElementById('scan-input');
        const inputIcon = document.getElementById('input-icon');
        const typeButtons = Array.from(document.querySelectorAll('.type-btn'));
        let currentType = 'url';

        // Attach event listeners for input type buttons
        typeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const t = btn.getAttribute('data-type') || 'url';
                currentType = t;
                // update classes
                typeButtons.forEach(b => {
                    b.classList.remove('bg-indigo-50', 'text-indigo-700', 'font-semibold', 'border-indigo-200');
                    b.classList.add('bg-white', 'text-gray-600', 'border-gray-200');
                });
                btn.classList.remove('bg-white', 'text-gray-600', 'border-gray-200');
                btn.classList.add('bg-indigo-50', 'text-indigo-700', 'font-semibold', 'border-indigo-200');

                // update placeholder & icon
                if (t === 'url') {
                    inputEl.placeholder = "Paste the suspicious link (e.g., login-fnb-secure.com)...";
                    inputIcon.className = "ph-bold ph-globe text-gray-400 text-xl group-focus-within:text-indigo-600 transition-colors";
                } else if (t === 'phone') {
                    inputEl.placeholder = "Enter number (e.g., +27 82 123 4567)...";
                    inputIcon.className = "ph-bold ph-phone text-gray-400 text-xl group-focus-within:text-indigo-600 transition-colors";
                } else if (t === 'email') {
                    inputEl.placeholder = "Enter sender address (e.g., support@tax-refund-sa.co)...";
                    inputIcon.className = "ph-bold ph-envelope text-gray-400 text-xl group-focus-within:text-indigo-600 transition-colors";
                } else {
                    inputEl.placeholder = "Paste the message content here...";
                    inputIcon.className = "ph-bold ph-chat-text text-gray-400 text-xl group-focus-within:text-indigo-600 transition-colors";
                }
            });
        });

        // Form submit -> call server analyze endpoint, fall back to clientGenerateResult
        const form = document.getElementById('verify-form');
        form.addEventListener('submit', async (ev) => {
            ev.preventDefault();
            const inputVal = inputEl.value.trim();
            if (!inputVal) return;

            // UI: hide input, show loader
            document.getElementById('input-section').classList.add('hidden');
            document.getElementById('loading-section').classList.remove('hidden');
            document.getElementById('loading-detail').textContent = 'Querying servers...';

            // Update loading steps as progress happens
            const markStep = (id, text) => {
                const el = document.getElementById(`step-${id}`);
                if (el) {
                    el.querySelector('i').className = "ph-fill ph-check-circle text-indigo-600";
                    el.querySelector('span').classList.add('text-indigo-900', 'font-medium');
                }
                document.getElementById('loading-detail').textContent = text;
            };

            let analysis = null;

            try {
                markStep('tech', 'Performing technical checks (WHOIS, DNS, SSL)...');

                const resp = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: currentType, input: inputVal }),
                });

                if (resp.ok) {
                    analysis = await resp.json();
                } else {
                    console.warn('Server analysis failed, falling back to client heuristic', resp.status);
                }

                markStep('social', 'Analyzing language patterns...');
                // simulated minor delay for UX
                await new Promise(r => setTimeout(r, 500));
                markStep('community', 'Aggregating community signals...');
                await new Promise(r => setTimeout(r, 400));
            } catch (err) {
                console.error('Analysis error', err);
            }

            // If server didn't return a combined result, use local heuristic and merge technical signals if available
            if (!analysis) {
                const local = clientGenerateResult(inputVal);
                analysis = local;
            }

            renderResult(analysis, inputVal);
            document.getElementById('loading-section').classList.add('hidden');
            document.getElementById('results-section').classList.remove('hidden');

            // animate gauge
            setTimeout(() => {
                const offset = computeGaugeOffset(analysis.score);
                const circle = document.getElementById('score-circle');
                circle.style.strokeDashoffset = offset;
                circle.style.stroke = chooseGaugeColor(analysis.riskLevel);
            }, 80);
        });

        // Render UI safely using textContent & classList
        function renderResult(data, input) {
            const targetDisplay = document.getElementById('target-display');
            targetDisplay.textContent = input.length > 30 ? input.substring(0,30) + '...' : input;

            const scoreDisplay = document.getElementById('score-display');
            const verdict = document.getElementById('score-verdict');
            const alertBox = document.getElementById('alert-box');
            const safeBox = document.getElementById('safe-box');

            scoreDisplay.textContent = String(data.score);

            // Reset boxes
            alertBox.classList.add('hidden');
            safeBox.classList.add('hidden');

            verdict.className = 'text-sm font-bold px-2 py-0.5 rounded mt-1';
            if (data.riskLevel === 'high') {
                verdict.textContent = 'CRITICAL RISK';
                verdict.classList.add('bg-red-100', 'text-red-700');
                scoreDisplay.className = 'text-5xl font-black text-red-600';
                alertBox.classList.remove('hidden');
            } else if (data.riskLevel === 'safe') {
                verdict.textContent = 'SAFE';
                verdict.classList.add('bg-green-100', 'text-green-700');
                scoreDisplay.className = 'text-5xl font-black text-green-600';
                safeBox.classList.remove('hidden');
            } else {
                verdict.textContent = 'CAUTION';
                verdict.classList.add('bg-orange-100', 'text-orange-700');
                scoreDisplay.className = 'text-5xl font-black text-orange-500';
            }

            // Technical signals
            document.getElementById('tech-domain').textContent = data.tech.domainDisplay || data.tech.domain || 'Unknown';
            document.getElementById('tech-ssl').textContent = data.tech.sslDisplay || data.tech.ssl || 'Unknown';
            document.getElementById('tech-hosting').textContent = data.tech.hostingDisplay || data.tech.hosting || 'Unknown';
            document.getElementById('tech-blacklist').textContent = (data.tech.blacklistMatches && data.tech.blacklistMatches.length) ? data.tech.blacklistMatches.join(', ') : (data.tech.blacklist || 'None');

            const iconClass = data.riskLevel === 'high' ? "ph-fill ph-warning-circle text-red-500" : (data.riskLevel === 'safe' ? "ph-fill ph-check-circle text-green-500" : "ph-fill ph-warning text-orange-500");
            ['domain','ssl','hosting','blacklist'].forEach(id => {
                const el = document.getElementById(`icon-${id}`);
                if (el) el.className = iconClass;
            });

            // Social signals
            const socialSummary = document.getElementById('social-summary');
            socialSummary.textContent = `"${data.social.summary}"`;

            const setSocialIcon = (id, active) => {
                const el = document.getElementById(id);
                if (!el) return;
                const i = el.querySelector('i');
                const span = el.querySelector('span');
                if (active) {
                    if (i) i.className = "ph-fill ph-warning text-red-500";
                    if (span) span.classList.add('text-red-700', 'font-bold');
                } else {
                    if (i) i.className = "ph-fill ph-check-circle text-gray-300";
                    if (span) span.classList.remove('font-bold', 'text-red-700');
                }
            };
            setSocialIcon('soc-urgency', data.social.urgency);
            setSocialIcon('soc-brand', data.social.brand);
            setSocialIcon('soc-otp', data.social.otp);

            // Community
            document.getElementById('comm-count').textContent = String(data.community.count || 0);
            document.getElementById('comm-social').textContent = data.community.social || '--';
            document.getElementById('comm-trust').textContent = data.community.trust || '--';
            document.getElementById('comm-trend').textContent = data.community.trend || '--';
        }

        // small helper: Report button -> example action
        document.getElementById('report-scam-btn').addEventListener('click', () => {
            alert('Thanks — this will open a report flow in a production deployment.');
        });
    </script>
</body>
</html>

// ESM module for browser-side heuristics and deterministic scoring.
// This is a pure function module used for UI fallbacks and quick heuristics.

// Helper: clamp numeric values
export function clamp(v, min = 0, max = 100) {
  const n = Number(v);
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

// compute stroke-dashoffset for gauge rendering
export function computeGaugeOffset(score, circumference = 283) {
  const s = clamp(score, 0, 100);
  return circumference - (s / 100) * circumference;
}

// choose color for gauge by risk level
export function chooseGaugeColor(level) {
  if (level === 'high') return '#dc2626';
  if (level === 'safe') return '#16a34a';
  return '#f97316';
}

// tokenization utility: returns array of lowercased tokens (words, domains, emails, numbers).
function tokenize(input) {
  if (!input) return [];
  const normalized = String(input).toLowerCase();
  // split on non-word characters, keep dots and @ in tokens for domains/emails
  const tokens = normalized.split(/[\s,;|]+/).flatMap(chunk => {
    // further split on characters except alphanum, dot, dash, @
    return chunk.split(/[^a-z0-9@.\-]+/).filter(Boolean);
  });
  return tokens;
}

// safer boundary-aware matcher using regex with word boundaries when appropriate
function containsWord(input, word) {
  if (!input || !word) return false;
  try {
    const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\b`, 'i');
    return re.test(input);
  } catch (e) {
    return input.toLowerCase().includes(word.toLowerCase());
  }
}

// generateResult with configurable whitelist/blacklist
// options: { whitelist: [], blacklist: [], strictTokens: boolean }
export function generateResult(input = '', options = {}) {
  const { whitelist = [], blacklist = [], strictTokens = true } = options;
  const txt = String(input || '');
  const tokens = tokenize(txt);

  // if whitelist contains any exact match token -> safe
  const localLower = txt.toLowerCase();
  for (const w of whitelist) {
    if (!w) continue;
    if (localLower.includes(w.toLowerCase())) {
      return {
        score: 96,
        riskLevel: 'safe',
        tech: {
          domain: 'Longstanding / Known',
          ssl: 'Valid',
          hosting: 'Corporate',
          blacklist: 'Clean'
        },
        social: {
          summary: 'No manipulative triggers found. Standard corporate communication style.',
          urgency: false,
          brand: false,
          otp: false
        },
        community: {
          count: 0,
          social: 'No mentions',
          trust: '4.9/5 (Excellent)',
          trend: 'Stable'
        }
      };
    }
  }

  // blacklist check: direct containment or token match
  for (const b of blacklist) {
    if (!b) continue;
    if (localLower.includes(b.toLowerCase()) || tokens.includes(b.toLowerCase())) {
      return {
        score: 8,
        riskLevel: 'high',
        tech: {
          domain: 'Recent / Blacklisted',
          ssl: 'Unknown / Invalid',
          hosting: 'High Risk',
          blacklist: 'Listed'
        },
        social: {
          summary: 'Matched explicit blacklist entries.',
          urgency: true,
          brand: true,
          otp: true
        },
        community: {
          count: 42,
          social: 'Multiple reports',
          trust: '1.0/5 (Poor)',
          trend: 'Spiking'
        }
      };
    }
  }

  // improved keyword detection with boundary checks
  const highKeywords = ['bank', 'login', 'update', 'winner', 'pay', 'secure', 'confirm', 'verify', 'reset', 'urgent'];
  let highMatchCount = 0;
  for (const kw of highKeywords) {
    if (strictTokens) {
      if (tokens.some(t => t.includes(kw))) highMatchCount++;
    } else {
      if (containsWord(txt, kw)) highMatchCount++;
    }
  }

  if (highMatchCount >= 2) {
    return {
      score: 12,
      riskLevel: 'high',
      tech: {
        domain: 'Created recently',
        ssl: 'Self-Signed / Invalid',
        hosting: 'High Risk',
        blacklist: 'Potential Matches'
      },
      social: {
        summary: "Highly manipulative language detected matching common phishing patterns.",
        urgency: true,
        brand: true,
        otp: true
      },
      community: {
        count: 120,
        social: 'Multiple reports',
        trust: '1.2/5 (Bad)',
        trend: 'Spiking'
      }
    };
  }

  // fallback: medium
  return {
    score: 55,
    riskLevel: 'medium',
    tech: {
      domain: 'Unknown Age',
      ssl: "Valid (Let's Encrypt / Unknown)",
      hosting: 'Shared / Cloud',
      blacklist: 'Clean'
    },
    social: {
      summary: 'Contains some vague urgency but lacks specific brand impersonation.',
      urgency: tokens.some(t => ['urgent', 'immediately', 'asap'].includes(t)),
      brand: false,
      otp: false
    },
    community: {
      count: 1,
      social: '1 User Report',
      trust: 'Unknown',
      trend: 'Low Activity'
    }
  };
}

{
  "name": "linktech-scam-server",
  "version": "0.1.0",
  "description": "Server-side technical checks for LinkTech Scam Verification Engine",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "author": "LinkTech",
  "license": "MIT",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "whois-json": "^2.0.1"
  }
}

{
  "domains": [
    "malicious-example.com",
    "phishy-site.example",
    "bad-actor.example"
  ],
  "ips": [
    "203.0.113.5",
    "198.51.100.10"
  ]
}

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

name: CI

on:
  push:
    branches: [ main, 'feat/*', 'fix/*' ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js 18
        uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Run linters
        run: npm run lint
      - name: Run tests
        run: npm test
      - name: Audit dependencies
        run: npm audit --audit-level=moderate || true

        /**
 * Integration tests for server /api/analyze
 * Spawns the server process (server/index.js) and polls /health until ready.
 *
 * NOTE: Node 18+ provides global fetch used below.
 */

/* eslint-env node */
import { spawn } from 'child_process';
import { resolve } from 'path';
import { promisify } from 'util';
import { setTimeout as wait } from 'timers/promises';
import { describe, test, beforeAll, afterAll, expect } from '@jest/globals';

const SERVER_START_TIMEOUT = 12000;
const HEALTH_POLL_INTERVAL = 300;
const SERVER_PORT = process.env.TEST_SERVER_PORT || 3000;

let serverProc;

async function waitForHealth(url, timeout = SERVER_START_TIMEOUT) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch (e) {
      // ignore, server not ready yet
    }
    await wait(HEALTH_POLL_INTERVAL);
  }
  throw new Error('Server did not become healthy in time');
}

beforeAll(async () => {
  const serverPath = resolve(process.cwd(), 'server', 'index.js');
  serverProc = spawn(process.execPath, [serverPath], {
    env: { ...process.env, PORT: String(SERVER_PORT) },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // forward server stdout/stderr for debugging (tests will still fail on errors)
  serverProc.stdout?.on('data', (d) => { /*console.log('[server]', d.toString());*/ });
  serverProc.stderr?.on('data', (d) => { /*console.error('[server]', d.toString());*/ });

  const healthUrl = `http://127.0.0.1:${SERVER_PORT}/health`;
  await waitForHealth(healthUrl, SERVER_START_TIMEOUT);
}, SERVER_START_TIMEOUT + 2000);

afterAll(() => {
  if (serverProc && !serverProc.killed) {
    serverProc.kill('SIGTERM');
  }
});

describe('/api/analyze integration', () => {
  test('returns 400 for missing input', async () => {
    const res = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: '' })
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test('analyze returns expected structure for a domain', async () => {
    const payload = { type: 'url', input: 'example.com' };
    const res = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    expect(res.ok).toBe(true);
    const j = await res.json();
    expect(j).toHaveProperty('tech');
    expect(j).toHaveProperty('social');
    expect(j).toHaveProperty('community');
    expect(typeof j.score).toBe('number');
    expect(['high', 'medium', 'safe']).toContain(j.riskLevel);
  }, 10000);
});

