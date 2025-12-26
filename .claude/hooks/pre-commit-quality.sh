#!/bin/bash
# Pre-commit Quality Gate Hook
# Runs before every git commit to ensure code quality

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔍 Running pre-commit quality checks...${NC}\n"

# 1. TypeScript Check
echo -e "${YELLOW}[1/5] TypeScript check...${NC}"
if npm run typecheck > /dev/null 2>&1; then
    echo -e "${GREEN}✅ TypeScript: 0 errors${NC}"
else
    echo -e "${RED}❌ TypeScript errors found${NC}"
    npm run typecheck
    exit 1
fi

# 2. ESLint Check
echo -e "${YELLOW}[2/5] ESLint check...${NC}"
if npm run lint > /dev/null 2>&1; then
    echo -e "${GREEN}✅ ESLint: passed${NC}"
else
    echo -e "${RED}❌ ESLint errors found${NC}"
    echo -e "${YELLOW}💡 Run 'npm run lint:fix' to auto-fix${NC}"
    npm run lint
    exit 1
fi

# 3. console.log Detection
echo -e "${YELLOW}[3/5] Checking for console.log...${NC}"
if grep -r "console\.log" src/ --include="*.ts" --include="*.tsx" > /dev/null 2>&1; then
    echo -e "${RED}❌ console.log found (use logger.* instead)${NC}"
    grep -rn "console\.log" src/ --include="*.ts" --include="*.tsx" | head -5
    echo -e "${YELLOW}💡 Replace with logger.info() or logger.debug()${NC}"
    exit 1
else
    echo -e "${GREEN}✅ No console.log found${NC}"
fi

# 4. Hardcoded Colors Check (Warning only)
echo -e "${YELLOW}[4/5] Checking for hardcoded colors...${NC}"
HARDCODED_COUNT=$(grep -r "#[0-9A-Fa-f]\{6\}" src/ --include="*.tsx" --include="*.ts" | \
    grep -v "design-system\|tokens.ts\|colors.ts\|test\|\.test\|__tests__" | wc -l | tr -d ' ')

if [ "$HARDCODED_COUNT" -gt "0" ]; then
    echo -e "${YELLOW}⚠️  Warning: ${HARDCODED_COUNT} hardcoded colors found${NC}"
    echo -e "${YELLOW}   Goal: Migrate to Tokens.* from src/theme/tokens.ts${NC}"
else
    echo -e "${GREEN}✅ No hardcoded colors${NC}"
fi

# 5. Bundle ID Check (Critical)
echo -e "${YELLOW}[5/5] Verifying bundle IDs...${NC}"
if grep -q 'bundleIdentifier: "br.com.nossamaternidade.app"' app.config.js && \
   grep -q 'package: "com.nossamaternidade.app"' app.config.js; then
    echo -e "${GREEN}✅ Bundle IDs correct${NC}"
else
    echo -e "${RED}❌ CRITICAL: Bundle IDs were modified!${NC}"
    echo -e "${RED}   iOS should be: br.com.nossamaternidade.app${NC}"
    echo -e "${RED}   Android should be: com.nossamaternidade.app${NC}"
    exit 1
fi

echo -e "\n${GREEN}✅ All quality checks passed!${NC}\n"
