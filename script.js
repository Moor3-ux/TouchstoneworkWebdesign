document.addEventListener("DOMContentLoaded", function () {
    const favoriteButtons = document.querySelectorAll(".favorite-button");
    const favoriteSummary = document.getElementById("favorite-summary");
    const form = document.querySelector("form");

    const productNames = ["Country Sourdough", "Dark Rye Boule", "Morning Pastries"];
    const storageKeys = {
        favorites: "northStarFavorites",
        customerName: "northStarCustomerName"
    };

    function getFavorites() {
        return JSON.parse(localStorage.getItem(storageKeys.favorites)) || [];
    }

    function saveFavorites(favorites) {
        localStorage.setItem(storageKeys.favorites, JSON.stringify(favorites));
    }

    function updateFavoriteSummary() {
        if (!favoriteSummary) return;
        const favorites = getFavorites();
        favoriteSummary.textContent = favorites.length
            ? "Saved favorites: " + favorites.join(", ")
            : "You have not saved any bakery favorites yet.";
    }

    function toggleFavorite(product) {
        const favorites = getFavorites();
        const index = favorites.indexOf(product);
        if (index >= 0) {
            favorites.splice(index, 1);
        } else {
            favorites.push(product);
        }
        saveFavorites(favorites);
        updateFavoriteSummary();
    }

    favoriteButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            toggleFavorite(button.dataset.product);
            button.textContent = getFavorites().includes(button.dataset.product)
                ? "Remove Favorite"
                : "Save Favorite";
        });
    });

    updateFavoriteSummary();

    if (form) {
        const nameInput = document.getElementById("full-name");
        const emailInput = document.getElementById("email");
        const detailsInput = document.getElementById("item-details");

        const savedName = localStorage.getItem(storageKeys.customerName);
        if (savedName && nameInput) nameInput.value = savedName;

        function showError(input, message) {
            let error = input.parentElement.querySelector(".error-message");
            if (!error) {
                error = document.createElement("span");
                error.className = "error-message";
                input.insertAdjacentElement("afterend", error);
            }
            error.textContent = message;
        }

        function clearErrors() {
            document.querySelectorAll(".error-message").forEach(function (error) {
                error.remove();
            });
        }

        function validateForm() {
            clearErrors();
            let valid = true;

            if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
                showError(nameInput, "Please enter your full name using at least 2 characters.");
                valid = false;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                showError(emailInput, "Please enter a valid email address so we can confirm your order.");
                valid = false;
            }

            if (detailsInput.value.trim().length < 10) {
                showError(detailsInput, "Please give us at least 10 characters of order details.");
                valid = false;
            }

            return valid;
        }

        nameInput.addEventListener("input", function () {
            localStorage.setItem(storageKeys.customerName, nameInput.value);
        });

        form.addEventListener("submit", function (event) {
            if (!validateForm()) {
                event.preventDefault();
            }
        });
    }
});
