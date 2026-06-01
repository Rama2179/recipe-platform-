document.querySelector("form").addEventListener("submit", function (e) {
    const inputs = this.querySelectorAll("input, textarea");

    for (let input of inputs) {
        if (!input.value.trim()) {
            alert("Please fill in all fields");
            e.preventDefault();
            return;
        }
    }
});
function setDefaultImage() {
    const input = document.getElementById("imageInput");
    input.value = "https://png.pngtree.com/png-vector/20260114/ourlarge/pngtree-chef-hat-in-cartoon-style-isolated-vector-png-image_18494610.webp";
}