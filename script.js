/**
 * AARK Innovations — Enterprise Modernization
 * High-Velocity Storytelling, Video, Audio & Interactive ROI Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. Top Scroll Progress Bar
  // =========================================================================
  const scrollProgressBar = document.getElementById('scrollProgressBar');

  function updateScrollProgress() {
    if (!scrollProgressBar) return;
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollTotal > 0) {
      const scrollPct = (window.scrollY / scrollTotal) * 100;
      scrollProgressBar.style.width = `${Math.min(100, Math.max(0, scrollPct))}%`;
    }
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // =========================================================================
  // 2. Scroll-Triggered Entrance Animations (Non-Static UI)
  // =========================================================================
  const scrollElements = document.querySelectorAll('.scroll-fade-in, .scroll-reveal-card');

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  scrollElements.forEach(el => scrollObserver.observe(el));

  // =========================================================================
  // 3. Theme Switcher (Dark Edition <-> Light Subpage / Studio White)
  // =========================================================================
  const themeToggle = document.getElementById('themeToggle');
  const statusPillText = document.getElementById('statusPillText');
  const htmlRoot = document.documentElement;

  const THEMES = {
    DARK: 'dark',
    LIGHT: 'light'
  };

  const savedTheme = localStorage.getItem('aark_theme') || THEMES.DARK;
  setTheme(savedTheme, false);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || THEMES.DARK;
      const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
      setTheme(newTheme, true);
    });
  }

  function setTheme(theme, save = true) {
    htmlRoot.setAttribute('data-theme', theme);
    if (save) {
      localStorage.setItem('aark_theme', theme);
    }

    // Direct DOM styling for video visibility across themes
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
      if (theme === THEMES.LIGHT) {
        heroVideo.style.filter = 'invert(0.96) hue-rotate(180deg) contrast(1.15) brightness(1.02)';
        heroVideo.style.mixBlendMode = 'multiply';
        heroVideo.style.opacity = '0.88';
      } else {
        heroVideo.style.filter = 'brightness(0.92)';
        heroVideo.style.mixBlendMode = 'normal';
        heroVideo.style.opacity = '1';
      }
    }

    // Ensure header is absolute and never sticky
    const siteHeader = document.getElementById('siteHeader');
    if (siteHeader) {
      siteHeader.style.position = 'absolute';
      siteHeader.style.top = '0';
      siteHeader.style.left = '0';
      siteHeader.style.right = '0';
    }

    if (themeToggle) {
      const icon = themeToggle.querySelector('.theme-icon');
      const label = themeToggle.querySelector('.theme-label');
      if (theme === THEMES.DARK) {
        if (icon) icon.textContent = '🌙';
        if (label) label.textContent = 'Dark Edition';
        if (statusPillText) {
          statusPillText.textContent = 'Enterprise Modernization • Fort Mill, SC | Dark Edition';
        }
      } else {
        if (icon) icon.textContent = '☀️';
        if (label) label.textContent = 'Light Subpage';
        if (statusPillText) {
          statusPillText.textContent = 'Enterprise Modernization • Fort Mill, SC | Studio White Subpage';
        }
      }
    }
  }

  // =========================================================================
  // 4. Ambient Audio Synthesizer (Web Audio API)
  // =========================================================================
  const audioToggle = document.getElementById('audioToggle');
  const audioIcon = document.getElementById('audioIcon');
  const audioLabel = document.getElementById('audioLabel');
  const ambientToast = document.getElementById('ambientToast');

  let audioCtx = null;
  let masterGain = null;
  let osc1 = null;
  let osc2 = null;
  let filter = null;
  let isAudioPlaying = false;
  let toastTimer = null;

  function showToast(message) {
    if (!ambientToast) return;
    ambientToast.textContent = message;
    ambientToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      ambientToast.classList.remove('show');
    }, 3200);
  }

  function initAudio() {
    if (audioCtx) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    audioCtx = new AudioContextClass();

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);

    // Warm Lowpass Filter
    filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, audioCtx.currentTime);
    filter.Q.setValueAtTime(3.2, audioCtx.currentTime);

    // Root Tone (A1 ~ 55 Hz)
    osc1 = audioCtx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, audioCtx.currentTime);

    // Harmonic Fifth (E2 ~ 82.4 Hz) with subtle organic detune
    osc2 = audioCtx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(82.4, audioCtx.currentTime);
    osc2.detune.setValueAtTime(3.5, audioCtx.currentTime);

    // LFO Modulation for subtle natural breathing
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, audioCtx.currentTime);
    lfoGain.gain.setValueAtTime(90, audioCtx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    // Node graph wiring
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    osc1.start();
    osc2.start();
  }

  function toggleAudio() {
    initAudio();
    if (!audioCtx) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!isAudioPlaying) {
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 1.2);

      isAudioPlaying = true;
      if (audioToggle) audioToggle.classList.add('active');
      if (audioIcon) audioIcon.textContent = '🔊';
      if (audioLabel) audioLabel.textContent = 'Audio ON';
      showToast('🔊 Ambient Soundscape: Active (Cinematic Modernization Stream)');
    } else {
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);

      isAudioPlaying = false;
      if (audioToggle) audioToggle.classList.remove('active');
      if (audioIcon) audioIcon.textContent = '🔈';
      if (audioLabel) audioLabel.textContent = 'Audio OFF';
      showToast('🔈 Ambient Soundscape: Muted');
    }
  }

  if (audioToggle) {
    audioToggle.addEventListener('click', toggleAudio);
  }

  // =========================================================================
  // 5. Hero Video Playback & Smooth Controls
  // =========================================================================
  const heroVideo = document.getElementById('heroVideo');
  const videoPlayPauseBtn = document.getElementById('videoPlayPauseBtn');
  const videoStatusText = document.getElementById('videoStatusText');

  if (videoPlayPauseBtn && heroVideo) {
    videoPlayPauseBtn.addEventListener('click', () => {
      if (heroVideo.paused) {
        heroVideo.play().then(() => {
          if (videoStatusText) videoStatusText.textContent = 'Modernization 3D Core Active';
        }).catch(() => {});
      } else {
        heroVideo.pause();
        if (videoStatusText) videoStatusText.textContent = 'Video Paused (Click to Resume)';
      }
    });
  }

  // =========================================================================
  // 6. "The Big-4 Alternative" Comparison Switcher
  // =========================================================================
  const tabAarkView = document.getElementById('tabAarkView');
  const tabBig4View = document.getElementById('tabBig4View');
  const comparisonCardsGrid = document.getElementById('comparisonCardsGrid');

  const AARK_COMPARISONS = [
    {
      badge: 'AARK Principle',
      badgeClass: 'badge-aark',
      aspect: 'Senior Architect Staffing',
      desc: '100% senior technical & functional architects write and deploy the solutions directly into your repository.',
      metric: 'Zero junior bench learning curve',
      isNegative: false
    },
    {
      badge: 'AARK Principle',
      badgeClass: 'badge-aark',
      aspect: 'Scope & Budget Certainty',
      desc: 'Milestone-based, fixed-scope architecture contracts. Transparent sprints with clear exit gates.',
      metric: '$0 surprise billing invoices',
      isNegative: false
    },
    {
      badge: 'AARK Principle',
      badgeClass: 'badge-aark',
      aspect: 'Velocity to Production',
      desc: 'Working software and data pipeline artifacts deployed into testing within 4 weeks of kickoff.',
      metric: 'Production V1 in 4–6 weeks',
      isNegative: false
    },
    {
      badge: 'AARK Principle',
      badgeClass: 'badge-aark',
      aspect: 'Total IP Handover',
      desc: 'Your internal team receives complete code ownership, dbt models, API schemas, and documentation.',
      metric: 'Zero proprietary vendor lock-in',
      isNegative: false
    }
  ];

  const BIG4_COMPARISONS = [
    {
      badge: 'Traditional Big-4',
      badgeClass: 'badge-big4',
      aspect: 'Junior Bench Staffing',
      desc: 'Partners pitch and sign the contract, then hand execution off to junior analysts training on your dime.',
      metric: 'Slow ramp-up & high defect rates',
      isNegative: true
    },
    {
      badge: 'Traditional Big-4',
      badgeClass: 'badge-big4',
      aspect: 'Open-Ended T&M Meter',
      desc: 'Hourly billing models with ambiguous deliverables and frequent change orders expanding project scope.',
      metric: 'Unpredictable budget drift',
      isNegative: true
    },
    {
      badge: 'Traditional Big-4',
      badgeClass: 'badge-big4',
      aspect: 'Prolonged Discovery Slideware',
      desc: 'Months spent delivering slide decks, governance steering rituals, and theoretical roadmaps before code starts.',
      metric: 'Delayed time-to-value',
      isNegative: true
    },
    {
      badge: 'Traditional Big-4',
      badgeClass: 'badge-big4',
      aspect: 'Vendor Dependency Lock-in',
      desc: 'Custom code and proprietary accelerators intentionally designed to require continuous retainer support.',
      metric: 'Long-term staffing dependency',
      isNegative: true
    }
  ];

  function renderComparison(isAark) {
    if (!comparisonCardsGrid) return;
    const items = isAark ? AARK_COMPARISONS : BIG4_COMPARISONS;
    
    comparisonCardsGrid.innerHTML = items.map(item => `
      <div class="comp-card ${isAark ? 'aark-card' : 'big4-card'}">
        <div class="comp-label-badge ${item.badgeClass}">${item.badge}</div>
        <h4 class="comp-aspect">${item.aspect}</h4>
        <p class="comp-desc">${item.desc}</p>
        <div class="comp-metric-highlight ${item.isNegative ? 'negative' : ''}">${item.metric}</div>
      </div>
    `).join('');
  }

  if (tabAarkView && tabBig4View) {
    tabAarkView.addEventListener('click', () => {
      tabAarkView.classList.add('active');
      tabBig4View.classList.remove('active');
      renderComparison(true);
    });

    tabBig4View.addEventListener('click', () => {
      tabBig4View.classList.add('active');
      tabAarkView.classList.remove('active');
      renderComparison(false);
    });
  }

  // =========================================================================
  // 6B. Chapter 01 Interactive Transformation Simulator Engine
  // =========================================================================
  const btnSelectAark = document.getElementById('btnSelectAark');
  const btnSelectBig4 = document.getElementById('btnSelectBig4');
  const simTitleText = document.getElementById('simTitleText');
  const simHeadline = document.getElementById('simHeadline');
  const simModeTag = document.getElementById('simModeTag');
  const simNarrativeText = document.getElementById('simNarrativeText');
  const simPointsList = document.getElementById('simPointsList');
  const simStatusBanner = document.getElementById('simStatusBanner');
  const simVisualDashboard = document.getElementById('simVisualDashboard');
  const dashChipStatus = document.getElementById('dashChipStatus');
  const dashTimerText = document.getElementById('dashTimerText');
  const simDynamicSvg = document.getElementById('simDynamicSvg');
  const dVal1 = document.getElementById('dVal1');
  const dLbl1 = document.getElementById('dLbl1');
  const dVal2 = document.getElementById('dVal2');
  const dLbl2 = document.getElementById('dLbl2');
  const dVal3 = document.getElementById('dVal3');
  const dLbl3 = document.getElementById('dLbl3');

  function updateSimulator(isAark) {
    if (!btnSelectAark || !btnSelectBig4) return;

    if (isAark) {
      btnSelectAark.classList.add('active');
      btnSelectAark.classList.remove('big4-active');
      btnSelectBig4.classList.remove('active', 'big4-active');
      if (simVisualDashboard) simVisualDashboard.classList.remove('big4-mode');

      if (simTitleText) simTitleText.textContent = 'The AARK High-Velocity Standard';
      if (simStatusBanner) {
        simStatusBanner.classList.add('aark-mode');
        simStatusBanner.classList.remove('big4-mode');
      }
      if (simModeTag) simModeTag.textContent = 'GUARANTEED OUTCOME';
      if (simHeadline) simHeadline.textContent = '100% Senior Principal Architects On The Tools';
      if (simNarrativeText) {
        simNarrativeText.textContent = 'The experts who scope your engagement are the exact senior technical and functional architects who execute the implementation. No bait-and-switch. You get direct access to principals with 15+ years of enterprise deployment experience.';
      }
      if (simPointsList) {
        simPointsList.innerHTML = `
          <div class="sim-point-item">
            <span class="point-icon text-cyan">✓</span>
            <div><strong>Direct Senior Leadership:</strong> No junior bench learning curve or layered billing pyramids.</div>
          </div>
          <div class="sim-point-item">
            <span class="point-icon text-cyan">✓</span>
            <div><strong>Fixed Scope &amp; Predictability:</strong> Milestone-based pricing with guaranteed working software handovers.</div>
          </div>
          <div class="sim-point-item">
            <span class="point-icon text-cyan">✓</span>
            <div><strong>Total IP Handover:</strong> Your team owns every dbt model, Python script, and Oracle pipeline configuration.</div>
          </div>
        `;
      }
      if (dashChipStatus) dashChipStatus.textContent = 'Mode: Senior Practitioner Pod';
      if (dashTimerText) dashTimerText.textContent = 'Production Target: 4 Weeks';
      if (dVal1) { dVal1.textContent = '0%'; dVal1.className = 'd-val text-cyan'; }
      if (dLbl1) dLbl1.textContent = 'Junior Bench Staff';
      if (dVal2) { dVal2.textContent = 'Fixed'; dVal2.className = 'd-val text-blue'; }
      if (dLbl2) dLbl2.textContent = 'Pricing & Scope';
      if (dVal3) { dVal3.textContent = '4 Weeks'; dVal3.className = 'd-val text-emerald'; }
      if (dLbl3) dLbl3.textContent = 'Production Speed';

      if (simDynamicSvg) {
        simDynamicSvg.innerHTML = `
          <g id="svgAarkGraph">
            <line x1="40" y1="100" x2="320" y2="100" stroke="#1E293B" stroke-width="4"/>
            <line x1="40" y1="100" x2="320" y2="100" stroke="url(#aarkLaserGrad)" stroke-width="4" stroke-dasharray="80 120" class="animated-laser-path"/>
            <circle cx="60" cy="100" r="18" fill="#0D121C" stroke="#00E5FF" stroke-width="2.5"/>
            <text x="60" y="104" fill="#00E5FF" font-size="11" font-weight="bold" font-family="monospace" text-anchor="middle">S01</text>
            <text x="60" y="136" fill="#94A3B8" font-size="10" font-family="sans-serif" text-anchor="middle">Fixed Scope</text>
            <circle cx="180" cy="100" r="18" fill="#0D121C" stroke="#3B82F6" stroke-width="2.5"/>
            <text x="180" y="104" fill="#3B82F6" font-size="11" font-weight="bold" font-family="monospace" text-anchor="middle">S02</text>
            <text x="180" y="136" fill="#94A3B8" font-size="10" font-family="sans-serif" text-anchor="middle">Principal Code</text>
            <circle cx="300" cy="100" r="18" fill="#0D121C" stroke="#10B981" stroke-width="2.5"/>
            <text x="300" y="104" fill="#10B981" font-size="11" font-weight="bold" font-family="monospace" text-anchor="middle">V1</text>
            <text x="300" y="136" fill="#10B981" font-size="10" font-family="sans-serif" text-anchor="middle">Production V1</text>
          </g>
          <defs>
            <linearGradient id="aarkLaserGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#00E5FF"/>
              <stop offset="100%" stop-color="#10B981"/>
            </linearGradient>
          </defs>
        `;
      }
    } else {
      btnSelectBig4.classList.add('active', 'big4-active');
      btnSelectAark.classList.remove('active');
      if (simVisualDashboard) simVisualDashboard.classList.add('big4-mode');

      if (simTitleText) simTitleText.textContent = 'The Legacy Big-4 Trap';
      if (simStatusBanner) {
        simStatusBanner.classList.remove('aark-mode');
        simStatusBanner.classList.add('big4-mode');
      }
      if (simModeTag) simModeTag.textContent = 'HIGH RISK & RUNAWAY COST';
      if (simHeadline) simHeadline.textContent = 'Junior Bench Learning On Your Billable Dime';
      if (simNarrativeText) {
        simNarrativeText.textContent = 'Partners pitch the engagement to win executive approval, but project execution is staffed by recent grads billing open-ended hours while training on your core infrastructure. Slideware replaces working software.';
      }
      if (simPointsList) {
        simPointsList.innerHTML = `
          <div class="sim-point-item">
            <span class="point-icon text-rose">✕</span>
            <div><strong>Junior Bench Churn:</strong> 70%+ of delivery hours executed by junior analysts on high hourly rates.</div>
          </div>
          <div class="sim-point-item">
            <span class="point-icon text-rose">✕</span>
            <div><strong>Open-Ended T&amp;M Meters:</strong> Scope creep and frequent change orders expanding project costs with zero accountability.</div>
          </div>
          <div class="sim-point-item">
            <span class="point-icon text-rose">✕</span>
            <div><strong>Vendor Lock-in:</strong> Proprietary templates that create long-term dependence rather than internal team mastery.</div>
          </div>
        `;
      }
      if (dashChipStatus) dashChipStatus.textContent = 'Mode: Big-4 Junior Training Meter';
      if (dashTimerText) dashTimerText.textContent = 'Projected Drift: 9+ Months';
      if (dVal1) { dVal1.textContent = '78%'; dVal1.className = 'd-val text-rose'; }
      if (dLbl1) dLbl1.textContent = 'Junior Staffing Ratio';
      if (dVal2) { dVal2.textContent = 'Uncapped'; dVal2.className = 'd-val text-rose'; }
      if (dLbl2) dLbl2.textContent = 'T&M Billing Meter';
      if (dVal3) { dVal3.textContent = '9+ Mos'; dVal3.className = 'd-val text-rose'; }
      if (dLbl3) dLbl3.textContent = 'Average Slippage';

      if (simDynamicSvg) {
        simDynamicSvg.innerHTML = `
          <g id="svgBig4Graph">
            <path d="M 30 95 C 40 85, 50 75, 60 75 C 100 75, 130 135, 175 115 C 215 95, 250 48, 290 65 C 305 72, 320 90, 335 95" stroke="#F43F5E" stroke-width="3" stroke-dasharray="6 6" fill="none"/>
            <circle cx="60" cy="75" r="18" fill="#180A0E" stroke="#F43F5E" stroke-width="2.5"/>
            <text x="60" y="79" fill="#F43F5E" font-size="10" font-weight="bold" font-family="monospace" text-anchor="middle">Slide 1</text>
            <circle cx="175" cy="115" r="18" fill="#180A0E" stroke="#F43F5E" stroke-width="2.5"/>
            <text x="175" y="119" fill="#F43F5E" font-size="9.5" font-weight="bold" font-family="monospace" text-anchor="middle">Re-train</text>
            <circle cx="290" cy="65" r="18" fill="#180A0E" stroke="#F43F5E" stroke-width="2.5"/>
            <text x="290" y="69" fill="#F43F5E" font-size="10" font-weight="bold" font-family="monospace" text-anchor="middle">Delay</text>
            <text x="180" y="162" fill="#FB7185" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle">Scope Creep &amp; Endless Steering Committees</text>
          </g>
        `;
      }
    }
  }

  if (btnSelectAark && btnSelectBig4) {
    btnSelectAark.addEventListener('click', () => updateSimulator(true));
    btnSelectBig4.addEventListener('click', () => updateSimulator(false));
  }

  // =========================================================================
  // 6C. Chapter 02 Interactive Practice Live Demos Engine
  // =========================================================================
  // 1. Oracle Migration Simulator
  const btnRunOracleSim = document.getElementById('btnRunOracleSim');
  const oracleSimStatus = document.getElementById('oracleSimStatus');
  let isOracleSimRunning = false;

  if (btnRunOracleSim && oracleSimStatus) {
    btnRunOracleSim.addEventListener('click', () => {
      if (isOracleSimRunning) return;
      isOracleSimRunning = true;
      btnRunOracleSim.disabled = true;
      btnRunOracleSim.textContent = 'Simulating...';

      oracleSimStatus.textContent = 'Step 1/3: Extracting on-prem EBS ledger & PO records...';
      oracleSimStatus.style.color = 'var(--accent-cyan)';

      setTimeout(() => {
        oracleSimStatus.textContent = 'Step 2/3: Transforming to Fusion FBDI batch with zero data loss...';
        oracleSimStatus.style.color = 'var(--accent-blue)';
      }, 1200);

      setTimeout(() => {
        oracleSimStatus.textContent = 'Step 3/3: Validated 100% data fidelity in Oracle Fusion Cloud';
        oracleSimStatus.style.color = 'var(--accent-emerald)';
        btnRunOracleSim.disabled = false;
        btnRunOracleSim.textContent = 'Re-Run Migration Wave ↺';
        isOracleSimRunning = false;
      }, 2600);
    });
  }

  // 2. GenAI Citation Assistant Demo
  const btnTriggerAiDemo = document.getElementById('btnTriggerAiDemo');
  const aiTypingText = document.getElementById('aiTypingText');
  const citationPills = document.getElementById('citationPills');
  let isAiDemoRunning = false;

  if (btnTriggerAiDemo && aiTypingText) {
    btnTriggerAiDemo.addEventListener('click', () => {
      if (isAiDemoRunning) return;
      isAiDemoRunning = true;
      btnTriggerAiDemo.disabled = true;
      btnTriggerAiDemo.textContent = 'Querying Vector Lakehouse...';
      if (citationPills) citationPills.hidden = true;

      const fullDraft = 'Generated draft: "Our compliance methodology follows ISO-27001 audited protocols with automated role-based access verification..."';
      aiTypingText.textContent = '';
      let charIdx = 0;

      const typeInterval = setInterval(() => {
        if (charIdx < fullDraft.length) {
          aiTypingText.textContent += fullDraft.charAt(charIdx);
          charIdx++;
        } else {
          clearInterval(typeInterval);
          if (citationPills) citationPills.hidden = false;
          btnTriggerAiDemo.disabled = false;
          btnTriggerAiDemo.textContent = 'Run Another Query ↺';
          isAiDemoRunning = false;
        }
      }, 22);
    });
  }

  // 3. Quoting Speedrun Simulator
  const btnRunCpqDemo = document.getElementById('btnRunCpqDemo');
  const cpqTimer = document.getElementById('cpqTimer');
  const cpqBarFill = document.getElementById('cpqBarFill');
  const cpqStatusText = document.getElementById('cpqStatusText');
  let isCpqDemoRunning = false;

  if (btnRunCpqDemo && cpqTimer && cpqBarFill) {
    btnRunCpqDemo.addEventListener('click', () => {
      if (isCpqDemoRunning) return;
      isCpqDemoRunning = true;
      btnRunCpqDemo.disabled = true;
      btnRunCpqDemo.textContent = 'Calculating...';

      let currentMinutes = 72 * 60; // 4320 mins
      const targetMinutes = 20;
      let step = 0;
      cpqBarFill.style.width = '10%';

      const speedInterval = setInterval(() => {
        step++;
        currentMinutes = Math.max(targetMinutes, Math.round(currentMinutes * 0.55));
        
        if (currentMinutes > 60) {
          cpqTimer.textContent = `${Math.round(currentMinutes / 60)} Hours`;
        } else {
          cpqTimer.textContent = `${currentMinutes} Minutes`;
        }
        
        cpqBarFill.style.width = `${Math.min(100, 10 + step * 22)}%`;

        if (currentMinutes <= targetMinutes || step >= 6) {
          clearInterval(speedInterval);
          cpqTimer.textContent = '20.4 Mins';
          cpqBarFill.style.width = '100%';
          if (cpqStatusText) {
            cpqStatusText.textContent = 'Instant PDF Quote Generated, Discount Approved & Synced with ERP in 20.4 Minutes!';
            cpqStatusText.style.color = 'var(--accent-emerald)';
          }
          btnRunCpqDemo.disabled = false;
          btnRunCpqDemo.textContent = 'Test Complex Discount Rule ↺';
          isCpqDemoRunning = false;
        }
      }, 200);
    });
  }

  // =========================================================================
  // 7. Case Studies Interactive Tabs & SVG Gauge Triggers
  // =========================================================================
  const caseTabs = document.querySelectorAll('.case-tab');
  const casePanels = document.querySelectorAll('.case-panel');

  caseTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const caseNumber = tab.getAttribute('data-case');

      caseTabs.forEach(t => t.classList.remove('active'));
      casePanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const activePanel = document.getElementById(`casePanel${caseNumber}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });

  // =========================================================================
  // 8. Interactive Automation Savings Calculator & SVG Wave Engine
  // =========================================================================
  const teamSlider = document.getElementById('teamSizeSlider');
  const sliderValue = document.getElementById('sliderValue');
  const calcHoursSaved = document.getElementById('calcHoursSaved');
  const calcCapacityVal = document.getElementById('calcCapacityVal');
  const calcSpeedupVal = document.getElementById('calcSpeedupVal');
  const gaugePercentage = document.getElementById('gaugePercentage');
  const gaugeBarFill = document.getElementById('gaugeBarFill');
  const svgWavePath = document.getElementById('svgWavePath');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const calcCtaBtn = document.getElementById('calcCtaBtn');

  function updateCalculator() {
    if (!teamSlider) return;

    const staff = parseInt(teamSlider.value, 10);

    if (sliderValue) {
      sliderValue.textContent = `${staff} Staff`;
    }

    // Client verified formula:
    // 45 staff => ~158 hrs/wk, $394k/yr, 3.2x speedup
    const hoursWeekly = Math.round(staff * 3.511);
    const capacityDollars = Math.round(staff * 8755.5);
    const speedMultiplier = (2.0 + (staff / 150) * 2.0).toFixed(1);

    // Format capacity
    let formattedCapacity = '';
    if (capacityDollars >= 1000000) {
      formattedCapacity = `$${(capacityDollars / 1000000).toFixed(2)}M/yr`;
    } else {
      formattedCapacity = `$${Math.round(capacityDollars / 1000)}k/yr`;
    }

    // Capacity percentage reclaimed
    const workweekPct = Math.min(65, Math.round((hoursWeekly / (staff * 40)) * 100 + (staff / 6)));

    if (calcHoursSaved) calcHoursSaved.textContent = `~${hoursWeekly} hrs`;
    if (calcCapacityVal) calcCapacityVal.textContent = formattedCapacity;
    if (calcSpeedupVal) calcSpeedupVal.textContent = `${speedMultiplier}x`;
    if (gaugePercentage) gaugePercentage.textContent = `~${hoursWeekly} hrs / week reclaimed`;
    if (gaugeBarFill) gaugeBarFill.style.width = `${workweekPct}%`;

    // Dynamic SVG Wave modification based on velocity
    if (svgWavePath) {
      const waveAmp = Math.round(5 + (staff / 150) * 18);
      svgWavePath.setAttribute('d', `M 0 25 Q 125 ${25 - waveAmp}, 250 25 T 500 25`);
    }

    // Sync preset button state
    presetBtns.forEach(btn => {
      const presetVal = parseInt(btn.getAttribute('data-preset'), 10);
      btn.classList.toggle('active', presetVal === staff);
    });
  }

  if (teamSlider) {
    teamSlider.addEventListener('input', updateCalculator);
    updateCalculator();
  }

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const presetVal = parseInt(btn.getAttribute('data-preset'), 10);
      if (teamSlider) {
        teamSlider.value = presetVal;
        updateCalculator();
      }
    });
  });

  if (calcCtaBtn) {
    calcCtaBtn.addEventListener('click', () => {
      const areaSelect = document.getElementById('modernizationArea');
      if (areaSelect) {
        areaSelect.value = 'Dedicated Architecture Pod';
      }
      const goalsInput = document.getElementById('projectGoals');
      if (goalsInput && teamSlider) {
        goalsInput.value = `Exploring automation and modernization capacity for ~${teamSlider.value} operations/knowledge staff.`;
      }
    });
  }

  // =========================================================================
  // 9. Practice Direct Routing to Consultation Form
  // =========================================================================
  const practiceActionLinks = document.querySelectorAll('[data-topic]');
  const modernizationSelect = document.getElementById('modernizationArea');

  practiceActionLinks.forEach(link => {
    link.addEventListener('click', () => {
      const topic = link.getAttribute('data-topic');
      if (topic && modernizationSelect) {
        modernizationSelect.value = topic;
      }
    });
  });

  // =========================================================================
  // 10. Consultation Form Validation & Submission
  // =========================================================================
  const consultationForm = document.getElementById('consultationForm');
  const formSuccessState = document.getElementById('formSuccessState');
  const confirmEmail = document.getElementById('confirmEmail');
  const resetFormBtn = document.getElementById('resetFormBtn');

  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const fullName = document.getElementById('fullName');
      const workEmail = document.getElementById('workEmail');
      const companyName = document.getElementById('companyName');
      const modernizationArea = document.getElementById('modernizationArea');

      document.querySelectorAll('.err-text').forEach(el => el.textContent = '');

      if (!fullName.value.trim()) {
        document.getElementById('nameError').textContent = 'Please enter your full name.';
        isValid = false;
      }

      if (!workEmail.value.trim() || !validateEmail(workEmail.value)) {
        document.getElementById('emailError').textContent = 'Please enter a valid work email.';
        isValid = false;
      }

      if (!companyName.value.trim()) {
        document.getElementById('companyError').textContent = 'Please enter your company name.';
        isValid = false;
      }

      if (!modernizationArea.value) {
        document.getElementById('areaError').textContent = 'Please select a priority modernization area.';
        isValid = false;
      }

      if (isValid) {
        if (confirmEmail) {
          confirmEmail.textContent = workEmail.value.trim();
        }
        consultationForm.style.display = 'none';
        if (formSuccessState) {
          formSuccessState.hidden = false;
        }
      }
    });
  }

  if (resetFormBtn && consultationForm) {
    resetFormBtn.addEventListener('click', () => {
      consultationForm.reset();
      consultationForm.style.display = 'block';
      if (formSuccessState) {
        formSuccessState.hidden = true;
      }
    });
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // =========================================================================
  // 11. Navigation Active Highlighting & Mobile Menu
  // =========================================================================
  const navLinks = document.querySelectorAll('.primary-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const primaryNav = document.getElementById('primaryNav');

  if (mobileMenuBtn && primaryNav) {
    mobileMenuBtn.addEventListener('click', () => {
      primaryNav.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('open');
      });
    });
  }

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-25% 0px -55% 0px'
  });

  sections.forEach(section => {
    sectionObserver.observe(section);
  });
});
