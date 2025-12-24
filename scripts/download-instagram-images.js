/**
 * Script para facilitar download de imagens do Instagram da Nathália
 * 
 * Como usar:
 * 1. Instale: npm install -g instagram-scraper (ou use alternativa manual)
 * 2. Execute: node scripts/download-instagram-images.js
 * 
 * OU use método manual:
 * 1. Acesse cada URL abaixo no navegador (com login)
 * 2. Clique com botão direito na imagem > "Salvar imagem como"
 * 3. Salve na pasta assets/onboarding/images/ com o nome correto
 */

const fs = require("fs");
const path = require("path");

const ASSETS_DIR = path.join(__dirname, "..", "assets", "onboarding", "images");
const POSTS = [
  {
    url: "https://www.instagram.com/nathaliavalente/p/DSchB9Pjnz3/",
    description: "Chegamos em Paris - Nathália com Thales",
    suggestedName: "stage-puerperio.jpg",
    category: "PUERPERIO / MAE_RECENTE",
  },
  {
    url: "https://www.instagram.com/nathaliavalente/p/DSaNWCrjvD7/",
    description: "1ª vez do Thales em um avião - Nathália segurando Thales",
    suggestedName: "checkin-nath-thales.jpg",
    category: "CHECK-IN / PUERPERIO",
  },
  {
    url: "https://www.instagram.com/nathaliavalente/p/DSTJIo3koYr/",
    description: "Thales e Zuzu - Família",
    suggestedName: "stage-mae-recente.jpg",
    category: "MAE_RECENTE",
  },
  {
    url: "https://www.instagram.com/nathaliavalente/p/DSQrV_wEnun/",
    description: "Zuzu - nova integrante",
    suggestedName: "concern-relacionamento.jpg",
    category: "RELACIONAMENTO",
  },
];

console.log("📥 URLs dos Posts do Instagram para Download:\n");
console.log("=" .repeat(60));

POSTS.forEach((post, index) => {
  console.log(`\n${index + 1}. ${post.category}`);
  console.log(`   Descrição: ${post.description}`);
  console.log(`   URL: ${post.url}`);
  console.log(`   Salvar como: ${post.suggestedName}`);
});

console.log("\n" + "=".repeat(60));
console.log("\n📋 Instruções:");
console.log("1. Acesse cada URL acima no navegador (faça login no Instagram)");
console.log("2. Clique com botão direito na imagem principal do post");
console.log("3. Selecione 'Salvar imagem como' ou 'Download'");
console.log("4. Salve em:", ASSETS_DIR);
console.log("5. Use o nome sugerido ou renomeie conforme necessário");
console.log("\n💡 Dica: Use extensões como 'Downloader for Instagram' para facilitar");

// Criar diretório se não existir
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  console.log(`\n✅ Diretório criado: ${ASSETS_DIR}`);
} else {
  console.log(`\n✅ Diretório já existe: ${ASSETS_DIR}`);
}

// Verificar quais imagens já foram baixadas
console.log("\n📊 Status dos downloads:");
const requiredImages = [
  "stage-tentante.jpg",
  "stage-gravida-t1.jpg",
  "stage-gravida-t2.jpg",
  "stage-gravida-t3.jpg",
  "stage-puerperio.jpg",
  "stage-mae-recente.jpg",
  "concern-ansiedade.jpg",
  "concern-informacao.jpg",
  "concern-sintomas.jpg",
  "concern-corpo.jpg",
  "concern-relacionamento.jpg",
  "concern-trabalho.jpg",
  "concern-solidao.jpg",
  "concern-financas.jpg",
  "emotional-bem.jpg",
  "emotional-ansiosa-leve.jpg",
  "emotional-ansiosa-grave.jpg",
  "emotional-triste.jpg",
  "checkin-nath-thales.jpg",
  "nath-profile-small.jpg",
];

requiredImages.forEach((imageName) => {
  const imagePath = path.join(ASSETS_DIR, imageName);
  if (fs.existsSync(imagePath)) {
    console.log(`✅ ${imageName}`);
  } else {
    console.log(`❌ ${imageName} - FALTANDO`);
  }
});

console.log("\n💡 Para mais informações, veja: docs/ONBOARDING_ASSETS_MAPPING.md");

