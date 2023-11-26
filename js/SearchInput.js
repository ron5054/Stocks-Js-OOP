import { Utility } from './Utility.js'

export class SearchInput {
    constructor(containerElement) {
        this.containerElement = containerElement
        this.render()
        this.debouncedSearchStocks = Utility.debounce(this.searchStocks, 500).bind(this)
    }

    render() {
        const searchInput = document.createElement('input')
        searchInput.classList.add('search-input')
        searchInput.type = 'text'
        searchInput.placeholder = 'Search stocks'
        this.containerElement.appendChild(searchInput)
        searchInput.addEventListener('input', event => {
            this.debouncedSearchStocks(event)
        })

        const query = new URLSearchParams(window.location.search).get('query')
        if (query) {
            searchInput.value = query
            this.searchStocks({ target: { value: query } })
        }
    }

    async searchStocks(event) {
        const searchTerm = event.target.value
        const englishLettersRegex = /^[A-Za-z]+$/

        if (!englishLettersRegex.test(searchTerm) || !searchTerm) return

        this.updateUrl(searchTerm)

        try {
            const stocksList = await Utility.getApiData(searchTerm, 'stocksList')
            const symbolsStr = this.getSymbolsStr(stocksList)

            const { companyProfiles } = await Utility.getApiData(symbolsStr, 'stockData')

            if (this.onSearchCallback) {
                this.onSearchCallback({ stocksList, companyProfiles, searchTerm })
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    onSearch(callback) {
        this.onSearchCallback = callback
    }

    updateUrl(searchQuery) {
        var currentUrl = new URL(window.location.href)

        currentUrl.searchParams.set('query', searchQuery)

        window.history.replaceState({}, '', currentUrl.href)
    }

    getSymbolsStr(stocksList) {
        const symbolArr = stocksList.map(stock => stock.symbol)
        return symbolArr.join()
    }
}
