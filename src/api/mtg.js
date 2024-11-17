class Mtg {
    constructor(baseUrl = "https://api.magicthegathering.io/v1/") {
        this.baseUrl = baseUrl
    }

    loadCards(cardName) {
        let url = `${this.baseUrl}cards`
        if (cardName != "")
            url += `/?name=${cardName}`
        return fetch(url)
            .then(response=>response.json())
            .then(json=>json.cards)
    }
}


export {Mtg}
