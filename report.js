// ══════════════════════════════════════════════════════
// Ежедневный отчёт — запускается через GitHub Actions
// ══════════════════════════════════════════════════════

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = (process.env.SUPABASE_URL || '').trim();
const SUPABASE_ANON_KEY = (process.env.SUPABASE_ANON_KEY || '').trim();
const RESEND_API_KEY = (process.env.RESEND_API_KEY || '').trim();
const REPORT_EMAIL = (process.env.REPORT_EMAIL || '').trim();

const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getUsers() {
    const { data, error } = await db.from('users').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(`Ошибка базы данных: ${JSON.stringify(error)}`);
    return data;
}

function typeLabel(type) {
    const labels = { subscriber: 'подписчик', sponsor1: 'спонсор 1', sponsor2: 'спонсор 2', sponsor3: 'спонсор 3' };
    return labels[type] || type;
}

function daysSince(date) {
    if (!date) return 999;
    return Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));
}

async function main() {
    const users = await getUsers();
    const today = new Date().toISOString().split('T')[0];

    const newToday = users.filter(u => u.created_at && u.created_at.startsWith(today));
    const activeToday = users.filter(u => u.last_access && u.last_access.startsWith(today));
    const inactive7_14 = users.filter(u => { const d = daysSince(u.last_access); return d >= 7 && d < 14; });
    const inactive14plus = users.filter(u => daysSince(u.last_access) >= 14);
    const sponsors = users.filter(u => u.type && u.type.startsWith('sponsor'));

    const date = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

    let html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
    <h2 style="color:#1a3a6e;border-bottom:2px solid #9b2335;padding-bottom:10px">
        🇱🇻 Отчёт тренажёра за ${date}
    </h2>`;

    // Новые сегодня
    if (newToday.length > 0) {
        html += `<h3 style="color:#27ae60">🆕 Новые сегодня: ${newToday.length}</h3><ul>`;
        for (const u of newToday) {
            const expires = u.access_expires
                ? new Date(u.access_expires).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
                : '—';
            html += `<li><strong>${u.name}</strong> — ${typeLabel(u.type)}`;
            if (u.type === 'subscriber') html += ` (до ${expires})`;
            if (u.email) html += ` — ${u.email}`;
            html += `</li>`;
        }
        html += '</ul>';
    } else {
        html += `<p>🆕 Новых учеников сегодня нет</p>`;
    }

    // Активные сегодня
    html += `<h3 style="color:#2980b9">✅ Занимались сегодня: ${activeToday.length} чел.</h3>`;
    if (activeToday.length > 0) {
        html += '<ul>' + activeToday.map(u => `<li>${u.name} (${typeLabel(u.type)})</li>`).join('') + '</ul>';
    }

    // Предупреждения
    if (inactive7_14.length > 0) {
        html += `<h3 style="color:#e67e22">⚠️ Не заходили 7–14 дней: ${inactive7_14.length}</h3><ul>`;
        for (const u of inactive7_14) {
            html += `<li>${u.name} — ${daysSince(u.last_access)} дн. назад</li>`;
        }
        html += '</ul>';
    }

    if (inactive14plus.length > 0) {
        html += `<h3 style="color:#e74c3c">🔴 Не заходили 14+ дней: ${inactive14plus.length}</h3><ul>`;
        for (const u of inactive14plus) {
            html += `<li>${u.name} — ${daysSince(u.last_access)} дн. назад</li>`;
        }
        html += '</ul>';
    }

    // Итого
    html += `
    <hr style="border:1px solid #eee;margin:20px 0">
    <table style="width:100%;border-collapse:collapse">
        <tr>
            <td style="padding:8px;background:#f8f9fa;border-radius:6px;text-align:center">
                <div style="font-size:28px;font-weight:bold;color:#1a3a6e">${users.length}</div>
                <div style="color:#666">всего учеников</div>
            </td>
            <td style="width:10px"></td>
            <td style="padding:8px;background:#f8f9fa;border-radius:6px;text-align:center">
                <div style="font-size:28px;font-weight:bold;color:#27ae60">${activeToday.length}</div>
                <div style="color:#666">активны сегодня</div>
            </td>
            <td style="width:10px"></td>
            <td style="padding:8px;background:#f8f9fa;border-radius:6px;text-align:center">
                <div style="font-size:28px;font-weight:bold;color:#9b2335">${sponsors.length}</div>
                <div style="color:#666">спонсоров</div>
            </td>
        </tr>
    </table>
    </div>`;

    // Отправляем письмо
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
            from: 'Латышский тренажёр <onboarding@resend.dev>',
            to: [REPORT_EMAIL],
            subject: `📊 Отчёт тренажёра за ${date}`,
            html
        })
    });

    const result = await res.json();
    console.log('Отчёт отправлен:', JSON.stringify(result));
}

main().catch(err => {
    console.error('Ошибка:', err);
    process.exit(1);
});
