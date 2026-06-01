"use client";

import { useState, useRef, useEffect } from "react";

const ADMIN_PASSWORD = "BrothersWin";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Recorder state
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [textMessage, setTextMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<any>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [audioUrl]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new (window as any).MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e: any) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        // Stop all tracks
        stream.getTracks().forEach((track: any) => track.stop());
      };

      recorder.start(250);
      setIsRecording(true);
      setRecordingTime(0);
      setAudioBlob(null);
      setAudioUrl(null);
      setSuccess(false);

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access error:", err);
      setError("Could not access microphone. Please allow microphone permissions.");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  async function handleSubmit() {
    if (!audioBlob && !textMessage.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      if (audioBlob) {
        formData.append("audio", audioBlob, "testimonial.webm");
      }
      if (textMessage.trim()) {
        formData.append("text", textMessage.trim());
      }

      const res = await fetch("/api/testimonial", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      setSuccess(true);
      setAudioBlob(null);
      setAudioUrl(null);
      setTextMessage("");
      setRecordingTime(0);
    } catch (err: any) {
      setError(err.message || "Failed to submit testimonial");
    } finally {
      setSubmitting(false);
    }
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // ── LOGIN SCREEN ───────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div style={styles.page}>
        <div style={styles.loginCard}>
          <div style={styles.lockIcon}>🔒</div>
          <h1 style={styles.loginTitle}>Admin Access</h1>
          <p style={styles.loginSubtitle}>Hood Hymns Publishing</p>
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={styles.input}
              autoFocus
            />
            <button type="submit" style={styles.btnPrimary}>
              Unlock
            </button>
          </form>
          {error && <p style={styles.error}>{error}</p>}
        </div>
      </div>
    );
  }

  // ── RECORDER SCREEN ────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.recorderCard}>
        {/* Header */}
        <p style={styles.tagline}>Hood Hymns Publishing</p>
        <h1 style={styles.title}>Testimonial of the Day</h1>
        <p style={styles.subtitle}>Record your message for the community</p>

        {/* Success state */}
        {success && (
          <div style={styles.successBanner}>
            <span style={{ fontSize: "1.5rem" }}>✅</span>
            <div>
              <p style={{ fontWeight: 700, marginBottom: 4 }}>Testimonial Published!</p>
              <p style={{ fontSize: "0.85rem", color: "var(--color-brand-muted)" }}>
                Your message is now live on the homepage.
              </p>
            </div>
          </div>
        )}

        {/* Record / Stop buttons */}
        <div style={styles.recorderControls}>
          {!isRecording ? (
            <button onClick={startRecording} style={styles.recordBtn} title="Start Recording">
              <span style={styles.recordDot} />
              <span>Record</span>
            </button>
          ) : (
            <button onClick={stopRecording} style={styles.stopBtn} title="Stop Recording">
              <span style={styles.stopSquare} />
              <span>Stop</span>
            </button>
          )}

          {isRecording && (
            <div style={styles.timer}>
              <span style={styles.liveDot} />
              <span>{formatTime(recordingTime)}</span>
            </div>
          )}
        </div>

        {/* Audio preview */}
        {audioUrl && (
          <div style={styles.previewSection}>
            <p style={styles.previewLabel}>Preview Recording</p>
            <audio
              ref={audioPreviewRef}
              src={audioUrl}
              controls
              style={styles.audioPlayer}
            />
            <button
              onClick={() => {
                setAudioBlob(null);
                setAudioUrl(null);
                setRecordingTime(0);
              }}
              style={styles.btnGhost}
            >
              Discard &amp; Re-record
            </button>
          </div>
        )}

        {/* Text area */}
        <div style={styles.textSection}>
          <label style={styles.label}>Written Message (Optional)</label>
          <textarea
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            placeholder="Add a written message to accompany the audio, or submit text-only..."
            style={styles.textarea}
            rows={4}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting || (!audioBlob && !textMessage.trim())}
          style={{
            ...styles.btnPrimary,
            width: "100%",
            opacity: submitting || (!audioBlob && !textMessage.trim()) ? 0.5 : 1,
            cursor: submitting || (!audioBlob && !textMessage.trim()) ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Processing with Gemini AI…" : "Publish Testimonial"}
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

// ── STYLES ─────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#08050F",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },
  loginCard: {
    background: "linear-gradient(145deg, #140E24, #0E0A1A)",
    border: "1px solid #261840",
    borderRadius: "16px",
    padding: "48px 40px",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center" as const,
  },
  lockIcon: {
    fontSize: "2.5rem",
    marginBottom: "16px",
  },
  loginTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#F0EDE8",
    marginBottom: "8px",
  },
  loginSubtitle: {
    fontSize: "0.8rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "#B87333",
    marginBottom: "32px",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  input: {
    background: "#08050F",
    border: "1px solid #261840",
    borderRadius: "8px",
    padding: "14px 16px",
    color: "#F0EDE8",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s",
  },
  recorderCard: {
    background: "linear-gradient(145deg, #140E24, #0E0A1A)",
    border: "1px solid #261840",
    borderRadius: "16px",
    padding: "48px 40px",
    maxWidth: "560px",
    width: "100%",
  },
  tagline: {
    fontSize: "0.7rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "#B87333",
    marginBottom: "8px",
    textAlign: "center" as const,
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#F0EDE8",
    textAlign: "center" as const,
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#9088A8",
    textAlign: "center" as const,
    marginBottom: "36px",
  },
  recorderControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "24px",
  },
  recordBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(220, 38, 38, 0.15)",
    border: "2px solid #dc2626",
    borderRadius: "40px",
    padding: "14px 28px",
    color: "#F0EDE8",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  recordDot: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    background: "#dc2626",
    display: "inline-block",
    animation: "pulseRecord 1.5s ease-in-out infinite",
  },
  stopBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(220, 38, 38, 0.25)",
    border: "2px solid #dc2626",
    borderRadius: "40px",
    padding: "14px 28px",
    color: "#F0EDE8",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 0 20px rgba(220, 38, 38, 0.3)",
  },
  stopSquare: {
    width: "14px",
    height: "14px",
    borderRadius: "3px",
    background: "#dc2626",
    display: "inline-block",
  },
  timer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "1.1rem",
    fontVariantNumeric: "tabular-nums",
    color: "#dc2626",
    fontWeight: 600,
  },
  liveDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#dc2626",
    display: "inline-block",
    animation: "pulseRecord 1s ease-in-out infinite",
  },
  previewSection: {
    background: "rgba(8, 5, 15, 0.6)",
    border: "1px solid #261840",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "24px",
    textAlign: "center" as const,
  },
  previewLabel: {
    fontSize: "0.75rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "#9088A8",
    marginBottom: "12px",
  },
  audioPlayer: {
    width: "100%",
    marginBottom: "12px",
    borderRadius: "8px",
  },
  textSection: {
    marginBottom: "24px",
  },
  label: {
    display: "block",
    fontSize: "0.8rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "#9088A8",
    marginBottom: "8px",
    fontWeight: 600,
  },
  textarea: {
    width: "100%",
    background: "#08050F",
    border: "1px solid #261840",
    borderRadius: "8px",
    padding: "14px 16px",
    color: "#F0EDE8",
    fontSize: "0.95rem",
    lineHeight: 1.6,
    resize: "vertical" as const,
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
  },
  btnPrimary: {
    background: "linear-gradient(135deg, #B87333, #D4944A)",
    border: "none",
    borderRadius: "8px",
    padding: "16px 32px",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  btnGhost: {
    background: "transparent",
    border: "1px solid #261840",
    borderRadius: "6px",
    padding: "8px 16px",
    color: "#9088A8",
    fontSize: "0.8rem",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  error: {
    color: "#f87171",
    fontSize: "0.85rem",
    marginTop: "12px",
    textAlign: "center" as const,
  },
  successBanner: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background: "rgba(34, 197, 94, 0.08)",
    border: "1px solid rgba(34, 197, 94, 0.3)",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "28px",
    color: "#F0EDE8",
  },
};
