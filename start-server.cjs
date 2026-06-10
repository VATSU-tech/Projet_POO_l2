const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');
const readline = require('readline');

const dbPath = path.join(__dirname, 'db.json');

const defaultData = {
  "comptes": [
    {
      "id": "f_hzEhESfNo",
      "numero": "SDFEWS 09873 08329R SDFSD",
      "proprietaire": "Katsuva Malambo",
      "solde": 313861,
      "type": "courant"
    },
    {
      "id": "FDUbxcGKB2g",
      "numero": "LSDKFJ 03284 WER0234",
      "proprietaire": "Katsuva Vatsu",
      "solde": 1000200,
      "type": "epargne",
      "tauxInteret": 5
    }
  ],
  "operations": [
    {
      "id": "aiN-ADpeWk0",
      "montant": 200,
      "date": "2026-06-10T08:00:16.202Z",
      "compteId": "FDUbxcGKB2g",
      "type": "depot"
    },
    {
      "id": "4LKA3huiPzc",
      "montant": 87,
      "date": "2026-06-10T08:01:07.378Z",
      "compteId": "f_hzEhESfNo",
      "type": "retrait"
    },
    {
      "id": "RxA_sZEeKuk",
      "montant": 3245,
      "date": "2026-06-10T08:17:04.954Z",
      "compteId": "f_hzEhESfNo",
      "type": "depot"
    }
  ],
};

function createDbFile() {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2), 'utf8');
    console.log("✅ Le fichier db.json a été créé avec succès avec les données par défaut.");
    return true;
  } catch (err) {
    console.error("❌ Erreur lors de la création de db.json :", err.message);
    return false;
  }
}

function startJsonServer() {
  console.log("🚀 Lancement de json-server sur le port 3001...");
  const server = spawn('npx', ['json-server', '--watch', 'db.json', '--port', '3001'], {
    stdio: 'inherit',
    shell: true
  });

  server.on('error', (err) => {
    console.error("❌ Erreur lors du lancement de json-server :", err.message);
  });
}

function askCli(callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Le fichier db.json n'existe pas. Voulez-vous le créer automatiquement ? (O/n) : ", (answer) => {
    rl.close();
    const cleanAnswer = answer.trim().toLowerCase();
    if (cleanAnswer === '' || cleanAnswer === 'o' || cleanAnswer === 'oui' || cleanAnswer === 'y' || cleanAnswer === 'yes') {
      callback(true);
    } else {
      callback(false);
    }
  });
}

function checkAndStart() {
  if (fs.existsSync(dbPath)) {
    startJsonServer();
    return;
  }

  console.log("🔍 db.json introuvable. Tentative d'affichage d'un pop-up...");

  // Try to use zenity for a GUI popup
  try {
    // Check if zenity works
    execSync('which zenity', { stdio: 'ignore' });

    // Run zenity --question
    const zenityCmd = `zenity --question --title="POO Bank - Fichier db.json manquant" --text="Le fichier db.json est introuvable.\\n\\nVoulez-vous le créer automatiquement avec les données par défaut pour démarrer le serveur ?" --ok-label="Créer" --cancel-label="Annuler"`;

    try {
      execSync(zenityCmd, { stdio: 'ignore' });
      // If execSync finishes with exit code 0 (success)
      if (createDbFile()) {
        startJsonServer();
      } else {
        console.log("❌ Impossible de démarrer le serveur sans db.json.");
      }
    } catch (e) {
      // User clicked Cancel, or GUI display is not available
      console.log("⚠️ Pop-up refusé ou non disponible. Passage au mode terminal...");
      askCli((shouldCreate) => {
        if (shouldCreate) {
          if (createDbFile()) {
            startJsonServer();
          }
        } else {
          console.log("❌ Lancement annulé par l'utilisateur.");
        }
      });
    }
  } catch (err) {
    // zenity is not installed
    console.log("⚠️ Pop-up graphique non disponible. Utilisation du mode terminal...");
    askCli((shouldCreate) => {
      if (shouldCreate) {
        if (createDbFile()) {
          startJsonServer();
        }
      } else {
        console.log("❌ Lancement annulé par l'utilisateur.");
      }
    });
  }
}

checkAndStart();
