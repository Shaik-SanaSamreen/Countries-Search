document.addEventListener('DOMContentLoaded', () => {
    const countriesContainer = document.getElementById('countriesContainer');
    const searchInput = document.getElementById('searchInput');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');

    let allCountries = []; // Store all fetched countries

    // Function to fetch country data from the API
    const fetchCountries = async () => {
        loadingSpinner.classList.remove('d-none'); // Show spinner
        errorMessage.classList.add('d-none'); // Hide any previous error messages
        try {
            // Updated API URL to include 'fields' query parameter as required by the API
            // We request only the fields necessary for our application to reduce payload size.
            const response = await fetch('https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            allCountries = data; // Store all countries
            displayCountries(allCountries); // Display all countries initially
        } catch (error) {
            console.error('Error fetching countries:', error);
            errorMessage.classList.remove('d-none'); // Show error message
            countriesContainer.innerHTML = ''; // Clear any partial content
        } finally {
            loadingSpinner.classList.add('d-none'); // Hide spinner
        }
    };

    // Function to create and display country cards
    const displayCountries = (countries) => {
        countriesContainer.innerHTML = ''; // Clear previous content

        if (countries.length === 0) {
            countriesContainer.innerHTML = '<div class="col-12 text-center text-muted">No countries found matching your search.</div>';
            return;
        }

        countries.forEach(country => {
            const countryCard = document.createElement('div');
            countryCard.classList.add('col'); // Bootstrap column for grid layout

            // Safely get common name, fallback to official name
            const commonName = country.name?.common || country.name?.official || 'N/A';
            // Safely get population, format with commas
            const population = country.population ? country.population.toLocaleString() : 'N/A';
            // Safely get region
            const region = country.region || 'N/A';
            // Safely get capital, join if multiple
            const capital = country.capital && country.capital.length > 0 ? country.capital.join(', ') : 'N/A';
            // Safely get flag URL, fallback to placeholder if not available
            const flagUrl = country.flags?.png || country.flags?.svg || 'https://placehold.co/300x150/E0E0E0/555555?text=No+Flag';
            const flagAlt = country.flags?.alt || `${commonName} flag`;

            countryCard.innerHTML = `
                <div class="card h-100 shadow-sm country-card">
                    <img src="${flagUrl}" class="card-img-top" alt="${flagAlt}" onerror="this.onerror=null;this.src='https://placehold.co/300x150/E0E0E0/555555?text=Flag+Not+Available';">
                    <div class="card-body">
                        <h5 class="card-title text-primary fw-bold mb-3">${commonName}</h5>
                        <p class="card-text mb-1"><strong class="text-secondary">Population:</strong> ${population}</p>
                        <p class="card-text mb-1"><strong class="text-secondary">Region:</strong> ${region}</p>
                        <p class="card-text"><strong class="text-secondary">Capital:</strong> ${capital}</p>
                    </div>
                </div>
            `;
            countriesContainer.appendChild(countryCard);
        });
    };

    // Event listener for search input
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredCountries = allCountries.filter(country => {
            const commonName = country.name?.common?.toLowerCase() || '';
            const officialName = country.name?.official?.toLowerCase() || '';
            const capital = country.capital && country.capital.length > 0 ? country.capital.join(', ').toLowerCase() : '';
            const region = country.region?.toLowerCase() || '';

            return commonName.includes(searchTerm) ||
                   officialName.includes(searchTerm) ||
                   capital.includes(searchTerm) ||
                   region.includes(searchTerm);
        });
        displayCountries(filteredCountries);
    });

    // Initial fetch of countries when the page loads
    fetchCountries();
});
