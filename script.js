document.addEventListener("DOMContentLoaded", function () {
    const favoriteButtons = document.querySelectorAll(".favorite-button");
    const favoriteSummary = document.getElementById("favorite-summary");
    const form = document.querySelector("form");

    const productCatalog = [
        "Country Sourdough",
        "Dark Rye Boule",
        "Sandwich and Dinner Breads",
        "Morning Pastries",
        "Cookies and Bars",
        "Seasonal Tarts and Hand Pies",
        "Everyday Cakes",
        "Custom Occasion Cakes",
        "Allergy Friendly Requests"
    ];

    const storageKeys = {
        favorites: "northStarFavorites",
        customerName: "northStarCustomerName"
    };

    const validationMessages = {
        name: "Please enter your full name using at least 2 characters.",
        email: "Please enter a valid email address so we can confirm your order.",
        pickupDate: "Please choose a pickup date.",
        details: "Please give us at least 10 characters of order details."
    };

    function getFavorites() {
        const saved = JSON.parse(localStorage.getItem(storageKeys.favorites)) || [];
        return saved.filter(function (product) {
            return productCatalog.includes(product);
        });
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

    function updateFavoriteButtons() {
        const favorites = getFavorites();
        favoriteButtons.forEach(function (button) {
            button.textContent = favorites.includes(button.dataset.product)
                ? "Remove Favorite"
                : "Save Favorite";
        });
    }

    function toggleFavorite(product) {
        if (!productCatalog.includes(product)) return;

        const favorites = getFavorites();
        const index = favorites.indexOf(product);

        if (index >= 0) {
            favorites.splice(index, 1);
        } else {
            favorites.push(product);
        }

        saveFavorites(favorites);
        updateFavoriteSummary();
        updateFavoriteButtons();
    }

    favoriteButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            toggleFavorite(button.dataset.product);
        });
    });

    updateFavoriteSummary();
    updateFavoriteButtons();

    if (form) {
        const nameInput = document.getElementById("full-name");
        const emailInput = document.getElementById("email");
        const pickupDateInput = document.getElementById("pickup-date");
        const detailsInput = document.getElementById("item-details");

        const savedName = localStorage.getItem(storageKeys.customerName);
        if (savedName && nameInput) {
            nameInput.value = savedName;
        }

        function showError(input, message) {
            input.setAttribute("aria-invalid", "true");
            let error = input.parentElement.querySelector(".error-message");

            if (!error) {
                error = document.createElement("span");
                error.className = "error-message";
                error.setAttribute("role", "alert");
                input.insertAdjacentElement("afterend", error);
            }

            error.textContent = message;
        }

        function clearErrors() {
            document.querySelectorAll(".error-message").forEach(function (error) {
                error.remove();
            });

            form.querySelectorAll("[aria-invalid='true']").forEach(function (field) {
                field.setAttribute("aria-invalid", "false");
            });
        }

        function validateForm() {
            clearErrors();
            let valid = true;
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
                showError(nameInput, validationMessages.name);
                valid = false;
            }

            if (!emailPattern.test(emailInput.value.trim())) {
                showError(emailInput, validationMessages.email);
                valid = false;
            }

            if (!pickupDateInput.value) {
                showError(pickupDateInput, validationMessages.pickupDate);
                valid = false;
            }

            if (detailsInput.value.trim().length < 10) {
                showError(detailsInput, validationMessages.details);
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
