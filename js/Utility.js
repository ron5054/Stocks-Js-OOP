export class Utility {

    static async getApiData(symbol, type) {

        const endpoints = {
            stockData: `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`,
            stockHistory: `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`,
            stocksList: `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${symbol}&limit=10&exchange=NASDAQ`,
            marquee: `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/stock-screener`
        }

        const endpoint = endpoints[type]

        try {
            const response = await fetch(endpoint)
            const data = await response.json()
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            return data
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error)
        }
    }

    static setDisabled(action, symbol, symbolsArr) {
        const compareBtns = document.querySelectorAll('.compare-btn')
        const compareSymbolsBtn = document.querySelector('.compare-symbols-btn')

        if (symbol) document.querySelector(`.${symbol}`).disabled = true

        if (action === 'add') {
            if (symbolsArr.length >= 3) {
                compareBtns.forEach(compareBtn => {
                    compareBtn.disabled = true
                })
            }

            if (symbolsArr.length > 1) {
                compareSymbolsBtn.disabled = false
            }
        }

        if (action === 'remove') {
            if (symbolsArr.length < 2) {
                compareSymbolsBtn.disabled = true
            }

            if (symbolsArr.length < 3) {
                compareBtns.forEach(compareBtn => {
                    // Check if the button's class is in symbolsArr
                    const btnClasses = Array.from(compareBtn.classList)
                    const hasSymbolClass = btnClasses.some(className => symbolsArr.includes(className))

                    // Enable buttons not present in symbolsArr, disable others
                    compareBtn.disabled = hasSymbolClass
                })
            }
        }
    }

    static debounce(func, wait) {
        let timeout
        return function () {
            const context = this
            const args = arguments
            const later = () => {
                timeout = null
                func.apply(context, args)
            }
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
        }
    }
}
