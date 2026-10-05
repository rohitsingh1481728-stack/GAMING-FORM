const form = document.getElementById("registrationForm");
const playerContainer = document.getElementById("playerContainer");
const emptyState = document.getElementById("emptyState");
const playerCount = document.getElementById("playerCount");


// ========================================
// LOAD SAVED PLAYERS
// ========================================

let players = JSON.parse(
    localStorage.getItem("gamingPlayers")
) || [];


// Current player being edited
let editingPlayerId = null;


// ========================================
// SAVE PLAYERS
// ========================================

function savePlayers() {

    localStorage.setItem(
        "gamingPlayers",
        JSON.stringify(players)
    );

}


// ========================================
// SELECT GAME FROM GAME CARD
// ========================================

function selectGame(gameName) {

    const gameSelect =
        document.getElementById("game");

    // Select game in form
    gameSelect.value = gameName;


    // Remove selected class from all cards
    document
        .querySelectorAll(".game-card")
        .forEach(card => {

            card.classList.remove("selected");

        });


    // Add selected class
    const selectedCard =
        document.querySelector(
            `.game-card[data-game="${gameName}"]`
        );


    if (selectedCard) {

        selectedCard.classList.add("selected");

    }


    // Scroll to registration form
    document
        .querySelector(".form-section")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

}


// ========================================
// GAME SELECT CHANGE
// ========================================

document
    .getElementById("game")
    .addEventListener("change", function () {

        const selectedGame = this.value;


        document
            .querySelectorAll(".game-card")
            .forEach(card => {

                card.classList.remove("selected");

            });


        if (selectedGame) {

            const selectedCard =
                document.querySelector(
                    `.game-card[data-game="${selectedGame}"]`
                );


            if (selectedCard) {

                selectedCard.classList.add("selected");

            }

        }

    });


// ========================================
// REGISTER / UPDATE PLAYER
// ========================================

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // --------------------------------
        // GET FORM VALUES
        // --------------------------------

        const name =
            document
                .getElementById("gamerName")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim()
                .toLowerCase();


        const age =
            document
                .getElementById("age")
                .value
                .trim();


        const phone =
            document
                .getElementById("phone")
                .value
                .trim();


        const game =
            document
                .getElementById("game")
                .value;


        const gameId =
            document
                .getElementById("gameId")
                .value
                .trim();


        const rank =
            document
                .getElementById("rank")
                .value;


        const platform =
            document
                .getElementById("platform")
                .value;


        const modeElement =
            document.querySelector(
                'input[name="mode"]:checked'
            );


        // --------------------------------
        // CHECK GAME MODE
        // --------------------------------

        if (!modeElement) {

            showMessage(
                "⚠️ Please select a game mode.",
                "error"
            );

            return;

        }


        const mode =
            modeElement.value;


        // ========================================
        // EDIT EXISTING PLAYER
        // ========================================

        if (editingPlayerId !== null) {


            const playerIndex =
                players.findIndex(
                    player =>
                        player.id === editingPlayerId
                );


            if (playerIndex === -1) {

                editingPlayerId = null;

                return;

            }


            // --------------------------------
            // CHECK DUPLICATE EMAIL
            // --------------------------------

            const emailExists =
                players.some(
                    player =>
                        player.id !== editingPlayerId &&
                        player.email.toLowerCase() === email
                );


            if (emailExists) {

                showMessage(
                    "❌ This email is already registered!",
                    "error"
                );

                return;

            }


            // --------------------------------
            // CHECK DUPLICATE GAME ID
            // --------------------------------

            const gameIdExists =
                players.some(
                    player =>
                        player.id !== editingPlayerId &&
                        player.gameId.toLowerCase() ===
                        gameId.toLowerCase()
                );


            if (gameIdExists) {

                showMessage(
                    "❌ This Game ID is already registered!",
                    "error"
                );

                return;

            }


            // --------------------------------
            // UPDATE PLAYER
            // --------------------------------

            players[playerIndex] = {

                id: editingPlayerId,

                name: name,

                email: email,

                age: age,

                phone: phone,

                game: game,

                gameId: gameId,

                rank: rank,

                platform: platform,

                mode: mode

            };


            savePlayers();

            renderPlayers();


            // Exit edit mode

            editingPlayerId = null;


            // Reset form

            form.reset();


            clearSelectedGame();


            // Change button back

            setRegisterButton();


            showMessage(
                "✅ Player details updated successfully!",
                "success"
            );


            return;

        }


        // ========================================
        // NEW PLAYER REGISTRATION
        // ========================================


        // --------------------------------
        // DUPLICATE EMAIL
        // --------------------------------

        const emailExists =
            players.some(
                player =>
                    player.email.toLowerCase() === email
            );


        if (emailExists) {

            showMessage(
                "❌ This email is already registered!",
                "error"
            );

            return;

        }


        // --------------------------------
        // DUPLICATE GAME ID
        // --------------------------------

        const gameIdExists =
            players.some(
                player =>
                    player.gameId.toLowerCase() ===
                    gameId.toLowerCase()
            );


        if (gameIdExists) {

            showMessage(
                "❌ This Game ID is already registered!",
                "error"
            );

            return;

        }


        // --------------------------------
        // CREATE NEW PLAYER
        // --------------------------------

        const newPlayer = {

            id: Date.now(),

            name: name,

            email: email,

            age: age,

            phone: phone,

            game: game,

            gameId: gameId,

            rank: rank,

            platform: platform,

            mode: mode

        };


        // Add player

        players.push(newPlayer);


        // Save player

        savePlayers();


        // Display player

        renderPlayers();


        // Reset form

        form.reset();


        // Remove selected game

        clearSelectedGame();


        // Register button

        setRegisterButton();


        // Success message

        showMessage(
            "🎮 Registration successful! Welcome to GameZone!",
            "success"
        );


        // Scroll to players

        setTimeout(() => {

            document
                .querySelector(".players-section")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }, 300);

    }
);


// ========================================
// RENDER ALL PLAYERS
// ========================================

function renderPlayers() {

    playerContainer.innerHTML = "";


    // Update count

    playerCount.textContent =
        `${players.length} player${players.length !== 1 ? "s" : ""} registered`;


    // Empty state

    if (players.length === 0) {

        emptyState.style.display = "block";

        return;

    }


    emptyState.style.display = "none";


    // Create player cards

    players.forEach(player => {

        const card =
            document.createElement("div");


        card.className =
            "player-card";


        card.innerHTML = `

            <div class="player-header">

                <div class="player-name">
                    🎮 ${escapeHTML(player.name)}
                </div>

                <div class="status">
                    REGISTERED
                </div>

            </div>


            <div class="player-info">

                <div>
                    <span>Email:</span>
                    ${escapeHTML(player.email)}
                </div>

                <div>
                    <span>Age:</span>
                    ${escapeHTML(player.age)}
                </div>

                <div>
                    <span>Phone:</span>
                    ${escapeHTML(player.phone)}
                </div>

                <div>
                    <span>Game:</span>
                    ${escapeHTML(player.game)}
                </div>

                <div>
                    <span>Game ID:</span>
                    ${escapeHTML(player.gameId)}
                </div>

                <div>
                    <span>Rank:</span>
                    ${escapeHTML(player.rank)}
                </div>

                <div>
                    <span>Platform:</span>
                    ${escapeHTML(player.platform)}
                </div>

                <div>
                    <span>Mode:</span>
                    ${escapeHTML(player.mode)}
                </div>

            </div>


            <div class="player-actions">

                <button
                    class="edit-btn"
                    onclick="editPlayer(${player.id})">

                    ✏️ Edit

                </button>


                <button
                    class="delete-btn"
                    onclick="deletePlayer(${player.id})">

                    🗑️ Delete

                </button>

            </div>

        `;


        playerContainer.appendChild(card);

    });

}


// ========================================
// EDIT PLAYER
// ========================================

function editPlayer(id) {

    const player =
        players.find(
            player =>
                player.id === id
        );


    if (!player) {

        return;

    }


    // Set editing ID

    editingPlayerId = id;


    // Fill form

    document
        .getElementById("gamerName")
        .value = player.name;


    document
        .getElementById("email")
        .value = player.email;


    document
        .getElementById("age")
        .value = player.age;


    document
        .getElementById("phone")
        .value = player.phone;


    document
        .getElementById("game")
        .value = player.game;


    document
        .getElementById("gameId")
        .value = player.gameId;


    document
        .getElementById("rank")
        .value = player.rank;


    document
        .getElementById("platform")
        .value = player.platform;


    // Select mode

    const modeRadio =
        document.querySelector(
            `input[name="mode"][value="${player.mode}"]`
        );


    if (modeRadio) {

        modeRadio.checked = true;

    }


    // Highlight game card

    document
        .querySelectorAll(".game-card")
        .forEach(card => {

            card.classList.remove("selected");

        });


    const selectedCard =
        document.querySelector(
            `.game-card[data-game="${player.game}"]`
        );


    if (selectedCard) {

        selectedCard.classList.add("selected");

    }


    // Change button

    const button =
        form.querySelector(".register-btn");


    if (button) {

        button.innerHTML =
            "<span>💾</span> Update Player";

    }


    // Scroll to form

    document
        .querySelector(".form-section")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

}


// ========================================
// DELETE PLAYER
// ========================================

function deletePlayer(id) {

    const player =
        players.find(
            player =>
                player.id === id
        );


    if (!player) {

        return;

    }


    const confirmed =
        confirm(
            `Are you sure you want to delete "${player.name}"?`
        );


    if (!confirmed) {

        return;

    }


    // Remove player

    players =
        players.filter(
            player =>
                player.id !== id
        );


    // Save

    savePlayers();


    // Refresh cards

    renderPlayers();


    // If currently editing this player

    if (editingPlayerId === id) {

        editingPlayerId = null;

        form.reset();

        clearSelectedGame();

        setRegisterButton();

    }


    showMessage(
        "🗑️ Player deleted successfully!",
        "success"
    );

}


// ========================================
// CLEAR SELECTED GAME
// ========================================

function clearSelectedGame() {

    document
        .querySelectorAll(".game-card")
        .forEach(card => {

            card.classList.remove("selected");

        });

}


// ========================================
// RESET REGISTER BUTTON
// ========================================

function setRegisterButton() {

    const button =
        form.querySelector(".register-btn");


    if (button) {

        button.innerHTML =
            "<span>🚀</span> Register Player";

    }

}


// ========================================
// SHOW MESSAGE
// ========================================

function showMessage(message, type) {

    // Remove old message

    const oldMessage =
        document.querySelector(".custom-message");


    if (oldMessage) {

        oldMessage.remove();

    }


    // Create message

    const messageBox =
        document.createElement("div");


    messageBox.className =
        `custom-message ${type}`;


    messageBox.textContent =
        message;


    // Add to page

    document.body.appendChild(messageBox);


    // Remove automatically

    setTimeout(() => {

        messageBox.classList.add("hide");

        setTimeout(() => {

            messageBox.remove();

        }, 300);

    }, 2500);

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}


// ========================================
// INITIAL LOAD
// ========================================

renderPlayers();
