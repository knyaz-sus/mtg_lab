import {Mtg} from "./api/mtg";
import {ColorStats} from "./widgets/colorStats";
import {ManaCostStats} from "./widgets/manaCostStats";

document.addEventListener("DOMContentLoaded", setup)

document.getElementById('searchCards').addEventListener('click', search);

const mtg = new Mtg()
let deck = []

const mana = new ManaCostStats(document.getElementById("manaStats"));
const color = new ColorStats(document.getElementById("colorStats"));

function setup() {
    loadCards();
}

function showCard(item) {
    const cardsContainer = document.getElementById("cardsContainer");
    const img = document.createElement('img');
    img.src = item.getAttribute('img');
    img.width="223"
    img.height="310" 
    cardsContainer.innerHTML = '';

    const cardName = document.createElement('p');
    cardName.innerText = "Name: " + item.innerHTML;
    const cardTypes = document.createElement('p');
    cardTypes.innerText = "Type: " + item.getAttribute('types');
    const cardDescription = document.createElement('p');
    cardDescription.innerText = "Description:\n" + item.getAttribute('description');
    const deckButton = document.createElement('button');
    deckButton.innerText = 'Add card';
    
    deckButton.addEventListener('click', () => {
        if (deck[item.id]) {
            if (deck[item.id].count < 4 || item.getAttribute('types') === 'Land')
                deck[item.id].count++;
            else
                alert(`You cannot add more than 4 copies of the map ${item.innerHTML}`)
        } else {
            deck[item.id] = {
                card: item,
                count: 1
            };
        }
        updateDeck();
    });

    cardsContainer.appendChild(img);
    cardsContainer.appendChild(cardName);
    cardsContainer.appendChild(cardTypes);
    cardsContainer.appendChild(cardDescription);
    cardsContainer.appendChild(deckButton);
}

function search() {
    const text = document.getElementById("searchText");
    loadCards(text.value.toLowerCase());
}

function loadCards(cardName = "") {
    mtg.loadCards(cardName)
        .then((cards) => {
            const menu = document.getElementById('listContainer');
            const list = document.createElement('ul');

            cards.forEach(card => {
                if (card.multiverseid != undefined)
                {
                    if (card.name.toLowerCase().startsWith(cardName)) {
                        const listItem = document.createElement('li');
                        listItem.id = card.multiverseid;
                        listItem.innerHTML = card.name;
                        listItem.setAttribute('img', card.imageUrl);
                        listItem.setAttribute('description', card.text);
                        listItem.setAttribute('cmc', card.cmc);
                        listItem.setAttribute('colors', card.manaCost);
                        listItem.setAttribute('types', card.type);
                        listItem.addEventListener('click', () => {
                            showCard(listItem)
                        });
                        list.appendChild(listItem)
                    }
                }
            })
            menu.innerHTML = ''
            menu.appendChild(list);
        })
}

function updateDeck() {
    const deckContainer = document.getElementById('deckContainer');
    deckContainer.innerHTML = ''; 
    let totalCardCount = 0;
    deck.forEach((deckCard, index) => {
        const cardSample = document.createElement('div');
        cardSample.classList.add('deckCard');
        
        const cardImage = document.createElement('img');
        cardImage.src = deckCard.card.getAttribute('img');
        cardImage.width = 70;  
        cardImage.height = 100;

        const cardCount = document.createElement('span');
        cardCount.innerText = ` x${deckCard.count}`;
        totalCardCount += deckCard.count;

        cardImage.addEventListener('click', () => {
            removeFromDeck(index);
        });
        
        cardSample.appendChild(cardImage);
        cardSample.appendChild(cardCount);
        deckContainer.appendChild(cardSample);
    });

    mana.buildStats(deck);
    color.buildStats(deck);

    const totalCardsCountElement = document.getElementById('totalCardsCount');
    totalCardsCountElement.innerText = `Общее количество карт в колоде: ${totalCardCount}`;
}


function removeFromDeck(cardId) {
    if (deck[cardId]) {
        deck[cardId].count--; 
        if (deck[cardId].count <= 0) {
            delete deck[cardId]; 
        }
        updateDeck(); 
    }
}