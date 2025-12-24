#!/bin/bash

# =============================================================================
# Nossa Maternidade - Setup Completo de Secrets
# =============================================================================
# Este script configura todos os secrets necessários para:
# 1. EAS Build (variáveis de ambiente do app)
# 2. Supabase Edge Functions (API keys de AI)
# 3. Variáveis locais (.env.local)
# =============================================================================

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Funções utilitárias
print_header() {
    echo ""
    echo -e "${BOLD}${BLUE}════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${BLUE}  $1${NC}"
    echo -e "${BOLD}${BLUE}════════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_step() {
    echo -e "${CYAN}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar dependências
check_dependencies() {
    print_header "Verificando Dependências"

    local missing=0

    # Verificar EAS CLI
    if command -v eas &> /dev/null || command -v npx &> /dev/null; then
        print_success "EAS CLI disponível"
    else
        print_error "EAS CLI não encontrado. Instale com: npm install -g eas-cli"
        missing=1
    fi

    # Verificar Supabase CLI
    if command -v supabase &> /dev/null; then
        print_success "Supabase CLI disponível"
    else
        print_warning "Supabase CLI não encontrado. Para configurar Edge Functions secrets, instale: npm install -g supabase"
    fi

    # Verificar login EAS
    if npx eas-cli whoami &> /dev/null 2>&1; then
        local user=$(npx eas-cli whoami 2>/dev/null)
        print_success "Logado no EAS como: $user"
    else
        print_warning "Não está logado no EAS. Execute: npx eas-cli login"
    fi

    echo ""
    return $missing
}

# Menu principal
show_menu() {
    print_header "Nossa Maternidade - Setup de Secrets"

    echo "Escolha uma opção:"
    echo ""
    echo "  1) Configurar EAS Secrets (para builds)"
    echo "  2) Configurar Supabase Edge Functions Secrets (AI API keys)"
    echo "  3) Gerar arquivo .env.local (desenvolvimento local)"
    echo "  4) Verificar status de todos os secrets"
    echo "  5) Configuração Completa (1 + 2 + 3)"
    echo "  6) Sair"
    echo ""
    read -p "Opção: " choice

    case $choice in
        1) setup_eas_secrets ;;
        2) setup_supabase_secrets ;;
        3) generate_env_local ;;
        4) check_secrets_status ;;
        5) full_setup ;;
        6) exit 0 ;;
        *) print_error "Opção inválida"; show_menu ;;
    esac
}

# Configurar EAS Secrets
setup_eas_secrets() {
    print_header "Configurando EAS Secrets"

    # Verificar login
    if ! npx eas-cli whoami &> /dev/null 2>&1; then
        print_error "Você precisa estar logado no EAS primeiro!"
        echo "Execute: npx eas-cli login"
        return 1
    fi

    echo "Vou ajudá-lo a configurar os secrets do EAS."
    echo "Para cada secret, você pode digitar o valor ou pressionar Enter para pular."
    echo ""

    # Supabase
    print_step "Configurando Supabase..."
    read -p "EXPO_PUBLIC_SUPABASE_URL (ex: https://xxx.supabase.co): " supabase_url
    if [ -n "$supabase_url" ]; then
        npx eas-cli secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "$supabase_url" --force 2>/dev/null || true
        print_success "EXPO_PUBLIC_SUPABASE_URL configurado"
    fi

    read -p "EXPO_PUBLIC_SUPABASE_ANON_KEY: " supabase_anon
    if [ -n "$supabase_anon" ]; then
        npx eas-cli secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "$supabase_anon" --force 2>/dev/null || true
        print_success "EXPO_PUBLIC_SUPABASE_ANON_KEY configurado"
    fi

    if [ -n "$supabase_url" ]; then
        functions_url="${supabase_url}/functions/v1"
        npx eas-cli secret:create --scope project --name EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL --value "$functions_url" --force 2>/dev/null || true
        print_success "EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL configurado automaticamente"
    fi

    # RevenueCat
    print_step "Configurando RevenueCat (Premium/IAP)..."
    read -p "EXPO_PUBLIC_REVENUECAT_IOS_KEY (ou Enter para pular): " rc_ios
    if [ -n "$rc_ios" ]; then
        npx eas-cli secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "$rc_ios" --force 2>/dev/null || true
        print_success "EXPO_PUBLIC_REVENUECAT_IOS_KEY configurado"
    fi

    read -p "EXPO_PUBLIC_REVENUECAT_ANDROID_KEY (ou Enter para pular): " rc_android
    if [ -n "$rc_android" ]; then
        npx eas-cli secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value "$rc_android" --force 2>/dev/null || true
        print_success "EXPO_PUBLIC_REVENUECAT_ANDROID_KEY configurado"
    fi

    # Sentry
    print_step "Configurando Sentry (Error Tracking)..."
    read -p "EXPO_PUBLIC_SENTRY_DSN (ou Enter para pular): " sentry_dsn
    if [ -n "$sentry_dsn" ]; then
        npx eas-cli secret:create --scope project --name EXPO_PUBLIC_SENTRY_DSN --value "$sentry_dsn" --force 2>/dev/null || true
        print_success "EXPO_PUBLIC_SENTRY_DSN configurado"
    fi

    # Imgur
    print_step "Configurando Imgur (Upload de Imagens)..."
    read -p "EXPO_PUBLIC_IMGUR_CLIENT_ID (ou Enter para pular): " imgur_id
    if [ -n "$imgur_id" ]; then
        npx eas-cli secret:create --scope project --name EXPO_PUBLIC_IMGUR_CLIENT_ID --value "$imgur_id" --force 2>/dev/null || true
        print_success "EXPO_PUBLIC_IMGUR_CLIENT_ID configurado"
    fi

    # Feature Flags
    print_step "Configurando Feature Flags..."
    npx eas-cli secret:create --scope project --name EXPO_PUBLIC_ENABLE_AI_FEATURES --value "true" --force 2>/dev/null || true
    npx eas-cli secret:create --scope project --name EXPO_PUBLIC_ENABLE_ANALYTICS --value "true" --force 2>/dev/null || true
    print_success "Feature flags configurados"

    print_success "EAS Secrets configurados com sucesso!"
    echo ""
    echo "Para verificar: npx eas-cli secret:list"
}

# Configurar Supabase Edge Functions Secrets
setup_supabase_secrets() {
    print_header "Configurando Supabase Edge Functions Secrets"

    if ! command -v supabase &> /dev/null; then
        print_error "Supabase CLI não encontrado!"
        echo "Instale com: npm install -g supabase"
        echo ""
        echo "Alternativamente, configure manualmente em:"
        echo "Supabase Dashboard → Project Settings → Edge Functions → Secrets"
        return 1
    fi

    # Verificar login
    if ! supabase projects list &> /dev/null 2>&1; then
        print_warning "Você pode precisar fazer login no Supabase"
        echo "Execute: supabase login"
    fi

    echo "Vou ajudá-lo a configurar os secrets das Edge Functions."
    echo "Estes secrets são APENAS para o backend (nunca expostos ao cliente)."
    echo ""

    # Gemini (Primary AI)
    print_step "Configurando Gemini API (Primary AI)..."
    read -p "GEMINI_API_KEY (obtenha em https://makersuite.google.com/): " gemini_key
    if [ -n "$gemini_key" ]; then
        supabase secrets set GEMINI_API_KEY="$gemini_key" 2>/dev/null || print_warning "Falha ao configurar. Configure manualmente no dashboard."
        print_success "GEMINI_API_KEY configurado"
    fi

    # OpenAI (Fallback + Transcription)
    print_step "Configurando OpenAI API (Fallback + Transcription)..."
    read -p "OPENAI_API_KEY (obtenha em https://platform.openai.com/): " openai_key
    if [ -n "$openai_key" ]; then
        supabase secrets set OPENAI_API_KEY="$openai_key" 2>/dev/null || print_warning "Falha ao configurar. Configure manualmente no dashboard."
        print_success "OPENAI_API_KEY configurado"
    fi

    # Anthropic (Vision + Crisis Detection)
    print_step "Configurando Anthropic API (Vision + Crisis Detection)..."
    read -p "ANTHROPIC_API_KEY (obtenha em https://console.anthropic.com/): " anthropic_key
    if [ -n "$anthropic_key" ]; then
        supabase secrets set ANTHROPIC_API_KEY="$anthropic_key" 2>/dev/null || print_warning "Falha ao configurar. Configure manualmente no dashboard."
        print_success "ANTHROPIC_API_KEY configurado"
    fi

    # ElevenLabs (TTS)
    print_step "Configurando ElevenLabs API (Text-to-Speech)..."
    read -p "ELEVENLABS_API_KEY (opcional, Enter para pular): " elevenlabs_key
    if [ -n "$elevenlabs_key" ]; then
        supabase secrets set ELEVENLABS_API_KEY="$elevenlabs_key" 2>/dev/null || print_warning "Falha ao configurar. Configure manualmente no dashboard."
        print_success "ELEVENLABS_API_KEY configurado"
    fi

    # Upstash Redis (Rate Limiting)
    print_step "Configurando Upstash Redis (Rate Limiting)..."
    read -p "UPSTASH_REDIS_REST_URL (opcional, Enter para pular): " upstash_url
    if [ -n "$upstash_url" ]; then
        supabase secrets set UPSTASH_REDIS_REST_URL="$upstash_url" 2>/dev/null || print_warning "Falha ao configurar."
        read -p "UPSTASH_REDIS_REST_TOKEN: " upstash_token
        if [ -n "$upstash_token" ]; then
            supabase secrets set UPSTASH_REDIS_REST_TOKEN="$upstash_token" 2>/dev/null || print_warning "Falha ao configurar."
        fi
        print_success "Upstash Redis configurado"
    fi

    print_success "Supabase Secrets configurados!"
    echo ""
    echo "Para verificar: supabase secrets list"
}

# Gerar arquivo .env.local
generate_env_local() {
    print_header "Gerando arquivo .env.local"

    local env_file=".env.local"

    if [ -f "$env_file" ]; then
        read -p "O arquivo .env.local já existe. Sobrescrever? (y/N): " overwrite
        if [ "$overwrite" != "y" ] && [ "$overwrite" != "Y" ]; then
            print_info "Operação cancelada"
            return 0
        fi
    fi

    echo "Vou criar o arquivo .env.local com suas configurações."
    echo ""

    # Supabase
    read -p "EXPO_PUBLIC_SUPABASE_URL: " supabase_url
    read -p "EXPO_PUBLIC_SUPABASE_ANON_KEY: " supabase_anon

    # RevenueCat (opcional)
    read -p "EXPO_PUBLIC_REVENUECAT_IOS_KEY (opcional): " rc_ios
    read -p "EXPO_PUBLIC_REVENUECAT_ANDROID_KEY (opcional): " rc_android

    # Outros (opcional)
    read -p "EXPO_PUBLIC_IMGUR_CLIENT_ID (opcional): " imgur_id
    read -p "EXPO_PUBLIC_SENTRY_DSN (opcional): " sentry_dsn

    # Criar arquivo
    cat > "$env_file" << EOF
# Nossa Maternidade - Variáveis de Ambiente Local
# Gerado em: $(date)
# ⚠️ NUNCA commite este arquivo!

# Supabase
EXPO_PUBLIC_SUPABASE_URL=${supabase_url}
EXPO_PUBLIC_SUPABASE_ANON_KEY=${supabase_anon}
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=${supabase_url}/functions/v1

# RevenueCat (Premium/IAP)
EXPO_PUBLIC_REVENUECAT_IOS_KEY=${rc_ios}
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=${rc_android}

# Imgur (Upload de Imagens)
EXPO_PUBLIC_IMGUR_CLIENT_ID=${imgur_id}

# Sentry (Error Tracking)
EXPO_PUBLIC_SENTRY_DSN=${sentry_dsn}

# Feature Flags
EXPO_PUBLIC_ENABLE_AI_FEATURES=true
EXPO_PUBLIC_ENABLE_ANALYTICS=false
EXPO_PUBLIC_ENABLE_GAMIFICATION=false
EOF

    print_success "Arquivo .env.local criado com sucesso!"
    echo ""
    echo "Reinicie o servidor Expo para aplicar as mudanças:"
    echo "  npx expo start --clear"
}

# Verificar status dos secrets
check_secrets_status() {
    print_header "Status dos Secrets"

    # EAS Secrets
    print_step "EAS Secrets:"
    if npx eas-cli whoami &> /dev/null 2>&1; then
        npx eas-cli secret:list 2>/dev/null || print_warning "Não foi possível listar secrets do EAS"
    else
        print_warning "Não está logado no EAS"
    fi

    echo ""

    # Supabase Secrets
    print_step "Supabase Edge Functions Secrets:"
    if command -v supabase &> /dev/null; then
        supabase secrets list 2>/dev/null || print_warning "Não foi possível listar secrets do Supabase"
    else
        print_warning "Supabase CLI não instalado"
    fi

    echo ""

    # Local .env
    print_step "Arquivo .env.local:"
    if [ -f ".env.local" ]; then
        print_success "Arquivo existe"
        echo "  Variáveis configuradas:"
        grep -E "^EXPO_PUBLIC_" .env.local | sed 's/=.*/=***/' | sed 's/^/    /'
    else
        print_warning "Arquivo não existe"
    fi
}

# Setup completo
full_setup() {
    print_header "Configuração Completa"

    echo "Este assistente irá configurar:"
    echo "  1. EAS Secrets (para builds)"
    echo "  2. Supabase Edge Functions Secrets (API keys de AI)"
    echo "  3. Arquivo .env.local (desenvolvimento local)"
    echo ""
    read -p "Continuar? (Y/n): " confirm

    if [ "$confirm" == "n" ] || [ "$confirm" == "N" ]; then
        return 0
    fi

    setup_eas_secrets
    setup_supabase_secrets
    generate_env_local

    print_header "Configuração Completa Finalizada!"

    echo "Próximos passos:"
    echo ""
    echo "  1. Reinicie o servidor Expo:"
    echo "     npx expo start --clear"
    echo ""
    echo "  2. Para builds de produção:"
    echo "     npm run build:prod"
    echo ""
    echo "  3. Para verificar o status:"
    echo "     bash scripts/setup-secrets.sh (opção 4)"
}

# Main
check_dependencies
show_menu
