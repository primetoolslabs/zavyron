import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './supabase-config.js';
const status = document.querySelector('#status');
const login = document.querySelector('#login');
const logout = document.querySelector('#logout');
const profile = document.querySelector('#profile');
const guildPanel=document.querySelector('#guild-panel');
const guildStatus=document.querySelector('#guild-status');
const guildList=document.querySelector('#guild-list');
const refresh=document.querySelector('#refresh-guilds');
let providerToken=null;
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
    guildPanel.hidden = !user;
    logout.hidden = !user;
    profile.style.display = user ? 'block' : 'none';
    if (user) {
      const discordIdentity = user.identities?.find(x => x.provider === 'discord');
      const username = user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'Conta conectada';
      profile.textContent = `Conta autenticada: ${username}${discordIdentity ? ' • Discord' : ''}`;
      status.textContent = 'Login Discord concluído. Consulte os servidores autorizados pela API segura.';
    } else {
      status.textContent = error ? 'Sessão indisponível. Entre novamente com Discord.' : 'Faça login com Discord para autenticar sua conta.';
    }
  }
  login.onclick = async () => {
    login.disabled = true;
    status.textContent = 'Redirecionando para o Discord...';
    const { error } = await supabase.auth.signInWithOAuth({provider:'discord',options:{redirectTo:location.origin + location.pathname,scopes:'identify email guilds'}});
    if (error) {status.textContent = `Não foi possível iniciar o login: ${error.message}`;login.disabled=false;}
  };
  refresh.onclick=async()=>{
    guildList.replaceChildren(); guildStatus.textContent='Consultando Discord...'; refresh.disabled=true;
    try {
      const {data:{session}}=await supabase.auth.getSession();
      if(!session) throw Error('Sessão expirada. Entre novamente.');
      const token=providerToken||session.provider_token;
      if(!token) throw Error('Autorize novamente o escopo guilds: saia e entre com Discord.');
      const {data,error}=await supabase.functions.invoke('discord-guilds',{body:{discord_access_token:token}});
      if(error) throw Error(data?.error||error.message);
      if(!Array.isArray(data?.guilds)) throw Error('Resposta inesperada da API.');
      guildStatus.textContent=data.guilds.length+' servidor(es) autorizado(s).';
      for(const g of data.guilds){
        const el=document.createElement('div');el.className='guild-card';
        const name=document.createElement('strong');name.textContent=g.name;
        const id=document.createElement('small');id.textContent='ID: '+g.id;
        const info=document.createElement('small');info.textContent='Administrador validado • Edição real ainda bloqueada';
        el.append(name,id,info);guildList.append(el);
      }
    }catch(e){guildStatus.textContent='Não foi possível consultar os servidores: '+e.message;}
    finally{refresh.disabled=false;}
  };
  logout.onclick = async () => { providerToken=null; guildList.replaceChildren(); await supabase.auth.signOut(); await render(); };
  supabase.auth.onAuthStateChange((_event,session)=>{if(session?.provider_token)providerToken=session.provider_token;setTimeout(render,0);});
  const initial=await supabase.auth.getSession();if(initial.data?.session?.provider_token)providerToken=initial.data.session.provider_token;
  await render();
}
