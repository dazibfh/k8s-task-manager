const API_URL = "http://localhost:3000/api/tasks";


// ========================================
// VARIABLES MODAL
// ========================================

let editingTaskId = null;
let deletingTaskId = null;


// ========================================
// CHARGER LES TÂCHES
// ========================================

async function loadTasks() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Erreur HTTP : " + response.status);
        }

        const tasks = await response.json();

        const taskList = document.getElementById("tasks");

        taskList.innerHTML = "";

        let completed = 0;

        tasks.forEach(task => {

            if (task.completed) {
                completed++;
            }

            const li = document.createElement("li");

            li.classList.add("task");

            if (task.completed) {
                li.classList.add("completed");
            }

            li.innerHTML = `

                <div class="task-left">

                    <button
                        class="task-check"
                        onclick="toggleTask(${task.id}, ${Boolean(task.completed)})"
                    >
                        ${task.completed ? "✓" : ""}
                    </button>

                    <span class="task-title">
                        ${escapeHtml(task.title)}
                    </span>

                </div>

                <div class="task-actions">

                    <span class="task-status ${
                        task.completed
                            ? "status-completed"
                            : "status-pending"
                    }">
                        ${
                            task.completed
                                ? "Completed"
                                : "Pending"
                        }
                    </span>

                    <button
                        class="edit-button"
                        onclick="openEditModal(${task.id}, '${escapeJs(task.title)}')"
                        title="Modifier"
                    >
                        ✏️
                    </button>

                    <button
                        class="delete-button"
                        onclick="openDeleteModal(${task.id})"
                        title="Supprimer"
                    >
                        🗑️
                    </button>

                </div>
            `;

            taskList.appendChild(li);
        });


        // Statistiques

        document.getElementById("totalTasks").textContent =
            tasks.length;

        document.getElementById("completedTasks").textContent =
            completed;

        document.getElementById("pendingTasks").textContent =
            tasks.length - completed;


    } catch (error) {

        console.error(
            "Erreur lors du chargement des tâches :",
            error
        );

    }
}


// ========================================
// OUVRIR MODAL AJOUT
// ========================================

function openAddModal() {

    editingTaskId = null;

    document.getElementById("modalTitle").textContent =
        "Add New Task";

    document.querySelector(".save-button").textContent =
        "Add Task";

    document.getElementById("taskInput").value = "";

    document.getElementById("modalError").textContent = "";

    document.getElementById("taskModal").classList.add("show");

    setTimeout(() => {
        document.getElementById("taskInput").focus();
    }, 100);
}


// ========================================
// OUVRIR MODAL MODIFICATION
// ========================================

function openEditModal(id, title) {

    editingTaskId = id;

    document.getElementById("modalTitle").textContent =
        "Edit Task";

    document.querySelector(".save-button").textContent =
        "Save Changes";

    document.getElementById("taskInput").value =
        title;

    document.getElementById("modalError").textContent = "";

    document.getElementById("taskModal").classList.add("show");

    setTimeout(() => {
        document.getElementById("taskInput").focus();
    }, 100);
}


// ========================================
// FERMER MODAL TÂCHE
// ========================================

function closeTaskModal() {

    document
        .getElementById("taskModal")
        .classList.remove("show");

    editingTaskId = null;

}


// ========================================
// SAUVEGARDER TÂCHE
// ========================================

async function saveTask() {

    const input =
        document.getElementById("taskInput");

    const errorElement =
        document.getElementById("modalError");

    const title = input.value.trim();

    if (title === "") {

        errorElement.textContent =
            "Le nom de la tâche est obligatoire.";

        input.focus();

        return;
    }

    if (title.length > 255) {

        errorElement.textContent =
            "Le nom de la tâche ne peut pas dépasser 255 caractères.";

        input.focus();

        return;
    }


    try {

        let response;

        // ========================================
        // AJOUT
        // ========================================

        if (editingTaskId === null) {

            response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title: title
                })

            });

        }

        // ========================================
        // MODIFICATION
        // ========================================

        else {

            response = await fetch(
                `${API_URL}/${editingTaskId}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        title: title
                    })

                }
            );

        }


        const data = await response.json();


        if (!response.ok) {

            errorElement.textContent =
                data.error || "Une erreur est survenue.";

            return;
        }


        closeTaskModal();

        await loadTasks();


    } catch (error) {

        console.error(error);

        errorElement.textContent =
            "Impossible de contacter le serveur.";

    }
}


// ========================================
// TERMINER / RÉACTIVER
// ========================================

async function toggleTask(id, completed) {

    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    completed: !completed
                })

            }
        );


        if (!response.ok) {

            throw new Error(
                "Erreur lors de la modification"
            );

        }


        await loadTasks();


    } catch (error) {

        console.error(error);

        alert(
            "Impossible de modifier la tâche."
        );

    }
}


// ========================================
// OUVRIR MODAL SUPPRESSION
// ========================================

function openDeleteModal(id) {

    deletingTaskId = id;

    document
        .getElementById("deleteModal")
        .classList.add("show");
}


// ========================================
// FERMER MODAL SUPPRESSION
// ========================================

function closeDeleteModal() {

    document
        .getElementById("deleteModal")
        .classList.remove("show");

    deletingTaskId = null;
}


// ========================================
// CONFIRMER SUPPRESSION
// ========================================
async function confirmDelete() {

    if (deletingTaskId === null) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/${deletingTaskId}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {

            throw new Error(
                `Erreur HTTP : ${response.status}`
            );

        }

        // La suppression a réussi
        closeDeleteModal();

        // Recharger la liste
        await loadTasks();

    } catch (error) {

        console.error(
            "Erreur lors de la suppression :",
            error
        );

        alert(
            "Impossible de supprimer la tâche."
        );

    }
}

// ========================================
// PROTECTION HTML
// ========================================

function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ========================================
// PROTECTION JAVASCRIPT
// ========================================

function escapeJs(text) {

    return text
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r");
}


// ========================================
// BOUTON ADD TASK
// ========================================

const addButton =
    document.querySelector(".add-button");

if (addButton) {

    addButton.addEventListener(
        "click",
        openAddModal
    );

}


// ========================================
// DÉMARRER APPLICATION
// ========================================

loadTasks();
