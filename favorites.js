document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("favoritesTableBody");
    const hadithTitleInput = document.getElementById("hadithTitle");
    const hadithReflectionInput = document.getElementById("hadithReflection");
    const addHadithButton = document.getElementById("addHadith");
  
    const editModal = document.getElementById("editModal");
    const closeModal = document.querySelector(".close");
    const editHadithTitle = document.getElementById("editHadithTitle");
    const editHadithReflection = document.getElementById("editHadithReflection");
    const saveEdit = document.getElementById("saveEdit");
  
    let editIndex = null;
  
    function loadFavorites() {
      tableBody.innerHTML = "";
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  
      favorites.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${item.title}</td>
          <td>${item.reflection}</td>
          <td>
            <button class="edit-btn" onclick="editFavorite(${index})">Edit</button>
            <button class="delete-btn" onclick="deleteFavorite(${index})">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    }
  
    addHadithButton.addEventListener("click", () => {
      const title = hadithTitleInput.value.trim();
      const reflection = hadithReflectionInput.value.trim();
  
      if (title && reflection) {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        favorites.push({ title, reflection });
        localStorage.setItem("favorites", JSON.stringify(favorites));
        hadithTitleInput.value = "";
        hadithReflectionInput.value = "";
        loadFavorites();
      } else {
        alert("Please enter both the Hadith title and reflection.");
      }
    });
  
    window.editFavorite = (index) => {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      if (!favorites[index]) return;
      editHadithTitle.value = favorites[index].title;
      editHadithReflection.value = favorites[index].reflection;
      editIndex = index;
      editModal.style.display = "flex";
    };
  
    saveEdit.addEventListener("click", () => {
      if (editIndex !== null) {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        favorites[editIndex].title = editHadithTitle.value;
        favorites[editIndex].reflection = editHadithReflection.value;
        localStorage.setItem("favorites", JSON.stringify(favorites));
        editModal.style.display = "none";
        loadFavorites();
      }
    });
  
    window.deleteFavorite = (index) => {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      favorites.splice(index, 1);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      loadFavorites();
    };
  
    closeModal.addEventListener("click", () => {
      editModal.style.display = "none";
    });
  
    loadFavorites();
  });
  