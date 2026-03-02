const countryInfo = document.getElementById("country-info");
const bordersContainer = document.getElementById("bordering-countries"); 
const input = document.getElementById("country-input");
const button = document.getElementById("search-btn");
const spinner = document.getElementById("loading-spinner"); 
const errorMessage = document.getElementById("error-message"); 


button.addEventListener("click", async () => {
  await searchCountry(input.value.trim());
});

input.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    await searchCountry(input.value.trim());
  }
});

async function searchCountry(countryName) {
  if (!countryName) return;

  
  button.disabled = true;
  showLoading();
  errorMessage.innerHTML = ""; 

  
  countryInfo.innerHTML = "";
  bordersContainer.innerHTML = "";

  try {
    
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`
    );

    if (!response.ok) {
      throw new Error(response.status === 404 ? "Country not found" : "Something went wrong");
    }

    const data = await response.json();
    const country = data[0];

    
    countryInfo.innerHTML = `
      <h2>${country.name.common}</h2>
      <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Region:</strong> ${country.region}</p>
      <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="200">
    `;

    
    if (country.borders && country.borders.length > 0) {
      const borderCodes = country.borders;
      const borderPromises = borderCodes.map(code =>
        fetch(`https://restcountries.com/v3.1/alpha/${code}`).then(res => res.json())
      );

      const bordersData = await Promise.all(borderPromises);
      
    
      bordersContainer.innerHTML = bordersData.map(borderData => {
        const neighbor = borderData[0];
        return `
          <div class="border-country">
            <p>${neighbor.name.common}</p>
            <img src="${neighbor.flags.svg}" alt="Flag of ${neighbor.name.common}" width="100">
          </div>
        `;
      }).join('');
    } else {
      bordersContainer.innerHTML = "<p>No bordering countries.</p>";
    }

  } catch (error) {
    errorMessage.innerHTML = `<p style="color:red;">${error.message}</p>`;
  } finally {
    
    button.disabled = false;
    hideLoading();
  }
}

function showLoading() {
  spinner.style.display = "block";
  // Optional: announce to screen readers
  spinner.setAttribute('aria-live', 'polite');
}

function hideLoading() {
  spinner.style.display = "none";
}
        
