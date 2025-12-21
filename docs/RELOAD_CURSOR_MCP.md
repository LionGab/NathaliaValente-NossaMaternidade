# 🔄 Como Recarregar Cursor para Aplicar MCPs

## ✅ Método Rápido (Recomendado)

### 1. Abrir Command Palette
- **Windows/Linux:** `Ctrl + Shift + P`
- **macOS:** `Cmd + Shift + P`

### 2. Digitar comando de reload
Digite: `reload window` ou `Developer: Reload Window`

### 3. Selecionar e executar
- Pressione `Enter` para executar
- A janela do Cursor será recarregada automaticamente

## 🔄 Método Alternativo

Se o método acima não funcionar:

1. **Feche completamente o Cursor**
   - Feche todas as janelas
   - Verifique se não há processos em segundo plano

2. **Abra o Cursor novamente**
   - Os MCPs serão carregados automaticamente na inicialização

## ✅ Verificar se Funcionou

Após recarregar, verifique se os MCPs estão disponíveis:

```powershell
.\scripts\verify-mcps.ps1
```

Ou teste diretamente no Cursor:
- Os MCPs aparecem como ferramentas (começam com `mcp_`)
- Exemplo: `mcp_Context7_resolve-library-id`

## 🎯 Atalho de Teclado (se configurado)

Alguns usuários configuram um atalho personalizado:
- `Ctrl + R` (pode conflitar com outros comandos)
- Configure em: `File > Preferences > Keyboard Shortcuts`
- Busque por: "Reload Window"

## 📋 Checklist Pós-Reload

Após recarregar, verifique:

- [ ] MCPs aparecem nas ferramentas disponíveis
- [ ] Expo MCP está acessível (se autenticado)
- [ ] Context7 funciona (teste com `mcp_Context7_*`)
- [ ] Browser MCP funciona (teste com `mcp_cursor-ide-browser_*`)

## 🐛 Se os MCPs Não Aparecerem

1. **Verifique o arquivo de configuração:**
   ```powershell
   .\scripts\verify-mcps.ps1
   ```

2. **Verifique se o arquivo está correto:**
   - Localização: `%APPDATA%\Cursor\User\settings.json`
   - Deve conter a seção `mcpServers`

3. **Reconfigure se necessário:**
   ```powershell
   .\scripts\configure-mcps-cursor-v2.ps1
   ```

4. **Reinicie completamente:**
   - Feche o Cursor
   - Aguarde alguns segundos
   - Abra novamente

