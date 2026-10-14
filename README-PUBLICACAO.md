# ZAVYRON WEB V5.1 — Supabase Auth

## Publicar no GitHub Pages
Envie SOMENTE os arquivos desta pasta `zavyron-web-v2/` para a raiz do repositório `primetoolslabs/zavyron`, mantendo `index.html` na raiz.

1. Supabase Dashboard > Project Settings > API Keys: copie a **publishable key** (`sb_publishable_...`) ou, se necessário, a chave pública legada `anon`.
2. Substitua `COLE_AQUI_SUA_CHAVE_PUBLICAVEL` em `supabase-config.js` pela chave pública.
3. Supabase Authentication > Sign In / Providers: Discord habilitado com Client ID e Client Secret configurados **somente no Supabase**.
4. Authentication > URL Configuration: Site URL e Redirect URL = `https://primetoolslabs.github.io/zavyron/`.
5. Discord Developer Portal > OAuth2 Redirects: `https://suhqhuubqwhzabvxxzgl.supabase.co/auth/v1/callback`.
6. Publique e teste login/logout em `https://primetoolslabs.github.io/zavyron/`.

## Limitações deliberadas
- Login é real via Supabase Auth, mas o acesso a servidores reais NÃO está habilitado.
- O arquivo `demo.html` mantém a demonstração V5 anterior, separada e identificada como local.
- O backend V5 antigo está incluído apenas como referência; ele usa OAuth próprio e NÃO deve ser conectado simultaneamente ao login Supabase sem adaptação.
- Nenhuma escrita real está implementada; requer backend com verificação atualizada do Discord, permissão ADMINISTRATOR, bot presente e isolamento por guild_id.
- Nunca publique Discord Client Secret, bot token, `service_role`, Supabase secret key ou `.env`.
