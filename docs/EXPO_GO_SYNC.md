# Como Conectar Expo Go no Mac ao Servidor Expo no Windows

> 📱 **Versão Mobile:** Veja `EXPO_GO_SYNC_MOBILE.md` para guia rápido

## ⚠️ Situação Especial: Windows via Cabo + Mac via WiFi

**Seu caso:** Windows conectado via cabo Ethernet + Mac via WiFi

**Problema:** Mesmo estando na mesma rede física, roteadores podem isolar interfaces diferentes (Ethernet vs WiFi), impedindo comunicação direta.

**Solução:** Use **Tunnel Mode** (Método 1 abaixo) - funciona sempre, independente do tipo de conexão.

---

## 🎯 Método 1: Tunnel Mode (Recomendado para Windows Cabo + Mac WiFi)

### No Windows:

```bash
# Parar o servidor atual (Ctrl+C se estiver rodando)
# Reiniciar com tunnel
npx expo start --tunnel
```

Isso cria um túnel público via Expo que funciona mesmo com Windows via cabo e Mac via WiFi.

**No Mac (Expo Go aberto):**

- Escaneie o QR code que aparece no terminal
- A URL será algo como: `exp://u.expo.dev/...` (tunnel público)

⚠️ **Nota:** Tunnel mode pode ser um pouco mais lento, mas funciona sempre, independente do tipo de conexão.

---

## 🔄 Método 2: Tentar LAN Direto (Pode não funcionar)

Se quiser tentar conexão direta primeiro (pode falhar se roteador isolar interfaces):

**Seu IP:** `192.168.2.4` (Adaptador Ethernet)

1. **No Windows:**

   ```bash
   npx expo start --lan
   ```

2. **No Mac:**
   - Tente escanear o QR code
   - Ou digite manualmente: `exp://192.168.2.4:8083`

**Se não funcionar:** Use tunnel mode (Método 1)

---

## 📱 Método 3: Manual URL no Expo Go

Se você vê a URL no terminal do Windows:

```
exp://192.168.2.4:8083
```

**No Mac (Expo Go):**

1. Abra o Expo Go
2. Toque em "Enter URL manually" (ou "Digite URL manualmente")
3. Cole a URL: `exp://192.168.2.4:8083`
4. Toque em "Connect" (ou "Conectar")

---

## 🔧 Solução de Problemas

### Problema: "Unable to connect to server"

**Solução 1:** Verificar firewall do Windows

```powershell
# No PowerShell como Administrador
New-NetFirewallRule -DisplayName "Expo Dev Server" -Direction Inbound -LocalPort 8083 -Protocol TCP -Action Allow
```

**Solução 2:** Usar tunnel mode

```bash
npx expo start --tunnel
```

**Solução 3:** Windows via cabo + Mac via WiFi

- Se Windows está via cabo e Mac via WiFi, use **tunnel mode**
- Mesmo na mesma rede física, roteadores podem isolar interfaces diferentes
- Tunnel mode resolve isso: `npx expo start --tunnel`

### Problema: QR code não aparece

**Solução:**

```bash
# Ver URL manualmente
npx expo start
# Procure por "Metro waiting on" ou "exp://"
```

### Problema: Conexão muito lenta

**Solução:** Use LAN em vez de tunnel

```bash
# No Windows
npx expo start --lan
```

---

## ✅ Checklist Rápido

- [ ] Windows e Mac na mesma rede (ou usando tunnel mode)
- [ ] Expo Go instalado no Mac
- [ ] Servidor Expo rodando no Windows (`npx expo start`)
- [ ] Firewall do Windows permite conexão na porta 8083
- [ ] QR code visível no terminal do Windows
- [ ] Expo Go escaneou o QR code OU URL digitada manualmente

---

## 🚀 Comandos Úteis

```bash
# Windows - Iniciar com tunnel (funciona sempre)
npx expo start --tunnel

# Windows - Iniciar com LAN (mais rápido, mesma rede)
npx expo start --lan

# Windows - Ver IP local
ipconfig

# Mac - Verificar conexão
ping 192.168.2.4  # Substitua pelo IP do Windows
```

---

## 💡 Dica Pro

Se você vai trabalhar frequentemente entre Windows e Mac:

1. **Use Git** para sincronizar código
2. **Use tunnel mode** para desenvolvimento rápido
3. **Considere rodar Expo no Mac** para melhor performance iOS

Para rodar no Mac:

```bash
# No Mac
git clone <seu-repo>
cd NossaMaternidade
bun install
bun run start
```
