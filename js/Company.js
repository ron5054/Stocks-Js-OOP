import { Utility } from './Utility.js'

export class StockRenderer {
    constructor(symbol, containerElement) {
        this.symbol = symbol
        this.containerElement = containerElement
    }

    async renderCompany() {
        try {
            const stock = await Utility.getApiData(this.symbol, 'stockData')

            const strHTML = `<header>
                            <img class="stock-img" src="${stock.profile.image}" alt="">
                            <a class="stock-link" href="${stock.profile.website}" target="_blank ">
                                <h1 class="stock-name">${stock.profile.companyName} (${stock.symbol})</h1>
                            </a>
                         </header>
                         <div>
                            <span class="stock-price"></span>
                            <span class="stock-change"></span>
                         </div>
                         <p class="stock-desc">${stock.profile.description}</p>
                         <div>
                            <canvas id="myChart"></canvas>
                         </div>`

            this.containerElement.innerHTML = strHTML

            const elPrice = this.containerElement.querySelector('.stock-price')
            const elChange = this.containerElement.querySelector('.stock-change')

            if (stock.profile.price) elPrice.innerText = `stock price: ${stock.profile.price}$`

            if (stock.profile.changesPercentage !== '0') elChange.innerText = `(${stock.profile.changesPercentage.substr(0, 5)}%)`
            else elChange.innerText = 'Delisted'

            elChange.style.color = stock.profile.changesPercentage > 0 ? 'green' : 'red'

            if (!window.location.href.includes('compare')) document.title = `${stock.profile.companyName} (${stock.symbol})`
            else document.title = `Compare stocks`
        } catch (error) {
            console.error('Error fetching or rendering data:', error)
        }
    }

    async renderChart() {
        try {
            const history = await Utility.getApiData(this.symbol, 'stockHistory')

            const labels = history.historical.map(entry => entry.date).slice(0, 365).reverse()
            const data = history.historical.map(entry => entry.close).slice(0, 365).reverse()
            const ctx = this.containerElement.querySelector('#myChart')

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Stock Price',
                        data: data,
                        borderWidth: 1,
                        fill: 'origin',
                        backgroundColor: 'rgb(39, 144, 147)'
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            })
        } catch (error) {
            console.error('Error fetching or rendering data:', error)
        }
    }
}