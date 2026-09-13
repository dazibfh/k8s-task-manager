const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "tasks_user",
    password: process.env.DB_PASSWORD || "tasks_password",
    database: process.env.DB_NAME || "tasks_db"
};

let db;


// ========================================
// CONNEXION À MYSQL
// ========================================

async function connectWithRetry() {

    while (true) {

        try {

            db = mysql.createPool(dbConfig);

            // Vérifier la connexion
            await db.query("SELECT 1");

            // Créer la table si elle n'existe pas
            await db.query(`
                CREATE TABLE IF NOT EXISTS tasks (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    completed BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Vérifier si la table est vide
            const [rows] = await db.query(
                "SELECT COUNT(*) AS count FROM tasks"
            );

            // Ajouter quelques tâches par défaut
            if (rows[0].count === 0) {

                await db.query(
                    `
                    INSERT INTO tasks (title, completed)
                    VALUES (?, ?), (?, ?)
                    `,
                    [
                        "Apprendre Docker",
                        true,
                        "Apprendre Kubernetes",
                        false
                    ]
                );

            }

            console.log("Connexion à MySQL réussie !");

            return;

        } catch (error) {

            console.error(
                "MySQL n'est pas encore disponible :",
                error.message
            );

            console.log(
                "Nouvelle tentative dans 3 secondes..."
            );

            await new Promise(
                resolve => setTimeout(resolve, 3000)
            );

        }

    }

}


/*
========================================
              ROUTES
========================================
*/


// ========================================
// GET — tester le backend
// ========================================

app.get("/", (req, res) => {

    res.json({
        message: "K8s Task Manager Backend fonctionne !"
    });

});


// ========================================
// GET — récupérer toutes les tâches
// ========================================

app.get("/api/tasks", async (req, res) => {

    try {

        const [tasks] = await db.query(
            `
            SELECT id, title, completed
            FROM tasks
            ORDER BY id
            `
        );

        res.json(tasks);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Erreur lors de la récupération des tâches"
        });

    }

});


// ========================================
// GET — récupérer une tâche par ID
// ========================================

app.get("/api/tasks/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        // Vérifier l'ID
        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                error: "ID invalide"
            });

        }

        const [tasks] = await db.query(
            `
            SELECT id, title, completed
            FROM tasks
            WHERE id = ?
            `,
            [id]
        );

        // Vérifier que la tâche existe
        if (tasks.length === 0) {

            return res.status(404).json({
                error: "Tâche introuvable"
            });

        }

        res.json(tasks[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Erreur lors de la récupération de la tâche"
        });

    }

});


// ========================================
// POST — créer une tâche
// ========================================

app.post("/api/tasks", async (req, res) => {

    try {

        const { title } = req.body;

        // Vérifier que title existe
        if (typeof title !== "string") {

            return res.status(400).json({
                error: "Le titre doit être une chaîne de caractères"
            });

        }

        // Supprimer les espaces inutiles
        const cleanTitle = title.trim();

        // Vérifier que le titre n'est pas vide
        if (cleanTitle === "") {

            return res.status(400).json({
                error: "Le titre de la tâche est obligatoire"
            });

        }

        // Vérifier la longueur
        if (cleanTitle.length > 255) {

            return res.status(400).json({
                error: "Le titre ne peut pas dépasser 255 caractères"
            });

        }

        // Ajouter la tâche
        const [result] = await db.query(
            `
            INSERT INTO tasks (title, completed)
            VALUES (?, ?)
            `,
            [
                cleanTitle,
                false
            ]
        );

        // Récupérer la tâche créée
        const [tasks] = await db.query(
            `
            SELECT id, title, completed
            FROM tasks
            WHERE id = ?
            `,
            [result.insertId]
        );

        res.status(201).json(tasks[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Erreur lors de la création de la tâche"
        });

    }

});


// ========================================
// PUT — modifier une tâche
// ========================================

app.put("/api/tasks/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);
        const { title, completed } = req.body;

        // Vérifier l'ID
        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                error: "ID invalide"
            });

        }

        // Vérifier que la tâche existe
        const [existingTasks] = await db.query(
            `
            SELECT id, title, completed
            FROM tasks
            WHERE id = ?
            `,
            [id]
        );

        if (existingTasks.length === 0) {

            return res.status(404).json({
                error: "Tâche introuvable"
            });

        }

        const existingTask = existingTasks[0];

        let newTitle = existingTask.title;

        // MySQL peut retourner 0/1 pour BOOLEAN
        let newCompleted = Boolean(existingTask.completed);


        // ========================================
        // Validation du title
        // ========================================

        if (title !== undefined) {

            if (typeof title !== "string") {

                return res.status(400).json({
                    error: "Le titre doit être une chaîne de caractères"
                });

            }

            newTitle = title.trim();

            if (newTitle === "") {

                return res.status(400).json({
                    error: "Le titre ne peut pas être vide"
                });

            }

            if (newTitle.length > 255) {

                return res.status(400).json({
                    error: "Le titre ne peut pas dépasser 255 caractères"
                });

            }

        }


        // ========================================
        // Validation de completed
        // ========================================

        if (completed !== undefined) {

            if (typeof completed !== "boolean") {

                return res.status(400).json({
                    error: "completed doit être true ou false"
                });

            }

            newCompleted = completed;

        }


        // ========================================
        // Mise à jour
        // ========================================

        await db.query(
            `
            UPDATE tasks
            SET title = ?, completed = ?
            WHERE id = ?
            `,
            [
                newTitle,
                newCompleted,
                id
            ]
        );


        // ========================================
        // Retourner la tâche modifiée
        // ========================================

        const [tasks] = await db.query(
            `
            SELECT id, title, completed
            FROM tasks
            WHERE id = ?
            `,
            [id]
        );

        res.json(tasks[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Erreur lors de la modification de la tâche"
        });

    }

});


// ========================================
// DELETE — supprimer une tâche
// ========================================

app.delete("/api/tasks/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        // Vérifier l'ID
        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                error: "ID invalide"
            });

        }

        const [result] = await db.query(
            `
            DELETE FROM tasks
            WHERE id = ?
            `,
            [id]
        );

        // Vérifier si une tâche a été supprimée
        if (result.affectedRows === 0) {

            return res.status(404).json({
                error: "Tâche introuvable"
            });

        }

        res.status(204).send();

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Erreur lors de la suppression de la tâche"
        });

    }

});


/*
========================================
           START SERVER
========================================
*/

async function startServer() {

    try {

        // Attendre que MySQL soit disponible
        await connectWithRetry();

        // Démarrer Express
        app.listen(PORT, "0.0.0.0", () => {

            console.log(
                `Backend démarré sur le port ${PORT}`
            );

        });

    } catch (error) {

        console.error(
            "Erreur lors du démarrage du serveur :",
            error
        );

        process.exit(1);

    }

}


startServer();
