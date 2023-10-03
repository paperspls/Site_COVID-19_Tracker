const apiKey = 'lJRy4jThJ/02Qz8idYbcUg==9hlC0Mu9I8sctqgl';

async function fetchData(container) {
    const apiUrl = `https://api.api-ninjas.com/v1/covid19?country=${container.id}`;
    let data;
    try {
        const fetchCases = fetch(apiUrl, {
            method: 'GET',
            headers: { 'X-Api-Key': apiKey },
            contentType: 'application/json',
        });
        const fetchDeaths = fetch(apiUrl + '&type=deaths', {
            method: 'GET',
            headers: { 'X-Api-Key': apiKey },
            contentType: 'application/json',
        });

        const [casesResponse, deathsResponse] = await Promise.all([fetchCases, fetchDeaths]);
        const casesData = await casesResponse.json();
        const deathsData = await deathsResponse.json();
        data = { ...deathsData[0], ...casesData[0] };

        const card = document.createElement('div');
        card.classList.add('card');

        const countryName = document.createElement('h2');
        countryName.textContent = `País: ${data.country}`;

        const confirmedCases = document.createElement('p');
        const totalCases = parseInt(data.cases['2023-03-09'].total);
        confirmedCases.textContent = `Casos Confirmados: ${totalCases.toLocaleString()}`;

        const deaths = document.createElement('p');
        const totalDeaths = parseInt(data.deaths['2023-03-09'].total);
        deaths.textContent = `Mortes: ${totalDeaths.toLocaleString()}`;

        const progressBarContainer = document.createElement('div');
        progressBarContainer.classList.add('progress-bar-container');

        const fraction = (totalDeaths / totalCases) * 100;

        const progressBarBlue = document.createElement('div');
        progressBarBlue.classList.add('progress-bar-blue');
        progressBarBlue.style.width = `${100 - fraction}%`;

        const progressBarRed = document.createElement('div');
        progressBarRed.classList.add('progress-bar');
        progressBarRed.style.width = `${fraction}%`;

        progressBarContainer.appendChild(progressBarBlue);
        progressBarContainer.appendChild(progressBarRed);

        const legendDescription = document.createElement('span');
        legendDescription.innerHTML = '<span class="legend-text-red">Mortes</span> / <span class="legend-text-blue">Casos Confirmados</span>';

        card.appendChild(countryName);
        card.appendChild(confirmedCases);
        card.appendChild(deaths);
        card.appendChild(progressBarContainer);
        card.appendChild(legendDescription);        

        container.appendChild(card);
    } catch (error) {
        console.error('Erro na requisição:', error);
        return;
    }
}

const countryContainers = document.getElementsByClassName('container');
for (const container of countryContainers) {
    fetchData(container);
}
