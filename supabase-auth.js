import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './supabase-config.js';
const status = document.querySelector('#status');
const login = document.querySelector('#login');
const logout = document.querySelector('#logout');
const profile = document.querySelector('#profile');
const configured = SUPABASE_PUBLISHABLE_KEY && !SUPABASE_PUBLISHABLE_KEY.startsWith('COLE_AQUI');
if (!configured) {
  status.textContent = 'Configuração pendente: adicione a publishable key no arquivo supabase-config.js. Não utilize secret keys.';
} else {
  const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { flowType: 'pkce', detectSessionInUrl: true, autoRefreshToken: true, persistSession: true }
  });
  async function render() {
    const { data, error } = await supabase.auth.getUser();
    const user = error ? null : data.user;
    login.hidden = !!user;
    logout.hidden = !user;
    profile.style.display = user ? 'block' : 'none';
    if (user) {
      const discordIdentity = user.identities?.find(x => x.provider === 'discord');
      const username = user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'Conta conectada';
      profile.textContent = `Conta autenticada: ${username}${discordIdentity ? ' • Discord' : ''}`;
      status.textContent = 'Login concluído. A listagem de servidores reais ainda requer uma API segura que valide permissão Administrador e presença do bot.';
    } else {
      status.textContent = error ? 'Sessão indisponível. Entre novamente com Discord.' : 'Faça login com Discord para autenticar sua conta.';
    }
  }
  login.onclick = async () => {
    login.disabled = true;
    status.textContent = 'Redirecionando para o Discord...';
    const { error } = await supabase.auth.signInWithOAuth({provider:'discord',options:{redirectTo:'https://primetoolslabs.github.io/zavyron/',scopes:'identify email'}});
    if (error) {status.textContent = `Não foi possível iniciar o login: ${error.message}`;login.disabled=false;}
  };
  logout.onclick = async () => { await supabase.auth.signOut(); await render(); };
  supabase.auth.onAuthStateChange(() => {setTimeout(render,0);});
  await render();
}
