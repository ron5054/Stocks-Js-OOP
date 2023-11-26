import { CompareResults } from "./CompareResults.js"
import { Utility } from "./Utility.js"
const compareResults = new CompareResults(document.querySelector('.compare-stocks'))

export class SearchResults {
    constructor(containerElement) {
        this.containerElement = containerElement
        this.containerElement.addEventListener('click', this.handleCompareButtonClick.bind(this))
        this.symbolsArr = []
    }

    render(companies, companyProfiles, searchTerm = '') {
        const htmlList = companies.map((company, idx) => {
            const highlightedName = this.highlightMatch(company.name, searchTerm)
            const highlightedSymbol = this.highlightMatch(`(${company.symbol})`, searchTerm)

            const imgSrc = companyProfiles[idx].profile.image
            const changesPercentage = companyProfiles[idx].profile.changesPercentage
            const changesColor = companyProfiles[idx].profile.changes > 0 ? 'green' : 'red'

            return `<li class="stock-list-item">
                        <img class="stock-img-${idx}" src="${imgSrc}" alt="">
                        <a class="stock-link" href="./company.html?symbol=${company.symbol}" target="_blank">${highlightedName} ${highlightedSymbol}</a>
                        <span class="stock-change-${idx}" style="color: ${changesColor}">(${changesPercentage.substr(0, 5)}%)</span>
                        <button class="compare-btn ${company.symbol}">Compare</button>
                    </li>`
        })

        this.containerElement.innerHTML = htmlList.join('')

        const imgElements = this.containerElement.querySelectorAll('img')
        imgElements.forEach(img => {
            img.onerror = function () {
                this.src = 'https://www.freeiconspng.com/uploads/stock-exchange-icon-png-11.png'
            }
        })
    }

    handleCompareButtonClick(event) {
        const button = event.target.closest('.compare-btn')
        if (button && button.classList.contains('compare-btn')) {
            const symbol = button.classList[1]
            this.addSymbolToCompare(symbol)
            compareResults.renderSymbol(symbol, this.symbolsArr)
        }
    }

    addSymbolToCompare(symbol) {
        if (this.symbolsArr.includes(symbol) || this.symbolsArr.length >= 3) return
        this.symbolsArr.push(symbol)
        Utility.setDisabled('add', symbol, this.symbolsArr)
    }

    highlightMatch(text, searchTerm) {
        return searchTerm ? text.replace(new RegExp(searchTerm, 'ig'), `<span class="highlight">$&</span>`) : text
    }
}
