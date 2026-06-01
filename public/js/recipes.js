async function loadRecipes() {
    const recipeRes = await fetch("/api/recipes");
    const recipes = await recipeRes.json();

    const container = document.getElementById("recipes");
    container.innerHTML = "";

    for (const r of recipes) {
        const commentsRes = await fetch(`/api/comments/${r._id}`);
        const comments = await commentsRes.json();

        const avg = getAverageRating(comments);

        let starsHTML = "";
        if (avg !== null) {
            const rounded = Math.round(avg);
            starsHTML =
                `<div class="stars">
                    ${"★".repeat(rounded)}${"☆".repeat(5 - rounded)}
                    <span class="rating-text">(${avg.toFixed(1)})</span>
                </div>`;
        } else {
            starsHTML = `<div class="stars muted">No ratings yet</div>`;
        }

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${r.image}">
            <div class="title">${r.title}</div>

            ${starsHTML}

            <div class="section">
                <small>by ${r.username}</small>
            </div>
        `;

        card.onclick = () => {
            window.location.href = `/recipe.html?id=${r._id}`;
        };

        container.appendChild(card);
    }

    const recommendedContainer = document.getElementById("recommended");

    if (recommendedContainer) {
        recommendedContainer.innerHTML = "";

        const shuffled = [...recipes].sort(() => 0.5 - Math.random());
        const recommended = shuffled.slice(0, 3);

        recommended.forEach(r => {
            const card = document.createElement("div");
            card.className = "recommend-card";

            card.innerHTML = `
                <img src="${r.image}" alt="${r.title}">
                <div>${r.title}</div>
            `;

            card.onclick = () => {
                window.location.href = `/recipe.html?id=${r._id}`;
            };

            recommendedContainer.appendChild(card);
        });
    }
}
function getAverageRating(comments) {
    if (comments.length === 0) return null;
    const sum = comments.reduce((acc, c) => acc + c.rating, 0);
    return sum / comments.length;
}
loadRecipes();


