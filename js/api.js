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
        
        const [casesResponse, deathsResponse] = await Promise.all([fetchCases, fetchDeaths])
        const casesData = await casesResponse.json();
        const deathsData = await deathsResponse.json();
        data = { ...deathsData[0], ...casesData[0] };
    } catch (error) {
        console.error('Erro na requisição:', error);
        return;
    }

    const card = document.createElement('div');
    card.classList.add('card');

    const countryName = document.createElement('h2');
    countryName.textContent = `País: ${data.country}`;

    const confirmedCases = document.createElement('p');
    confirmedCases.textContent = `Casos Confirmados: ${parseInt(data.cases['2023-03-09'].total).toLocaleString()}`;

    const deaths = document.createElement('p');
    deaths.textContent = `Mortes: ${parseInt(data.deaths['2023-03-09'].total).toLocaleString()}`;

    card.appendChild(countryName);
    card.appendChild(confirmedCases);
    card.appendChild(deaths);

    container.appendChild(card);
}

const countryContainers = document.getElementsByClassName('container');
for (const container of countryContainers) {
    fetchData(container);
}
