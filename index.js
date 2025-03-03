document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const favoritesList = document.getElementById("favorites-list");
  const suggestionsList = document.getElementById("suggestions");
  const hadithBooks = document.getElementById("hadithBooks");
  const hadithDetails = document.getElementById("hadithDetails");

  // Sample hadith suggestions for autocomplete
  const suggestions = [
      "Hadith on Patience",
      "Hadith on Kindness",
      "Hadith on Charity",
      "Hadith on Prayers",
      "Hadith on Zakat",
      "Hadith about Prophet Muhammad",
      "Sahih Bukhari Hadiths",
      "Sahih Muslim Hadiths"
  ];

  // ✅ Autocomplete suggestions
  searchInput.addEventListener("input", function () {
      const query = this.value.toLowerCase();
      suggestionsList.innerHTML = "";

      if (!query) {
          suggestionsList.style.display = "none";
          return;
      }

      const filteredSuggestions = suggestions.filter(suggestion =>
          suggestion.toLowerCase().includes(query)
      );

      if (filteredSuggestions.length > 0) {
          suggestionsList.style.display = "block";
          filteredSuggestions.forEach(suggestion => {
              const listItem = document.createElement("li");
              listItem.textContent = suggestion;
              listItem.addEventListener("click", () => {
                  searchInput.value = suggestion;
                  suggestionsList.style.display = "none";
              });
              suggestionsList.appendChild(listItem);
          });
      } else {
          suggestionsList.style.display = "none";
      }
  });

  // ✅ Hide suggestions when clicking outside
  document.addEventListener("click", (event) => {
      if (!searchInput.contains(event.target) && !suggestionsList.contains(event.target)) {
          suggestionsList.style.display = "none";
      }
  });

  // ✅ Perform search and navigate to result.html
  searchButton.addEventListener("click", () => {
      const query = searchInput.value.trim();

      if (query) {
          localStorage.setItem("searchQuery", query);
          console.log("Navigating to result.html with query:", query);
          window.location.href = "result.html";
      } else {
          alert("Please enter a search term.");
      }
  });

  // ✅ Load and display favorite hadiths
  function loadFavorites() {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      favoritesList.innerHTML = "";

      if (favorites.length === 0) {
          favoritesList.innerHTML = "<p>No favorite hadiths added yet.</p>";
          return;
      }

      favorites.forEach(fav => {
          const listItem = document.createElement("li");
          listItem.innerHTML = `
              <span>${fav.hadithNumber}: ${fav.hadithText}</span>
              <button onclick="removeFavorite(${fav.hadithNumber})">Remove</button>
          `;
          favoritesList.appendChild(listItem);
      });
  }

  // ✅ Remove hadith from favorites
  window.removeFavorite = (hadithNumber) => {
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      favorites = favorites.filter(fav => fav.hadithNumber !== hadithNumber);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      loadFavorites();
  };

  loadFavorites(); // Load favorites on page load

  // ✅ Fetch Hadith Information on Click
  hadithBooks.addEventListener("click", async (event) => {
      event.preventDefault();
      if (event.target.tagName === "A") {
          const book = event.target.dataset.book;
          try {
              const response = await fetch(`https://api.sunnah.com/v1/collections/${book}`, {
                  headers: { "X-API-KEY": "$2y$10$OKcPUm4rlpk3kqUvHNGQO7GuNfqkOP1wiN2XBmHay4sAmaMdOW" }
              });
              const data = await response.json();
              hadithDetails.innerHTML = `<strong>${data.collection.title}</strong>: ${data.collection.description}`;
          } catch (error) {
              hadithDetails.innerHTML = "Error loading Hadith details.";
          }
      }
  });
});
