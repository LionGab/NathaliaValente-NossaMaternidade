/**
 * Script para preparar assets do onboarding
 * Valida estrutura de pastas e arquivos necessários
 */

const fs = require("fs");
const path = require("path");

const ASSETS_DIR = path.join(__dirname, "..", "assets", "onboarding");
const VIDEOS_DIR = path.join(ASSETS_DIR, "videos");
const IMAGES_DIR = path.join(ASSETS_DIR, "images");

const REQUIRED_VIDEOS = [
  "welcome.mp4",
  "emotional-state.mp4",
  "paywall.mp4",
];

const REQUIRED_STAGE_IMAGES = [
  "stage-tentante.jpg",
  "stage-gravida-t1.jpg",
  "stage-gravida-t2.jpg",
  "stage-gravida-t3.jpg",
  "stage-puerperio.jpg",
  "stage-mae-recente.jpg",
];

const REQUIRED_CONCERN_IMAGES = [
  "concern-ansiedade.jpg",
  "concern-informacao.jpg",
  "concern-sintomas.jpg",
  "concern-corpo.jpg",
  "concern-relacionamento.jpg",
  "concern-trabalho.jpg",
  "concern-solidao.jpg",
  "concern-financas.jpg",
];

const REQUIRED_EMOTIONAL_IMAGES = [
  "emotional-bem.jpg",
  "emotional-ansiosa-leve.jpg",
  "emotional-ansiosa-grave.jpg",
  "emotional-triste.jpg",
];

const REQUIRED_OTHER_IMAGES = [
  "checkin-nath-thales.jpg",
  "nath-profile-small.jpg",
];

const ALL_REQUIRED_IMAGES = [
  ...REQUIRED_STAGE_IMAGES,
  ...REQUIRED_CONCERN_IMAGES,
  ...REQUIRED_EMOTIONAL_IMAGES,
  ...REQUIRED_OTHER_IMAGES,
];

function checkFileExists(filePath, fileName) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ FALTANDO: ${fileName}`);
    return false;
  }
  console.log(`✅ ${fileName}`);
  return true;
}

function main() {
  console.log("🔍 Verificando assets do onboarding...\n");

  // Criar diretórios se não existirem
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
    console.log("📁 Criado diretório: assets/onboarding");
  }
  if (!fs.existsSync(VIDEOS_DIR)) {
    fs.mkdirSync(VIDEOS_DIR, { recursive: true });
    console.log("📁 Criado diretório: assets/onboarding/videos");
  }
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
    console.log("📁 Criado diretório: assets/onboarding/images");
  }

  console.log("\n📹 Vídeos necessários:");
  let videosOk = 0;
  REQUIRED_VIDEOS.forEach((video) => {
    const videoPath = path.join(VIDEOS_DIR, video);
    if (checkFileExists(videoPath, video)) videosOk++;
  });

  console.log("\n🖼️  Imagens necessárias:");
  let imagesOk = 0;
  ALL_REQUIRED_IMAGES.forEach((image) => {
    const imagePath = path.join(IMAGES_DIR, image);
    if (checkFileExists(imagePath, image)) imagesOk++;
  });

  console.log("\n📊 Resumo:");
  console.log(`Vídeos: ${videosOk}/${REQUIRED_VIDEOS.length}`);
  console.log(`Imagens: ${imagesOk}/${ALL_REQUIRED_IMAGES.length}`);
  console.log(`Total: ${videosOk + imagesOk}/${REQUIRED_VIDEOS.length + ALL_REQUIRED_IMAGES.length}`);

  if (videosOk === REQUIRED_VIDEOS.length && imagesOk === ALL_REQUIRED_IMAGES.length) {
    console.log("\n✅ Todos os assets estão presentes!");
    return 0;
  } else {
    console.log("\n⚠️  Alguns assets estão faltando. Veja docs/ONBOARDING_ASSETS_GUIDE.md");
    return 1;
  }
}

if (require.main === module) {
  process.exit(main());
}

module.exports = { main };

