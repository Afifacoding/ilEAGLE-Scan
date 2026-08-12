const MAX_INPUT_LENGTH = 20000;

const RULES = [
  {
    id: "keylogger-keydown",
    label: "Keyboard input monitoring",
    category: "Keylogging",
    severity: "HIGH",
    weight: 25,
    patterns: [
      /addEventListener\s*\(\s*['"`]keydown/i,
      /keyup/i,
      /keypress/i,
      /KeyboardEvent/i,
      /event\.key/i,
    ],
    explanation:
      "The content monitors keyboard events and may capture information typed by the user.",
    recommendation:
      "Review all keyboard listeners and remove unnecessary keystroke collection.",
    xray:
      "Registers a keyboard event listener that can observe keys pressed by the user.",
  },

  {
    id: "clipboard-read",
    label: "Clipboard monitoring",
    category: "Clipboard monitoring",
    severity: "HIGH",
    weight: 25,
    patterns: [
      /navigator\.clipboard/i,
      /clipboard\.readText/i,
      /clipboardData/i,
      /document\.execCommand\s*\(\s*['"`]paste/i,
    ],
    explanation:
      "The content attempts to access clipboard information.",
    recommendation:
      "Restrict clipboard access and verify that the operation is explicitly required.",
    xray:
      "Attempts to read or interact with clipboard contents.",
  },

  {
    id: "clipboard-write",
    label: "Clipboard modification",
    category: "Clipboard monitoring",
    severity: "MEDIUM",
    weight: 15,
    patterns: [
      /navigator\.clipboard\.writeText/i,
      /navigator\.clipboard\.write/i,
      /document\.execCommand\s*\(\s*['"`]copy/i,
    ],
    explanation:
      "The content can write data to the clipboard, which may replace copied text with attacker-controlled values.",
    recommendation:
      "Validate whether clipboard writes are necessary and prevent untrusted scripts from changing clipboard content.",
    xray:
      "Writes or replaces clipboard contents that users may paste into other locations.",
  },

  {
    id: "cookie-access",
    label: "Browser cookie access",
    category: "Credential access",
    severity: "HIGH",
    weight: 25,
    patterns: [
      /document\.cookie/i,
      /cookies?/i,
    ],
    explanation:
      "The content references browser cookies that can potentially contain session information.",
    recommendation:
      "Avoid exposing cookies to untrusted scripts and review browser security controls.",
    xray:
      "Reads browser cookie data that could potentially contain authentication information.",
  },

  {
    id: "credential-pattern",
    label: "Credential field access",
    category: "Credential access",
    severity: "MEDIUM",
    weight: 15,
    patterns: [
      /type\s*=\s*['"`]password['"`]/i,
      /getElementById\s*\(\s*['"`].*(password|passwd|otp|pin).*/i,
      /querySelector\s*\(\s*['"`].*(password|passwd|otp|pin).*/i,
      /name\s*=\s*['"`](password|passwd|otp|pin|token)['"`]/i,
    ],
    explanation:
      "The content references password or credential-related input handling.",
    recommendation:
      "Review how credential fields are handled and ensure sensitive values are not collected or transmitted in unsafe ways.",
    xray:
      "Interacts with credential-related fields or authentication text patterns.",
  },

  {
    id: "fetch-network",
    label: "Outbound network request",
    category: "Data exfiltration",
    severity: "MEDIUM",
    weight: 15,
    patterns: [
      /\bfetch\s*\(/i,
      /XMLHttpRequest/i,
      /\.open\s*\(\s*['"`](GET|POST|PUT|PATCH)/i,
      /axios\.(get|post|put|request)/i,
    ],
    explanation:
      "The content makes or appears prepared to make an outbound network request.",
    recommendation:
      "Verify the destination and ensure that sensitive information is not transmitted.",
    xray:
      "Creates an outbound request that can send collected information to another system.",
  },

  {
    id: "socket-network",
    label: "Persistent remote communication",
    category: "Remote control",
    severity: "HIGH",
    weight: 25,
    patterns: [
      /new\s+WebSocket\s*\(/i,
      /socket\.io/i,
      /wss?:\/\//i,
      /EventSource\s*\(/i,
    ],
    explanation:
      "The content establishes a persistent communication channel to a remote endpoint.",
    recommendation:
      "Validate every remote channel endpoint and block unauthorized command-and-control style communications.",
    xray:
      "Opens a long-lived remote communication channel that can receive or send ongoing commands or data.",
  },

  {
    id: "beacon-exfil",
    label: "Background telemetry transmission",
    category: "Data exfiltration",
    severity: "MEDIUM",
    weight: 15,
    patterns: [
      /navigator\.sendBeacon\s*\(/i,
      /new\s+Image\s*\(\s*\)\s*\.src\s*=\s*/i,
      /img\.src\s*=\s*['"`]https?:\/\//i,
    ],
    explanation:
      "The content can send data in the background through beacon/image request techniques.",
    recommendation:
      "Inspect payloads and destinations for beacon-style requests and block unapproved endpoints.",
    xray:
      "Sends data quietly through background request mechanisms.",
  },

  {
    id: "webhook",
    label: "Webhook or collection endpoint",
    category: "Data exfiltration",
    severity: "HIGH",
    weight: 25,
    patterns: [
      /webhook/i,
      /webhook\.site/i,
      /requestbin/i,
      /ngrok/i,
      /burpcollaborator/i,
    ],
    explanation:
      "A known collection or callback endpoint is referenced.",
    recommendation:
      "Verify that the endpoint is legitimate and never send credentials or sensitive data to it.",
    xray:
      "References an endpoint that may be used to receive collected information.",
  },

  {
    id: "base64",
    label: "Base64 encoding",
    category: "Obfuscation",
    severity: "MEDIUM",
    weight: 15,
    patterns: [
      /btoa\s*\(/i,
      /atob\s*\(/i,
      /base64/i,
      /fromCharCode/i,
    ],
    explanation:
      "Encoding functions may be used to transform or hide data.",
    recommendation:
      "Inspect encoded values and determine why the transformation is required.",
    xray:
      "Transforms data into an encoded representation, potentially making the transmitted content harder to inspect.",
  },

  {
    id: "encoded-payload",
    label: "Large encoded payload",
    category: "Obfuscation",
    severity: "MEDIUM",
    weight: 15,
    patterns: [
      /[A-Za-z0-9+/]{160,}={0,2}/,
      /%[0-9A-Fa-f]{2}%[0-9A-Fa-f]{2}%[0-9A-Fa-f]{2}/,
      /0x[0-9A-Fa-f]{2,}/,
    ],
    explanation:
      "The content contains long encoded or escaped sequences that can hide true behavior.",
    recommendation:
      "Decode suspicious payloads in a controlled environment and inspect the decoded logic before trusting it.",
    xray:
      "Contains long encoded or escaped data blocks that may conceal executable behavior or destinations.",
  },

  {
    id: "eval",
    label: "Dynamic code execution",
    category: "Shell execution",
    severity: "CRITICAL",
    weight: 40,
    patterns: [
      /\beval\s*\(/i,
      /new\s+Function\s*\(/i,
      /\bFunction\s*\(/,
      /setTimeout\s*\(\s*['"`][^'"`]+['"`]/i,
      /setInterval\s*\(\s*['"`][^'"`]+['"`]/i,
    ],
    explanation:
      "The content contains a mechanism capable of dynamically executing code.",
    recommendation:
      "Avoid dynamic code execution and replace it with explicit, validated logic.",
    xray:
      "Dynamically interprets or constructs executable code.",
  },

  {
    id: "dynamic-import",
    label: "Runtime code loading",
    category: "Remote control",
    severity: "HIGH",
    weight: 25,
    patterns: [
      /import\s*\(/i,
      /require\s*\(\s*[^)]+\+/i,
      /Invoke-Expression/i,
      /IEX\s+\(New-Object\s+Net\.WebClient\)/i,
    ],
    explanation:
      "The content can load or execute code at runtime from computed or external sources.",
    recommendation:
      "Replace runtime-loaded logic with explicit static dependencies and block untrusted dynamic execution paths.",
    xray:
      "Loads executable logic dynamically instead of using fixed, reviewed source code.",
  },

  {
    id: "shell",
    label: "Shell command execution",
    category: "Shell execution",
    severity: "CRITICAL",
    weight: 40,
    patterns: [
      /child_process/i,
      /exec\s*\(/i,
      /execSync\s*\(/i,
      /spawn\s*\(/i,
      /powershell/i,
      /cmd\.exe/i,
      /\/bin\/sh/i,
      /bash\s+-c/i,
      /subprocess\.(Popen|run|call)/i,
      /os\.system\s*\(/i,
      /system\s*\(/i,
      /shell_exec\s*\(/i,
      /passthru\s*\(/i,
      /proc_open\s*\(/i,
    ],
    explanation:
      "The content references operating-system command execution.",
    recommendation:
      "Remove unnecessary shell execution and strictly validate any required commands.",
    xray:
      "Attempts to interact with the operating-system command environment.",
  },

  {
    id: "powershell",
    label: "PowerShell execution",
    category: "Shell execution",
    severity: "CRITICAL",
    weight: 40,
    patterns: [
      /powershell\.exe/i,
      /powershell\s+-enc/i,
      /-encodedcommand/i,
      /invoke-expression/i,
      /iex\s*\(/i,
    ],
    explanation:
      "PowerShell execution or encoded PowerShell commands are referenced.",
    recommendation:
      "Investigate the PowerShell command and remove unauthorized execution.",
    xray:
      "Uses or references PowerShell execution, potentially allowing system commands to run.",
  },

  {
    id: "obfuscation",
    label: "Possible code obfuscation",
    category: "Obfuscation",
    severity: "MEDIUM",
    weight: 15,
    patterns: [
      /\\x[0-9a-f]{2}/i,
      /\\u[0-9a-f]{4}/i,
      /String\.fromCharCode/i,
      /decodeURIComponent/i,
      /unescape\s*\(/i,
    ],
    explanation:
      "The content contains patterns commonly associated with encoded or obfuscated values.",
    recommendation:
      "Decode and inspect the underlying content before trusting it.",
    xray:
      "Transforms encoded values back into characters or data.",
  },

  {
    id: "browser-manipulation",
    label: "Browser context manipulation",
    category: "Browser manipulation",
    severity: "MEDIUM",
    weight: 15,
    patterns: [
      /window\.location\s*=|location\.href\s*=|location\.replace\s*\(/i,
      /history\.pushState\s*\(/i,
      /window\.open\s*\(/i,
      /document\.write\s*\(/i,
      /iframe/i,
    ],
    explanation:
      "The content changes browser state, navigation, or rendered content in ways that can mislead users.",
    recommendation:
      "Validate redirect/navigation targets and prevent untrusted scripts from controlling browser flow.",
    xray:
      "Manipulates browser navigation or page rendering behavior.",
  },

  {
    id: "persistence",
    label: "Persistence indicator",
    category: "Persistence",
    severity: "HIGH",
    weight: 25,
    patterns: [
      /schtasks/i,
      /scheduled\s*task/i,
      /startup/i,
      /RunOnce/i,
      /crontab/i,
      /cron\s+/i,
      /registry.*run/i,
      /HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run/i,
      /LaunchAgents|LaunchDaemons/i,
      /systemctl\s+enable/i,
    ],
    explanation:
      "The content references mechanisms that may cause activity to start automatically.",
    recommendation:
      "Review startup entries, scheduled tasks and persistence mechanisms.",
    xray:
      "References mechanisms that can cause code or applications to execute automatically.",
  },

  {
    id: "file-manipulation",
    label: "Local file manipulation",
    category: "File manipulation",
    severity: "HIGH",
    weight: 25,
    patterns: [
      /fs\.(readFile|writeFile|appendFile|unlink|rm|rename)\s*\(/i,
      /open\s*\(.*['"`][wa]['"`]/i,
      /rm\s+-rf|del\s+\/f|Remove-Item\s+-Recurse/i,
      /file_put_contents\s*\(|fopen\s*\(|unlink\s*\(/i,
      /chmod\s*\(|chown\s*\(/i,
    ],
    explanation:
      "The content can create, modify, or delete local files.",
    recommendation:
      "Audit file write/delete paths, apply least privilege, and block untrusted file operations.",
    xray:
      "Performs local file-system operations that can alter or remove files.",
  },

  {
    id: "download",
    label: "Remote file download",
    category: "Network indicator",
    severity: "HIGH",
    weight: 25,
    patterns: [
      /download/i,
      /\.exe\b/i,
      /\.dll\b/i,
      /\.ps1\b/i,
      /\.bat\b/i,
      /\.zip\b/i,
      /curl\s+https?:\/\//i,
      /wget\s+https?:\/\//i,
      /Invoke-WebRequest/i,
      /Start-BitsTransfer/i,
    ],
    explanation:
      "The content references downloadable or executable files.",
    recommendation:
      "Verify the source and avoid executing unknown downloaded files.",
    xray:
      "References files that could potentially be downloaded or executed.",
  },

  {
    id: "ip-address",
    label: "Direct IP network indicator",
    category: "Network indicator",
    severity: "MEDIUM",
    weight: 15,
    patterns: [
      /\b(?:https?:\/\/)?(?:\d{1,3}\.){3}\d{1,3}\b/i,
    ],
    explanation:
      "A direct IPv4 address is referenced.",
    recommendation:
      "Verify that the destination is trusted.",
    xray:
      "Communicates with or references a system using a direct IP address.",
  },

  {
    id: "private-or-loopback-ip",
    label: "Local/private IP target",
    category: "Network indicator",
    severity: "LOW",
    weight: 5,
    patterns: [
      /\b127\.0\.0\.1\b|\blocalhost\b/i,
      /\b10\.(?:\d{1,3}\.){2}\d{1,3}\b/i,
      /\b192\.168\.(?:\d{1,3}\.)\d{1,3}\b/i,
      /\b172\.(1[6-9]|2\d|3[0-1])\.(?:\d{1,3}\.)\d{1,3}\b/i,
    ],
    explanation:
      "The content references local or private network addresses.",
    recommendation:
      "Validate whether internal host access is expected and review for possible lateral movement patterns.",
    xray:
      "Targets local or private-network systems rather than public hosts.",
  },

  {
    id: "suspicious-url",
    label: "Suspicious URL structure",
    category: "URL indicator",
    severity: "MEDIUM",
    weight: 15,
    patterns: [
      /secure-login/i,
      /verify-account/i,
      /password-reset/i,
      /account-check/i,
      /login-verify/i,
      /free-[\w-]+/i,
      /@[^\s/]+\./i,
      /xn--/i,
      /(secure|verify|update|reset).*(account|wallet|bank|login)/i,
    ],
    explanation:
      "The URL contains terminology frequently associated with deceptive login or account pages.",
    recommendation:
      "Do not enter credentials until the domain and destination have been independently verified.",
    xray:
      "Uses account or authentication-related wording that may be intended to create urgency or trust.",
  },

  {
    id: "redirect-chain",
    label: "Suspicious redirect behavior",
    category: "URL indicator",
    severity: "MEDIUM",
    weight: 15,
    patterns: [
      /redirect\s*=\s*https?:\/\//i,
      /redirect\s*=/i,
      /next\s*=\s*https?:\/\//i,
      /next\s*=/i,
      /url\s*=\s*https?:\/\//i,
      /url\s*=/i,
      /window\.location\s*=\s*['"`]https?:\/\//i,
    ],
    explanation:
      "The content includes redirect patterns that can send users to alternate destinations.",
    recommendation:
      "Verify redirect targets and block open-redirect patterns to prevent credential theft and phishing pivots.",
    xray:
      "Redirects users or requests to different URLs that may not be trusted.",
  },

  {
    id: "data-collection",
    label: "Potential sensitive-data collection",
    category: "Data exfiltration",
    severity: "HIGH",
    weight: 25,
    patterns: [
      /password/i,
      /credential/i,
      /token/i,
      /authorization/i,
      /localStorage/i,
      /sessionStorage/i,
      /document\.cookie/i,
      /private key|seed phrase|mnemonic/i,
    ],
    explanation:
      "The content references potentially sensitive credentials, tokens or browser storage.",
    recommendation:
      "Verify that sensitive information is not being collected or transmitted without authorization.",
    xray:
      "References sensitive authentication or browser data.",
  },

  {
    id: "token-header",
    label: "Auth token transmission",
    category: "Credential access",
    severity: "HIGH",
    weight: 25,
    patterns: [
      /Authorization\s*:\s*['"`]Bearer/i,
      /api[_-]?key/i,
      /setRequestHeader\s*\(\s*['"`]Authorization/i,
      /x-api-key/i,
    ],
    explanation:
      "The content references API keys or authorization token handling that may expose privileged credentials.",
    recommendation:
      "Move sensitive tokens to secure storage, rotate exposed keys, and enforce least-privilege token scope.",
    xray:
      "Handles authorization headers or API keys that can grant account or system access.",
  },
];

function detectInputType(input) {
  const trimmed = input.trim();

  if (
    /^https?:\/\//i.test(trimmed) ||
    /^www\./i.test(trimmed)
  ) {
    return "URL";
  }

  if (
    /\b(powershell|invoke-expression|encodedcommand|iex\b)/i.test(trimmed)
  ) {
    return "POWERSHELL";
  }

  if (
    /\b(bash|sh\s+-c|curl\s|wget\s|rm\s+-rf|chmod\s|crontab)\b/i.test(trimmed)
  ) {
    return "SHELL SCRIPT";
  }

  if (
    /<\/?(html|script|iframe|form|input)[\s>]/i.test(trimmed)
  ) {
    return "HTML";
  }

  if (
    /\b(def\s+\w+\s*\(|import\s+os\b|subprocess\.|__name__\s*==\s*['"`]__main__)/i.test(trimmed)
  ) {
    return "PYTHON";
  }

  if (
    /\b(<\?php|\$_(GET|POST|REQUEST)|shell_exec\s*\(|eval\s*\()/.test(trimmed)
  ) {
    return "PHP";
  }

  if (
    /function\s*\(/i.test(trimmed) ||
    /=>/i.test(trimmed) ||
    /<script/i.test(trimmed) ||
    /import\s+/i.test(trimmed) ||
    /const\s+/i.test(trimmed) ||
    /let\s+/i.test(trimmed)
  ) {
    return "CODE";
  }

  return "TEXT / LOG";
}

function extractEvidence(pattern, content) {
  const match = content.match(pattern);

  if (!match || !match[0]) {
    return pattern.source;
  }

  return match[0].replace(/\s+/g, " ").slice(0, 160);
}

function listMatchedCategories(indicators) {
  return [...new Set(indicators.map((item) => item.category))];
}

function addUnique(list, item) {
  if (item && !list.includes(item)) {
    list.push(item);
  }
}

function calculateEntropy(text) {
  if (!text) return 0;

  const frequencies = {};

  for (const char of text) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }

  let entropy = 0;

  for (const count of Object.values(frequencies)) {
    const probability = count / text.length;
    entropy -= probability * Math.log2(probability);
  }

  return Number(entropy.toFixed(2));
}

function getConfidence(score, indicatorCount) {
  if (indicatorCount >= 4 || score >= 70) return "HIGH";
  if (indicatorCount >= 2 || score >= 30) return "MEDIUM";
  return "LOW";
}

function getVerdict(score) {
  if (score >= 50) return "DANGEROUS";
  if (score >= 20) return "SUSPICIOUS";
  return "SAFE";
}

function scanContent(input, type = "auto") {
  const originalLength = input.length;

  const content = input.slice(0, MAX_INPUT_LENGTH);

  const inputType =
    type === "auto" ? detectInputType(content) : type.toUpperCase();

  const indicators = [];

  for (const rule of RULES) {
    const matchedPatterns = rule.patterns.filter((pattern) =>
      pattern.test(content)
    );

    if (matchedPatterns.length > 0) {
      indicators.push({
        id: rule.id,
        label: rule.label,
        category: rule.category,
        severity: rule.severity,
        evidence: extractEvidence(matchedPatterns[0], content),
        explanation: rule.explanation,
        recommendation: rule.recommendation,
      });
    }
  }

  let score = 0;

  for (const indicator of indicators) {
    const rule = RULES.find((r) => r.id === indicator.id);

    if (rule) {
      score += rule.weight;
    }
  }

  const categories = listMatchedCategories(indicators);

  // Correlation bonus: related suspicious behaviors combined should weigh more.
  const hasCollection =
    indicators.some(
      (x) =>
        x.category === "Data exfiltration" ||
        x.category === "Credential access" ||
        x.category === "Clipboard monitoring"
    ) ||
    /cookie|clipboard|password|credential|token/i.test(content);

  const hasNetwork =
    indicators.some(
      (x) =>
        x.category === "Network indicator" ||
        x.category === "Data exfiltration" ||
        x.category === "Remote control"
    ) || /fetch\s*\(|XMLHttpRequest|axios|WebSocket|sendBeacon/i.test(content);

  if (hasCollection && hasNetwork) {
    score += 15;
  }

  const hasExecution = indicators.some(
    (x) =>
      x.category === "Shell execution" ||
      x.category === "Remote control"
  );

  const hasPersistence = indicators.some((x) => x.category === "Persistence");

  if (hasExecution && hasPersistence) {
    score += 10;
  }

  const hasObfuscation = indicators.some((x) => x.category === "Obfuscation");

  if (hasObfuscation && (hasExecution || hasNetwork)) {
    score += 10;
  }

  if (indicators.length >= 6) {
    score += 5;
  }

  score = Math.min(100, score);

  const verdict = getVerdict(score);

  const xray = indicators.map((indicator) => {
    const rule = RULES.find((r) => r.id === indicator.id);

    const categoryReason = {
      "Keylogging": "This can expose typed passwords, messages, and sensitive form input.",
      "Clipboard monitoring": "Clipboard data may include copied passwords, tokens, and private text.",
      "Credential access": "Credential or session data can lead to account takeover if leaked.",
      "Browser manipulation": "Forced navigation or injected content can redirect users to fraudulent flows.",
      "Data exfiltration": "Outbound communication can transmit collected data to remote systems.",
      "Obfuscation": "Hidden or encoded logic makes behavior harder to inspect and can conceal malicious steps.",
      "Shell execution": "System command execution may allow direct host-level compromise.",
      "Remote control": "Persistent remote channels can support attacker-controlled actions.",
      "Persistence": "Persistence mechanisms can survive reboot/login and re-trigger malicious behavior.",
      "File manipulation": "File read/write/delete operations can alter or destroy local data.",
      "Network indicator": "Network endpoints and downloader patterns require destination trust validation.",
      "URL indicator": "Deceptive URL patterns are commonly used in phishing and credential theft campaigns.",
    };

    return {
      pattern: indicator.label,
      severity: indicator.severity,
      meaning: rule ? rule.xray : indicator.explanation,
      relevance: categoryReason[indicator.category] || indicator.explanation,
    };
  });

  if (xray.length === 0) {
    xray.push({
      pattern: "No suspicious indicator matched",
      severity: "LOW",
      meaning:
        "No notable malicious behavior pattern was identified in the submitted text by current deterministic heuristics.",
      relevance:
        "This is a static heuristic result and should not be treated as a guarantee that the content is harmless.",
    });
  }

  const impact = [];

  const impactByCategory = {
    "Keylogging": "Typed passwords, messages, and other sensitive keystrokes may be exposed.",
    "Clipboard monitoring": "Copied passwords, tokens, or sensitive clipboard text may be exposed.",
    "Credential access": "Authentication credentials, cookies, or tokens may be stolen and abused.",
    "Browser manipulation": "Users may be redirected or shown manipulated browser content to harvest credentials.",
    "Data exfiltration": "Collected information may be transmitted to an external system.",
    "Obfuscation": "Potentially harmful behavior may be intentionally hidden from review.",
    "Shell execution": "System commands could be executed, enabling host compromise.",
    "Remote control": "Attacker-controlled remote actions may become possible.",
    "Persistence": "Suspicious behavior may survive reboot/login and continue over time.",
    "File manipulation": "Local files may be modified, deleted, or accessed without authorization.",
    "Network indicator": "Suspicious network indicators may represent command, payload, or staging endpoints.",
    "URL indicator": "The URL pattern may indicate phishing or fraudulent credential collection.",
  };

  for (const category of categories) {
    addUnique(impact, impactByCategory[category]);
  }

  if (hasCollection && hasNetwork) {
    addUnique(
      impact,
      "Combined data collection and outbound communication increases the risk of active data exfiltration."
    );
  }

  if (hasExecution && hasPersistence) {
    addUnique(
      impact,
      "Execution combined with persistence can support durable compromise across reboots."
    );
  }

  if (impact.length === 0 && verdict === "SAFE") {
    addUnique(
      impact,
      "No specific malicious impact was identified by the current deterministic heuristic rules."
    );
  }

  const remediation = [];

  if (verdict === "SAFE") {
    addUnique(
      remediation,
      "No suspicious heuristic matched. Continue normal code review and security testing."
    );
    addUnique(
      remediation,
      "Keep systems and security tooling updated, and maintain endpoint protection baselines."
    );
    addUnique(
      remediation,
      "Do not treat a Safe result as proof that the content is completely harmless."
    );
  } else {
    addUnique(
      remediation,
      "Do not execute or open the suspicious content."
    );

    addUnique(
      remediation,
      "Verify every domain, endpoint, downloaded file and external resource referenced by the content."
    );

    const remediationByCategory = {
      "Keylogging": "Isolate the affected device, stop entering sensitive credentials, and run trusted offline/deep malware scans.",
      "Clipboard monitoring": "Avoid copying sensitive data on the affected system and investigate clipboard access behavior.",
      "Credential access": "Change affected passwords from a known-clean device, revoke active sessions, and enable MFA.",
      "Browser manipulation": "Block malicious redirects and verify trusted domains before entering credentials.",
      "Data exfiltration": "Disconnect affected systems if needed, preserve logs, and investigate outbound destinations.",
      "Obfuscation": "Do not execute obfuscated content; decode only in a controlled analysis environment.",
      "Shell execution": "Investigate command execution traces and restrict command/scripting privileges.",
      "Remote control": "Block suspicious remote-control endpoints and rotate potentially exposed secrets/tokens.",
      "Persistence": "Inspect startup items, scheduled tasks, services, login items, and browser extensions for unauthorized entries.",
      "File manipulation": "Audit sensitive file paths, recover from trusted backups if needed, and enforce least-privilege access.",
      "Network indicator": "Block and monitor suspicious domains/IPs and review network telemetry for related hosts.",
      "URL indicator": "Do not open suspicious URLs; report/block domains and reset credentials if they were entered.",
    };

    for (const category of categories) {
      addUnique(remediation, remediationByCategory[category]);
    }

    if (
      indicators.some(
        (x) =>
          x.category === "Credential access" ||
          x.category === "Keylogging"
      )
    ) {
      addUnique(
        remediation,
        "If credentials may have been exposed, change them from a known-clean device and revoke active sessions."
      );
    }

    if (
      indicators.some(
        (x) => x.category === "Data exfiltration"
      )
    ) {
      addUnique(
        remediation,
        "Investigate outbound destinations and review network/security logs for unexpected communication."
      );
    }

    if (
      indicators.some(
        (x) => x.category === "Persistence"
      )
    ) {
      addUnique(
        remediation,
        "Inspect startup applications, scheduled tasks, services and other persistence mechanisms."
      );
    }

    addUnique(
      remediation,
      "Use trusted endpoint security software for a full or offline scan if compromise is suspected."
    );
  }

  let summary;

  const categoryPreview = categories.slice(0, 4).join(", ");

  if (verdict === "SAFE") {
    summary =
      "No known suspicious patterns were detected by the IlEAGLE deterministic heuristic scanner.";
  } else if (verdict === "SUSPICIOUS") {
    summary =
      `Suspicious behaviors were detected (${categoryPreview || "rule matches"}). Review indicators and X-Ray details before trusting this content.`;
  } else {
    summary =
      `High-risk correlated behaviors were detected (${categoryPreview || "multiple rule matches"}). Treat this content as potentially malicious and investigate before execution.`;
  }

  return {
    verdict,
    score,
    summary,
    inputType,
    confidence: getConfidence(score, indicators.length),

    indicators,

    xray,

    impact,

    remediation,

    metadata: {
      scannedAt: new Date().toISOString(),
      length: content.length,
      lines: content.split(/\r?\n/).length,
      entropy: calculateEntropy(content),
      truncated: originalLength > MAX_INPUT_LENGTH,
      rulesEvaluated: RULES.length,
      categoriesMatched: categories,
      indicatorsMatched: indicators.length,
    },
  };
}

module.exports = {
  scanContent,
  detectInputType,
  MAX_INPUT_LENGTH,
};