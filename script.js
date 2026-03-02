const countryInput = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');


function showElement(element) {
    element.classList.remove('hidden');
}
function hideElement(element) {
    element.classList.add('hidden');
}


function clearResults() {
    countryInfo.innerHTML = '';
    borderingCountries.innerHTML = '';
    hideElement(errorMessage);
}

function showError(message) {
    errorMessage.textContent = message;
    showElement(errorMessage);
}


async function searchCountry(countryName) {
    const trimmedName = countryNae.trim();
    if (!trimmedName) {
        showError('Please enter a country name.');
        return;
    }

    
    clearResults();
    showElement(loadingSpinner);
    hideElement(countryInfo);
    hideElement(borderingCountries);

    try {
        
        const response = await fetch(`https://restcountries.com/v3.1/name/${trimmedName}`);
        if (!response.ok) {
            throw new Error('Country not found. Please check the name and try again.');
        }
        const data = await response.json();
        const country = data[0]; 

        
        const name = country.name.common;
        const capital = country.capital ? country.capital[0] : 'N/A';
        const population = country.population.toLocaleString(); 
        const region = country.region;
        const flag = country.flags.png || country.flags.svg;

        countryInfo.innerHTML = `
            <h2>${name}</h2>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Population:</strong> ${population}</p>
            <p><strong>Region:</strong> ${region}</p>
            <img src="${flag}" alt="${name} flag" style="max-width: 100px; border: 1px solid #ccc;">
        `;
        showElement(countryInfo);

        
        borderingCountries.innerHTML = ''; 
        if (country.borders && country.borders.length > 0) {
            
            const borderPromises = country.borders.map(code =>
                fetch(`https://restcountries.com/v3.1/alpha/${code}`).then(res => res.json())
            );
            const borderResults = await Promise.all(borderPromises);

            
            borderResults.forEach(result => {
                const borderCountry = result[0];
                const borderName = borderCountry.name.common;
                const borderFlag = borderCountry.flags.png || borderCountry.flags.svg;
                const borderItem = document.createElement('div');
                borderItem.classList.add('border-item'); 
                borderItem.innerHTML = `
                    <img src="${borderFlag}" alt="${borderName} flag" style="width: 30px; height: 20px; margin-right: 8px;">
                    <span>${borderName}</span>
                `;
                borderingCountries.appendChild(borderItem);
            });
            showElement(borderingCountries);
        } else {
            
            borderingCountries.innerHTML = '<p>No bordering countries.</p>';
            showElement(borderingCountries);
        }
    } catch (error) {
        
        showError(error.message);
    } finally {
        
        hideElement(loadingSpinner);
    }
}

searchBtn.addEventListener('click', () => {
    searchCountry(countryInput.value);
});


countryInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchCountry(countryInput.value);
    }
});

