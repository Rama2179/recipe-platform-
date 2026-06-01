async function loadRecipe() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const res = await fetch(`/api/recipes/${id}`);
    const recipe = await res.json();
    
    const favRes = await fetch("/api/favorites");
    const favorites = await favRes.json();

    const container = document.getElementById("recipe");

    if (!recipe || recipe.error) {
        container.innerHTML = "Recipe not found";
        return;
    }
    let heart;
    if (!favorites){
    const favoriteIds = favorites.map(f => typeof f === "string" ? f : f._id);
    const isFavorited = favoriteIds.includes(recipe._id);
    heart = isFavorited ? "❤️" : "🤍";}
    else {heart ="🤍"; }
    const ingredientsList = recipe.ingredients || [];

    const stepsArray = recipe.instructions
        ? recipe.instructions.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean)
        : [];

    container.innerHTML = `
        <div class="recipe-card">
            <div class="title-row">
            <h1>${recipe.title}</h1>

            <button class="fav-btn" data-id="${recipe._id}">Favorite ${heart}</button> </div>

            <img src="${recipe.image}" class="recipe-image">

            <div class="info-grid">
                <div>⏱ Prep: ${recipe.prepTime} min</div>
                <div>🔥 Cook: ${recipe.cookTime} min</div>
                <div>⏳ Total: ${recipe.totalTime} min</div>
                <div>🍽 Servings: ${recipe.servings}</div>
            </div>

            <div class="section">
                <h3>🍅 Ingredients</h3>
                <ul>
                    ${ingredientsList.map(i => `<li>${i}</li>`).join("")}
                </ul>
            </div>

            <div class="section">
                <h3>👨‍🍳 Instructions</h3>
                <ol>
                    ${stepsArray.map(step => `<li>${step}</li>`).join("")}
                </ol>
            </div>

            <p class="author">by ${recipe.username}</p>

        </div>
    `;

    if (id) {
        document.getElementById("edit-btn").onclick = () => {
            window.location.href = `/edit-recipe.html?id=${id}`;
        };

        document.getElementById("comment-btn").onclick = () => {
            window.location.href = `/comments.html?id=${id}`;
        };
    }
}
document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("fav-btn")) {
        const id = e.target.dataset.id;

        const res = await fetch(`/api/favorites/${id}`, {
            method: "POST"
        });

        const data = await res.json();

        if (res.ok) {
            const updatedFavorites = data.favorites;

            const isFavorited = updatedFavorites.includes(id);

            e.target.textContent = isFavorited ? "Favorite ❤️" : "Favorite 🤍";
        } else {
            alert(data.error || "Failed");
        }
    }
});
if (window.location.pathname.includes("recipe.html")) {
    loadRecipe();
}