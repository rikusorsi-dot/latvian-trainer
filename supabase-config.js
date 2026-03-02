// ══════════════════════════════════════════════════════
// Конфигурация Supabase
// ══════════════════════════════════════════════════════
// После создания проекта на supabase.com:
// 1. Откройте Settings → API
// 2. Скопируйте "Project URL" → вставьте в SUPABASE_URL
// 3. Скопируйте "anon public" ключ → вставьте в SUPABASE_ANON_KEY

const SUPABASE_URL = 'https://jzguubjpvgzxcawmkxop.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_P4UaODx-ojzuuNKrd-zi9Q_yrJzey5X';

// Пароль администратора (для входа в admin.html)
// Измените на свой личный пароль!
const ADMIN_PASSWORD = '7458admin';

// ══════════════════════════════════════════════════════
// Resend — отправка писем ученикам
// 1. Зарегистрируйтесь на resend.com (бесплатно)
// 2. Создайте API Key → вставьте сюда
// Пока не настроено — коды показываются на экране вручную
// ══════════════════════════════════════════════════════
const RESEND_API_KEY = ''; // например: re_2riC6vbi_EQYmzxHYzJLVMdgZstcB8Lzq
const FROM_EMAIL = 'onboarding@resend.dev'; // сменить когда будет свой домен
const FROM_NAME = 'Латышский тренажёр';
