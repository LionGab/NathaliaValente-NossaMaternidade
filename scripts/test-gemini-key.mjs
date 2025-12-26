#!/usr/bin/env node
/**
 * Script para testar e validar a API key do Gemini
 *
 * Uso:
 *   node scripts/test-gemini-key.mjs [API_KEY]
 *
 * Se não passar a API_KEY, tenta ler de:
 *   1. Variável de ambiente GEMINI_API_KEY
 *   2. Supabase secrets (se supabase CLI estiver configurado)
 */

import { execSync } from 'child_process';

const GEMINI_API_KEY = process.argv[2] || process.env.GEMINI_API_KEY;

async function testGeminiKey(apiKey) {
  if (!apiKey) {
    console.error('❌ API key não fornecida');
    console.log('\n💡 Como usar:');
    console.log('   node scripts/test-gemini-key.mjs YOUR_API_KEY');
    console.log('   ou');
    console.log('   GEMINI_API_KEY=your_key node scripts/test-gemini-key.mjs');
    console.log('\n💡 Para obter uma API key:');
    console.log('   https://makersuite.google.com/app/apikey');
    process.exit(1);
  }

  // Validar formato básico (Gemini keys começam com "AIza")
  if (!apiKey.startsWith('AIza')) {
    console.warn('⚠️  A API key não parece ser do Gemini (deveria começar com "AIza")');
  }

  console.log('🔍 Testando API key do Gemini...\n');
  console.log(`   Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}\n`);

  try {
    // Teste simples: gerar conteúdo com modelo básico
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: 'Olá, responda apenas "OK" se estiver funcionando.' }],
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 10,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        // Se não for JSON, usar texto direto
        errorJson = { error: { message: errorText } };
      }

      const error = errorJson.error || errorJson[0]?.error;

      if (error?.code === 400 && error?.message?.includes('API key not valid')) {
        console.error('❌ API key inválida ou expirada');
        console.log('\n💡 Possíveis causas:');
        console.log('   1. A chave foi revogada ou expirada');
        console.log('   2. A chave não tem permissões para Gemini API');
        console.log('   3. A chave está incorreta (copiar/colar errado)');
        console.log('\n💡 Como corrigir:');
        console.log('   1. Acesse: https://makersuite.google.com/app/apikey');
        console.log('   2. Crie uma nova API key ou verifique a existente');
        console.log('   3. Certifique-se de que a API "Generative Language API" está habilitada');
        console.log('   4. Configure no Supabase:');
        console.log('      supabase secrets set GEMINI_API_KEY="sua_nova_chave"');
        process.exit(1);
      } else if (error?.code === 403) {
        console.error('❌ API key sem permissões');
        console.log('\n💡 A chave existe mas não tem acesso ao Gemini API');
        console.log('   Verifique em: https://console.cloud.google.com/apis/credentials');
        process.exit(1);
      } else {
        console.error(`❌ Erro na API: ${error?.message || errorText}`);
        console.log(`   Status: ${response.status}`);
        process.exit(1);
      }
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (text) {
      console.log('✅ API key válida e funcionando!');
      console.log(`\n📝 Resposta do teste: "${text}"\n`);

      // Verificar se está configurada no Supabase
      console.log('🔍 Verificando configuração no Supabase...\n');
      try {
        const secretsOutput = execSync('supabase secrets list', {
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe']
        });

        if (secretsOutput.includes('GEMINI_API_KEY')) {
          console.log('✅ GEMINI_API_KEY encontrada nos secrets do Supabase');

          // Tentar comparar (sem mostrar a chave completa)
          const lines = secretsOutput.split('\n');
          const geminiLine = lines.find(l => l.includes('GEMINI_API_KEY'));
          if (geminiLine) {
            const storedKey = geminiLine.split('=')[1]?.trim();
            if (storedKey && storedKey.substring(0, 10) === apiKey.substring(0, 10)) {
              console.log('✅ A chave testada corresponde à configurada no Supabase');
            } else {
              console.warn('⚠️  A chave testada é diferente da configurada no Supabase');
              console.log('   Atualize com: supabase secrets set GEMINI_API_KEY="sua_chave"');
            }
          }
        } else {
          console.warn('⚠️  GEMINI_API_KEY não encontrada nos secrets do Supabase');
          console.log('   Configure com: supabase secrets set GEMINI_API_KEY="sua_chave"');
        }
      } catch (err) {
        console.warn('⚠️  Não foi possível verificar secrets do Supabase');
        console.log('   (Isso é normal se o Supabase CLI não estiver configurado)');
        console.log('   Configure manualmente em: Supabase Dashboard → Settings → Edge Functions → Secrets');
      }

      console.log('\n✅ Tudo certo! A API key está funcionando.');
      process.exit(0);
    } else {
      console.error('❌ Resposta inesperada da API');
      console.log('   Dados recebidos:', JSON.stringify(data, null, 2));
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Erro ao testar API key:', err.message);
    if (err.message.includes('fetch')) {
      console.log('\n💡 Verifique sua conexão com a internet');
    }
    process.exit(1);
  }
}

// Executar teste
testGeminiKey(GEMINI_API_KEY);
