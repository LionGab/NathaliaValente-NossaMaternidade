# Launch Status Command

Show current launch preparation status and next steps.

---

## Instructions

Check the following and report:

1. **Code Status**:
   - Run `npm run quality-gate`
   - TypeScript errors
   - ESLint issues
   - Build readiness

2. **Legal Docs** (P0 Blocker):
   - Privacy Policy URL published?
   - Terms of Service URL published?
   - AI Disclaimer URL published?

3. **RevenueCat Dashboard** (P0 Blocker):
   - Account created?
   - iOS app added?
   - Android app added?
   - Entitlement "premium" created?
   - Offering "default" created?
   - Webhook configured?

4. **App Store Connect** (P0 Blocker):
   - App created?
   - Subscription group created?
   - Monthly product created?
   - Annual product created?

5. **Google Play Console** (P0 Blocker):
   - App created?
   - Monthly subscription created?
   - Annual subscription created?

6. **Next Steps**:
   - Read `docs/PLANO_LANCAMENTO_10_DIAS.md`
   - Run `./scripts/launch-checklist.sh`
   - Identify which day we're on

## Output Format

```markdown
# 🚀 Launch Status - Nossa Maternidade

## Code Quality ✅
- TypeScript: 0 errors
- ESLint: 0 errors
- Quality Gate: 100%

## Critical Blockers (P0)
❌ Legal Docs: NOT published
❌ RevenueCat: NOT configured
❌ App Store: NOT created
❌ Google Play: NOT created

## Next Steps
1. Execute Day 1: Legal Docs + RevenueCat (8h)
2. Run: `./scripts/launch-checklist.sh 1`

## Timeline
Days remaining: 10
Target launch: [date]
```
