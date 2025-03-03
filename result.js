document.addEventListener("DOMContentLoaded", async () => {
    const query = localStorage.getItem("searchQuery");
    const hadithContainer = document.getElementById("hadith-container");
    const noResultsMessage = document.getElementById("no-results-message");
    const apiKey = "$2y$10$OKcPUm4rlpk3kqUvHNGQO7GuNfqkOP1wiN2XBmHay4sAmaMdOW"; // ✅ Store API Key in Variable

    if (!query) {
        noResultsMessage.textContent = "No search query provided.";
        noResultsMessage.style.display = "block";
        return;
    }

    console.log("🔍 Fetching hadiths for query:", query);

    try {
        // ✅ Ensure API key exists
        if (!apiKey) {
            throw new Error("❌ API key is missing!");
        }

        const response = await fetch(`https://api.sunnah.com/v1/hadiths/search/${encodeURIComponent(query)}`, {
            headers: { "X-API-KEY": apiKey }
        });

        console.log("🔹 Response Status:", response.status);
        console.log("🔹 Response Headers:", response.headers);

        if (!response.ok) {
            throw new Error(`❌ HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ API Response:", data);

        hadithContainer.innerHTML = "";

        if (!data.hadiths || data.hadiths.length === 0) {
            noResultsMessage.textContent = "⚠️ No hadiths found for your search.";
            noResultsMessage.style.display = "block";
        } else {
            noResultsMessage.style.display = "none";
            data.hadiths.forEach(hadith => {
                const hadithElement = document.createElement("div");
                hadithElement.classList.add("hadith");
                hadithElement.innerHTML = `
                    <h3>${hadith.bookName} - Hadith ${hadith.hadithNumber}</h3>
                    <p>${hadith.hadithText}</p>
                    <button onclick="addFavorite(${hadith.hadithNumber}, '${hadith.hadithText.replace(/'/g, "&apos;")}')">
                        Add to Favorites
                    </button>
                `;
                hadithContainer.appendChild(hadithElement);
            });
        }
    } catch (error) {
        console.error("❌ Error fetching Hadiths:", error);
        noResultsMessage.textContent = "⚠️ Error retrieving hadiths. Check API key, network, or CORS settings.";
        noResultsMessage.style.display = "block";
    }
});

// ✅ Add Hadith to Favorites
function addFavorite(hadithNumber, hadithText) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.some(fav => fav.hadithNumber === hadithNumber)) {
        favorites.push({ hadithNumber, hadithText });
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert("✅ Added to Favorites!");
    }
}
