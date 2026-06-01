const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
    alert("No recipe ID found");
    window.location.href = "/recipes.html";
}

async function loadRecipe() {
    const res = await fetch(`/api/recipes/${id}`);
    const recipe = await res.json();

    if (!recipe || recipe.error) {
        document.body.innerHTML = "Recipe not found";
        return;
    }

    document.querySelector('[name="title"]').value = recipe.title;
    document.querySelector('[name="prepTime"]').value = recipe.prepTime;
    document.querySelector('[name="cookTime"]').value = recipe.cookTime;
    document.querySelector('[name="servings"]').value = recipe.servings;

    document.querySelector('[name="ingredients"]').value =
        (recipe.ingredients || []).join("\n");

    document.querySelector('[name="instructions"]').value =
        recipe.instructions;

    document.querySelector('[name="image"]').value =
        recipe.image;
}

loadRecipe();


document.getElementById("recipe-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedRecipe = {
        title: document.querySelector('[name="title"]').value,
        prepTime: Number(document.querySelector('[name="prepTime"]').value),
        cookTime: Number(document.querySelector('[name="cookTime"]').value),
        servings: document.querySelector('[name="servings"]').value,
        ingredients: document.querySelector('[name="ingredients"]').value.split("\n").map(i => i.trim()).filter(Boolean),
        instructions: document.querySelector('[name="instructions"]').value,
        image: document.querySelector('[name="image"]').value
    };

    const res = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedRecipe)
    });

    if (res.ok) {
        window.location.href = `/recipe.html?id=${id}`;
    } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to update recipe");
        return;
    }
});63