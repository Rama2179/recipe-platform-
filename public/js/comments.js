const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");
let selectedRating = 0;
let sessionUser = null;

async function getSession() {
    const res = await fetch("/api/users/profile");
    const data = await res.json();
    if (!data.error) {
        sessionUser = data.name;
    }
}

async function loadRecipeInfo() {
    if (!recipeId) {
        document.getElementById("recipe-info").innerHTML = "<p>No recipe selected.</p>";
        return;
    }
    const res = await fetch("/api/recipes");
    const data = await res.json();
    const recipe = data.find(r => String(r._id) === String(recipeId));
    if (recipe) {
        document.getElementById("recipe-info").innerHTML =
            `<h2 style="text-align:center;">Recipe: <a href="/recipe.html?id=${recipeId}">${recipe.title}</a></h2>`;
    }
}

document.querySelectorAll(".star").forEach(star => {
    star.addEventListener("click", () => {
        selectedRating = parseInt(star.getAttribute("data-val"));
        updateStars();
    });
    star.addEventListener("mouseover", () => {
        highlightStars(parseInt(star.getAttribute("data-val")));
    });
    star.addEventListener("mouseout", () => {
        updateStars();
    });
});

function highlightStars(val) {
    document.querySelectorAll(".star").forEach(s => {
        s.classList.toggle("active", parseInt(s.getAttribute("data-val")) <= val);
    });
}

function updateStars() {
    highlightStars(selectedRating);
}

async function loadComments() {
    if (!recipeId) return;
    const res = await fetch(`/api/comments/${recipeId}`);
    const comments = await res.json();
    const list = document.getElementById("comments-list");

    if (!comments.length) {
        list.innerHTML = "<p style='text-align:center;color:#888;'>No reviews yet. Be the first!</p>";
        return;
    }

    const avg = (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1);
    list.innerHTML = `<p class="avg-rating">Average Rating: <strong>${avg} / 5</strong> (${comments.length} review${comments.length !== 1 ? "s" : ""})</p>`;

    comments.forEach(c => {
        const card = document.createElement("div");
        card.className = "comment-card";
        const stars = "★".repeat(c.rating) + "☆".repeat(5 - c.rating);
        const date = new Date(c.createdAt).toLocaleDateString();
        const deleteBtn = sessionUser && sessionUser === c.username
            ? `<button class="delete-btn" onclick="deleteComment('${c._id}')">Delete</button>`
            : "";
        card.innerHTML = `
            <div class="comment-header">
                <span class="comment-user">${c.username}</span>
                <span class="comment-stars">${stars}</span>
                <span class="comment-date">${date}</span>
            </div>
            <div class="comment-body">${c.body}</div>
            ${deleteBtn}
        `;
        list.appendChild(card);
    });
}

async function submitComment() {
    const msg = document.getElementById("form-msg");

    if (!sessionUser) {
        msg.textContent = "You must be logged in to leave a comment.";
        return;
    }

    const body = document.getElementById("comment-body").value.trim();
    if (!body || selectedRating === 0) {
        msg.textContent = "Fill in all fields and select a rating.";
        return;
    }

    const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId, body, rating: selectedRating })
    });

    const data = await res.json();
    if (data.success) {
        msg.textContent = "";
        document.getElementById("comment-body").value = "";
        selectedRating = 0;
        updateStars();
        loadComments();
    } else {
        msg.textContent = data.error || "Error submitting.";
    }
}

async function deleteComment(id) {
    const res = await fetch(`/api/comments/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    if (data.success) {
        loadComments();
    } else {
        alert(data.error || "Could not delete.");
    }
}

getSession().then(() => {
    const display = document.getElementById("username-display");
    if (display) {
        display.textContent = sessionUser ? `Commenting as: ${sessionUser}` : "Login to leave a comment.";
    }
});

loadRecipeInfo();
loadComments();
