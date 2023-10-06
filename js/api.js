async function populateInfo(container) {
    // create display for info
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('infoContainer');

    try {
        // fetch data
        const apiUrl = `https://api.api-ninjas.com/v1/covid19?country=${container.id}`;
        const apiKey = 'lJRy4jThJ/02Qz8idYbcUg==9hlC0Mu9I8sctqgl';
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

        // treat response
        const [casesResponse, deathsResponse] = await Promise.all([fetchCases, fetchDeaths]);
        const [casesData, deathsData] = await Promise.all([casesResponse.json(), deathsResponse.json()]);
        if (casesData.length === 0 || deathsData.length === 0) throw 'País não encontrado'; // This api is absolutely horrible, doesn't respond with error status when it fails!
        const data = { ...deathsData[0], ...casesData[0] }; // This api is absolutely horrible, responds all its content in a single array element!
        let totalCases, totalDeaths;
        try {
            totalCases = parseInt(data.cases['2023-03-09'].total);
            totalDeaths = parseInt(data.deaths['2023-03-09'].total);
        } catch {
            throw 'Não há dados para 9 de Março de 2023';
        }

        // create title
        const countryName = document.createElement('h2');
        countryName.textContent = `País: ${container.id}`;
        infoContainer.appendChild(countryName);

        // create display of raw numbers
        const confirmedCases = document.createElement('p');
        confirmedCases.textContent = `Casos confirmados: ${totalCases.toLocaleString()}`;
        infoContainer.appendChild(confirmedCases);

        const deaths = document.createElement('p');
        deaths.textContent = `Mortes: ${totalDeaths.toLocaleString()}`;
        infoContainer.appendChild(deaths);

        // create percent display
        const percentDisplay = document.createElement('div');
        percentDisplay.insertAdjacentHTML('afterbegin', `<div class='percentLabels'><p>0%</p><p>10%</p></div>`);
        infoContainer.appendChild(percentDisplay);

        const percentBar = document.createElement('div');
        percentBar.classList.add('percentBar');
        percentDisplay.appendChild(percentBar);

        const percent = (totalDeaths / totalCases) * 100;

        const percentBarRed = document.createElement('div');
        percentBarRed.classList.add('percentBarRed');
        percentBarRed.style.width = `${percent * 10}%`;
        percentBar.appendChild(percentBarRed);

        const percentDescription = document.createElement('p');
        percentDescription.classList.add('percentDescription', 'percentDescription');
        percentDescription.textContent = `${percent.toFixed(2)}% mortalidade`;
        percentDisplay.appendChild(percentDescription);
    } catch (error) {
        console.error(error);
        infoContainer.innerHTML = `<p>Não foi possível receber os dados de api-ninjas.</p>`;
    } finally {
        // show it on page
        container.appendChild(infoContainer);
    }
}

const countryContainers = document.getElementsByClassName('container');
for (const container of countryContainers) {
    populateInfo(container);
}
