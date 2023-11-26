import { Utility } from "./Utility.js"

export class CompareResults {
    constructor(containerElement) {
        this.containerElement = containerElement
        this.renderCompareSymbolsBtn()
    }

    renderSymbol(symbol, symbolsArr) {
        this.symbolsArr = symbolsArr
        const symbolBtnContainer = this.containerElement

        const elSymbol = document.createElement('div')
        elSymbol.classList.add('compare-symbol')
        elSymbol.innerText = symbol

        const removeBtn = document.createElement('button')
        removeBtn.classList.add('remove-btn')
        removeBtn.innerText = '❌'
        elSymbol.appendChild(removeBtn)
        symbolBtnContainer.appendChild(elSymbol)
        removeBtn.onclick = () => {
            const index = symbolsArr.indexOf(symbol)
            symbolsArr.splice(index, 1)
            symbolBtnContainer.removeChild(elSymbol)
            Utility.setDisabled('remove', symbol, symbolsArr)
        }
    }

    renderCompareSymbolsBtn() {
        const symbolBtnContainer = this.containerElement

        const compareSymbolsBtn = document.createElement('button')
        compareSymbolsBtn.classList.add('compare-symbols-btn')
        compareSymbolsBtn.innerText = 'Compare'
        compareSymbolsBtn.disabled = true
        symbolBtnContainer.appendChild(compareSymbolsBtn)

        compareSymbolsBtn.onclick = () => this.goToComparePage()
    }

    goToComparePage() {
        const symbolsStr = this.symbolsArr.join()
        window.location.href = `compare.html?symbol=${symbolsStr}`
    }
}