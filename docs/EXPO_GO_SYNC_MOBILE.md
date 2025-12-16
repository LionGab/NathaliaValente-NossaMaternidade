# 📱 Conectar Expo Go - Guia Rápido Mobile

## ⚡ Solução Rápida (Windows Cabo + Mac WiFi)

### Windows:

```bash
npx expo start --tunnel
```

### Mac (Expo Go):

- Escaneie o QR code
- Ou digite: URL que aparece no terminal

---

## 🎯 Passo a Passo

### 1️⃣ No Windows

- Pare servidor: `Ctrl+C`
- Inicie: `npx expo start --tunnel`
- Aguarde QR code aparecer

### 2️⃣ No Mac

- Abra Expo Go
- Escaneie QR code
- Pronto! ✅

---

## ❌ Se Não Funcionar

### Tentar LAN:

```bash
npx expo start --lan
```

Depois tente: `exp://192.168.2.4:8083`

### Firewall:

```powershell
New-NetFirewallRule -DisplayName "Expo" -Direction Inbound -LocalPort 8083 -Protocol TCP -Action Allow
```

---

## 💡 Dicas

- **Tunnel mode** = funciona sempre
- **LAN mode** = mais rápido (mesma rede)
- **Porta varia:** 8081, 8082, 8083...

---

## 🔗 URLs Comuns

- Tunnel: `exp://u.expo.dev/...`
- LAN: `exp://192.168.2.4:8083`

---

**IP do Windows:** `192.168.2.4`
