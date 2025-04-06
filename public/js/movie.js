document.addEventListener("DOMContentLoaded", () => {
    // --- Setup: Default Month (set to previous month) ---
    const now = new Date();
    let currentMonth = now.getMonth() - 1;
    let currentYear = now.getFullYear();
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear -= 1;
    }
    
    // --- Sorting Option (default: release) ---
    let sortOption = "release";
    const sortSelect = document.getElementById("sort-select");
    sortSelect.addEventListener("change", () => {
      sortOption = sortSelect.value;
      renderCurrentMonth();
    });
    
    // --- TMDb Configuration ---
    const TMDB_API_URL = "https://api.themoviedb.org/3/movie/upcoming";
    const TMDB_READ_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNWFhYTllZmZhZWUxNDFiYTg1N2E3NGRiYzdhOTE4MiIsIm5iZiI6MTc0MzQ1NzY3Mi4xNDMwMDAxLCJzdWIiOiI2N2ViMGQ4OGQ5OTgxZmRhMTg3YTk2YTQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.XnutMDOkF3uzfDVWWhMVU5cpKA7lrnbDhq-W0Jjch9Q";
    const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
    
    // --- DOM Elements ---
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const monthTitleEl = document.getElementById("current-month-title");
    const moviesContainer = document.getElementById("movies-container");
    
    let allMovies = [];
    
    // --- Fetch Upcoming Movies ---
    function fetchAllUpcomingMovies() {
      return fetchPage(1).then(firstPage => {
        const totalPages = firstPage.total_pages;
        let promises = [];
        for (let page = 2; page <= totalPages; page++) {
          promises.push(fetchPage(page));
        }
        return Promise.all(promises).then(pages => {
          let movies = firstPage.results;
          pages.forEach(pageData => {
            movies = movies.concat(pageData.results);
          });
          return movies;
        });
      });
    }
    
    function fetchPage(page) {
      return fetch(`${TMDB_API_URL}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }).then(res => res.json());
    }
    
    // --- Render Movies for Current Month ---
    function renderCurrentMonth() {
      moviesContainer.innerHTML = "";
      const dateObj = new Date(currentYear, currentMonth, 1);
      const monthTitle = dateObj.toLocaleString("en-US", { month: "long", year: "numeric" });
      monthTitleEl.textContent = monthTitle;
    
      const startDate = new Date(currentYear, currentMonth, 1);
      const endDate = new Date(currentYear, currentMonth + 1, 0);
    
      let filtered = allMovies.filter(movie => {
        if (!movie.release_date) return false;
        const rd = new Date(movie.release_date);
        return rd >= startDate && rd <= endDate;
      });
    
      if (filtered.length === 0) {
        moviesContainer.innerHTML = `<p>No movies found for ${monthTitle}.</p>`;
        return;
      }
      
      // Sort movies based on user selection
      if (sortOption === "popularity") {
        filtered.sort((a, b) => b.popularity - a.popularity);
      } else {
        filtered.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
      }
    
      // Remove duplicates if any
      let newFiltered = [];
      for (let i = 0; i < filtered.length; i++) {
        let movie = filtered[i];
        if (i < filtered.length - 1 && movie.id === filtered[i + 1].id) continue;
        newFiltered.push(movie);
      }
      
      newFiltered.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.style.position = "relative";
    
        // --- Heart Icon ---
        const heartIcon = document.createElement("span");
        heartIcon.classList.add("heart-icon");
        heartIcon.textContent = "♡";
        heartIcon.setAttribute("data-hover", "want to watch?");
        heartIcon.addEventListener("click", e => {
          e.stopPropagation();
          if (heartIcon.classList.contains("favorited")) {
            heartIcon.classList.remove("favorited");
            heartIcon.textContent = "♡";
            heartIcon.setAttribute("data-hover", "want to watch?");
          } else {
            heartIcon.classList.add("favorited");
            heartIcon.textContent = "♥";
            heartIcon.setAttribute("data-hover", "remove?");
          }
        });
        movieCard.appendChild(heartIcon);
    
        // --- Thumbs Up Icon ---
        const thumbsIcon = document.createElement("span");
        thumbsIcon.classList.add("thumbs-icon");
        thumbsIcon.textContent = "👍";
        thumbsIcon.setAttribute("data-hover", "like?");
        thumbsIcon.addEventListener("click", e => {
          e.stopPropagation();
          if (thumbsIcon.classList.contains("liked")) {
            thumbsIcon.classList.remove("liked");
            thumbsIcon.setAttribute("data-hover", "like?");
          } else {
            thumbsIcon.classList.add("liked");
            thumbsIcon.setAttribute("data-hover", "unlike?");
          }
        });
        movieCard.appendChild(thumbsIcon);
    
        // --- Poster Image ---
        const posterImg = document.createElement("img");
        posterImg.classList.add("movie-poster");
        if (movie.poster_path) {
          posterImg.src = POSTER_BASE_URL + movie.poster_path;
          posterImg.alt = movie.title;
        } else {
          posterImg.src = "https://via.placeholder.com/500x300?text=No+Poster";
          posterImg.alt = "No poster available";
        }
        movieCard.appendChild(posterImg);
    
        // --- Movie Info ---
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("movie-info");
        const titleEl = document.createElement("p");
        titleEl.classList.add("movie-title");
        titleEl.textContent = movie.title;
        const releaseDate = new Date(movie.release_date).toLocaleDateString("en-US", {
          year: "numeric", month: "long", day: "numeric"
        });
        const releaseEl = document.createElement("p");
        releaseEl.classList.add("movie-release");
        releaseEl.textContent = `Release Date: ${releaseDate}`;
        const overviewEl = document.createElement("p");
        overviewEl.classList.add("movie-overview");
        overviewEl.textContent = movie.overview && movie.overview.length > 150 ?
                                  movie.overview.slice(0, 150) + "..." :
                                  movie.overview || "No description available.";
        infoDiv.appendChild(titleEl);
        infoDiv.appendChild(releaseEl);
        infoDiv.appendChild(overviewEl);
        movieCard.appendChild(infoDiv);
        
        moviesContainer.appendChild(movieCard);
        
        // --- Open Modal on Click ---
        movieCard.addEventListener("click", () => openModal(movie));
      });
    }
    
    // --- Modal Functions ---
    function openModal(movie) {
      const modal = document.createElement("div");
      modal.classList.add("modal");
      modal.addEventListener("click", e => {
        if (e.target === modal) closeModal(modal);
      });
      const modalContent = document.createElement("div");
      modalContent.classList.add("modal-content");
      
      const closeButton = document.createElement("button");
      closeButton.classList.add("modal-close");
      closeButton.textContent = "X";
      closeButton.addEventListener("click", () => closeModal(modal));
      modalContent.appendChild(closeButton);
      
      const titleEl = document.createElement("h2");
      titleEl.textContent = movie.title;
      modalContent.appendChild(titleEl);
      
      const posterImg = document.createElement("img");
      posterImg.classList.add("movie-poster");
      if (movie.poster_path) {
        posterImg.src = POSTER_BASE_URL + movie.poster_path;
        posterImg.alt = movie.title;
      } else {
        posterImg.src = "https://via.placeholder.com/500x300?text=No+Poster";
        posterImg.alt = "No poster available";
      }
      modalContent.appendChild(posterImg);
      
      const releaseDate = new Date(movie.release_date).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
      });
      const releaseEl = document.createElement("p");
      releaseEl.textContent = `Release Date: ${releaseDate}`;
      modalContent.appendChild(releaseEl);
      
      const overviewEl = document.createElement("p");
      overviewEl.textContent = movie.overview || "No description available.";
      modalContent.appendChild(overviewEl);
      
      // Additional Info Placeholders: Genre, Budget, Box Office, and Cast
      const additionalInfoContainer = document.createElement("div");
      additionalInfoContainer.classList.add("additional-info");
      
      const genreEl = document.createElement("p");
      genreEl.textContent = "Genre: Loading...";
      additionalInfoContainer.appendChild(genreEl);
      
      // We'll fetch budget and revenue along with genre
      fetch(`https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`, {
        headers: {
          Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(movieDetails => {
          // Genre info
          if (movieDetails.genres) {
            const genres = movieDetails.genres.map(g => g.name).join(", ");
            genreEl.textContent = `Genre: ${genres}`;
          } else {
            genreEl.textContent = "Genre: N/A";
          }
          // Budget info
          const budget = movieDetails.budget;
          const budgetEl = document.createElement("p");
          if (budget && budget > 0) {
            budgetEl.textContent = `Budget: $${budget.toLocaleString()}`;
          } else {
            budgetEl.textContent = "Budget: N/A";
          }
          modalContent.appendChild(budgetEl);
          // Box Office (Revenue) info
          const revenue = movieDetails.revenue;
          const revenueEl = document.createElement("p");
          if (revenue && revenue > 0) {
            revenueEl.textContent = `Box Office: $${revenue.toLocaleString()}`;
          } else {
            revenueEl.textContent = "Box Office: N/A";
          }
          modalContent.appendChild(revenueEl);
        })
        .catch(err => {
          console.error("Error fetching movie details:", err);
          genreEl.textContent = "Genre: N/A";
        });
      
      additionalInfoContainer.appendChild(genreEl);
      
      const castEl = document.createElement("p");
      castEl.textContent = "Cast: Loading...";
      additionalInfoContainer.appendChild(castEl);
      modalContent.appendChild(additionalInfoContainer);
      
      // Fetch Cast Info (separate fetch)
      fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?language=en-US`, {
        headers: {
          Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(credits => {
          if (credits.cast && credits.cast.length > 0) {
            const castNames = credits.cast.slice(0, 5).map(member => member.name).join(", ");
            castEl.textContent = `Cast: ${castNames}`;
          } else {
            castEl.textContent = "Cast: N/A";
          }
        })
        .catch(err => {
          console.error("Error fetching cast information:", err);
          castEl.textContent = "Cast: N/A";
        });
      
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
    }
    
    function closeModal(modal) {
      document.body.removeChild(modal);
    }
    
    // --- Navigation Button Listeners ---
    prevBtn.addEventListener("click", () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCurrentMonth();
    });
    nextBtn.addEventListener("click", () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCurrentMonth();
    });
    
    // --- Fetch Movies and Initialize ---
    fetchAllUpcomingMovies()
      .then(movies => {
        // Filter for English and popular movies
        const englishMovies = movies.filter(m => m.original_language === "en");
        const bigStudioMovies = englishMovies.filter(m => m.popularity >= 6);
        allMovies = bigStudioMovies;
        renderCurrentMonth();
      })
      .catch(err => {
        console.error("Error fetching upcoming movies:", err);
        moviesContainer.innerHTML = "<p>Failed to load movie data.</p>";
      });
  });