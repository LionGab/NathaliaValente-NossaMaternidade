/**
 * Script para baixar imagens diretamente do Instagram usando URLs públicas
 * NOTA: Instagram bloqueia downloads sem autenticação, então este script
 * tenta métodos alternativos ou usa screenshots como fallback
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "..", "assets", "onboarding", "images");

// URLs conhecidas (precisam ser atualizadas com URLs reais quando disponíveis)
const IMAGE_URLS = {
  "nath-profile-small.jpg":
    "https://instagram.fcgb9-1.fna.fbcdn.net/v/t51.2885-19/536776283_18285181189283165_359396494595178301_n.jpg",
};

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(OUTPUT_DIR, filename);
    const file = fs.createWriteStream(filepath);

    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            console.log(`✅ Baixado: ${filename}`);
            resolve(filepath);
          });
        } else {
          fs.unlink(filepath, () => {});
          reject(new Error(`Erro ${response.statusCode}: ${url}`));
        }
      })
      .on("error", (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
  });
}

async function main() {
  console.log("📥 Tentando baixar imagens do Instagram...\n");

  // Criar diretório se não existir
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Tentar baixar foto de perfil
  try {
    await downloadImage(IMAGE_URLS["nath-profile-small.jpg"], "nath-profile-small.jpg");
  } catch (error) {
    console.log(`❌ Erro ao baixar nath-profile-small.jpg: ${error.message}`);
    console.log("💡 URL pode estar expirada ou requer autenticação");
  }

  console.log("\n⚠️  Instagram bloqueia downloads diretos sem autenticação.");
  console.log("💡 Use os screenshots capturados ou baixe manualmente:");
  console.log("   1. Acesse: docs/DOWNLOAD_IMAGES_INSTRUCTIONS.md");
  console.log("   2. Siga as instruções para download manual");
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { downloadImage };
