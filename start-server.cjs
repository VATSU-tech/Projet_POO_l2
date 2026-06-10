const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');
const readline = require('readline');

const dbPath = path.join(__dirname, 'db.json');

const defaultData = {
  "comptes": [
    {
      "id": "1",
      "numero": "FR76 1234 5678 9012",
      "proprietaire": "Jean Dupont",
      "solde": 1500.5,
      "type": "courant"
    },
    {
      "id": "2",
      "numero": "FR76 9876 5432 1098",
      "proprietaire": "Marie Curie",
      "solde": 4500,
      "type": "epargne",
      "tauxInteret": 2.5
    }
  ],
  "operations": [
    {
      "id": "o1",
      "montant": 500,
      "date": "2026-06-09T08:30:00.000Z",
      "compteId": "1",
      "type": "depot"
    },
    {
      "id": "o2",
      "montant": 200,
      "date": "2026-06-09T09:15:00.000Z",
      "compteId": "2",
      "type": "retrait"
    }
  ]
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
