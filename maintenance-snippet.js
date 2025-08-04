// メンテナンス終了予定時刻
const MAINTENANCE_END_TIME_JST = '2025-08-04T15:50:00';

const AUTO_REFRESH_SECONDS = 300; // 5分


export default {
  async fetch(request) {
    const maintenancePage = generateMaintenanceHTML();
    return new Response(maintenancePage, {
      status: 503, // Service Unavailable
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Retry-After': '3600' // 1時間後に再試行
      }
    });
  },
};

function generateMaintenanceHTML() {
  const maintenanceEndTimeISO = `${MAINTENANCE_END_TIME_JST}+09:00`;
  const autoRefreshTag = AUTO_REFRESH_SECONDS > 0
    ? `<meta http-equiv="refresh" content="${AUTO_REFRESH_SECONDS}">`
    : '';

  return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>メンテナンス中 | misskey.vip</title>
    ${autoRefreshTag}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --color-primary: #c5a7cf;
            --color-secondary: #e3d5e2;
            --color-accent: #dfa9c2;
            --color-tertiary: #aca8d0;
            --text-color: #ffffff;
            --shadow-color: rgba(0, 0, 0, 0.15);
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
            color: var(--text-color);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            text-align: center;
            padding: 2rem;
            overflow: hidden;
        }
        .container {
            max-width: 640px;
            width: 100%;
            background: rgba(255, 255, 255, 0.25);
            padding: 3rem;
            border-radius: 24px;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            box-shadow: 0 15px 35px var(--shadow-color);
            animation: fadeIn 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            opacity: 0;
            transform: translateY(20px);
        }
        @keyframes fadeIn {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .service-name {
            font-size: 1.2rem;
            font-weight: 500;
            color: var(--text-color);
            opacity: 0.8;
            letter-spacing: 2px;
            margin-bottom: 0.5rem;
            text-shadow: 0 1px 2px var(--shadow-color);
        }
        h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            text-shadow: 0 3px 6px var(--shadow-color);
            background: linear-gradient(45deg, var(--color-accent), var(--color-tertiary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .description {
            font-size: 1rem;
            font-weight: 300;
            line-height: 1.7;
            margin-bottom: 2.5rem;
            opacity: 0.95;
            text-shadow: 0 1px 3px var(--shadow-color);
        }
        #countdown-container {
            animation: slideUp 0.8s 0.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            opacity: 0;
        }
        @keyframes slideUp {
             to {
                opacity: 1;
            }
        }
        .countdown-title {
            font-size: 0.9rem;
            font-weight: 400;
            letter-spacing: 1px;
            margin-bottom: 1rem;
            opacity: 0.8;
        }
        #countdown {
            display: flex;
            justify-content: center;
            gap: 1rem;
        }
        .timer-box {
            background: rgba(255, 255, 255, 0.2);
            padding: 1rem;
            border-radius: 12px;
            min-width: 80px;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .timer-box:hover {
            transform: translateY(-5px);
            background: rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 20px var(--shadow-color);
        }
        .timer-box span {
            display: block;
            font-size: 2rem;
            font-weight: 700;
            line-height: 1;
        }
        .timer-box .label {
            font-size: 0.7rem;
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            opacity: 0.8;
            margin-top: 0.5rem;
        }
        .footer {
            margin-top: 3rem;
            font-size: 0.8rem;
            font-weight: 400;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        }
        .footer:hover {
            opacity: 1;
        }
        @media (max-width: 600px) {
            .container { padding: 2rem 1.5rem; }
            h1 { font-size: 2rem; }
            .description { font-size: 0.9rem; }
            #countdown { gap: 0.5rem; }
            .timer-box { min-width: 65px; padding: 0.8rem; }
            .timer-box span { font-size: 1.5rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="service-name">misskey.vip</div>
        <h1>現在メンテナンス中です</h1>
        <p class="description">
            サービス向上のための更新作業を行っています。
            ご不便をおかけしますが、完了まで今しばらくお待ちください。
        </p>
        
        <div id="countdown-container">
            <div class="countdown-title">サービス再開予定</div>
            <div id="countdown">
                <div class="timer-box"><span id="days">00</span><span class="label">Days</span></div>
                <div class="timer-box"><span id="hours">00</span><span class="label">Hours</span></div>
                <div class="timer-box"><span id="minutes">00</span><span class="label">Mins</span></div>
                <div class="timer-box"><span id="seconds">00</span><span class="label">Secs</span></div>
            </div>
        </div>
        
        <div class="footer">
            &copy; ${new Date().getFullYear()} misskey.vip
        </div>
    </div>

    <script>
        (function() {
            const countDownDate = new Date('${maintenanceEndTimeISO}').getTime();
            const container = document.getElementById("countdown-container");

            if (isNaN(countDownDate)) {
                container.innerHTML = "<p>メンテナンス終了時刻が設定されていません。</p>";
                return;
            }

            const countdownFunction = setInterval(function() {
                const now = new Date().getTime();
                const distance = countDownDate - now;

                if (distance < 0) {
                    clearInterval(countdownFunction);
                    container.innerHTML = "<p>サービスを再開しました。ページを再読み込みしてください。</p>";
                    return;
                }

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                document.getElementById("days").innerText = String(days).padStart(2, '0');
                document.getElementById("hours").innerText = String(hours).padStart(2, '0');
                document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
                document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
            }, 1000);
        })();
    </script>
</body>
</html>
  `;
}