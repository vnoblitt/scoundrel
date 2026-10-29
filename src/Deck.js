class Card {
    constructor(suit, value, name, sprite, inDeck) {
        this.suit = suit;
        this.value = value;
        this.name = name;
        this.sprite = sprite;
        this.inDeck = inDeck;
    }

    pull() {
        this.inDeck = false;
    }

    put() {
        this.inDeck = true;
    }
}

function importDeck(r) {
    const images = {};
    r.keys().forEach((path) => {
        const name = path.replace("./", "")
        .replace(/^Tiles/, "Diamonds")
        .replace(/^Pikes/, "Spades")
        .replace(/^Clovers/, "Clubs")
        .replace(/_white\.png$/, "");
        images[name] = r(path);
    });
    return images;
}

const cardSprites = importDeck(require.context("./assets/playing_cards/PNG/white", false, /\.png$/));

function buildDeck() {
    const suits = ["Spades", "Hearts", "Clubs", "Diamonds"]
    let deck = [];
    for(const suit of suits) {
        for(let rank = 2; rank <= 14; rank++ ) {
            if (suit === "Hearts" || suit === "Diamonds") {
                if (rank > 10) {
                    continue;
                }
            }
            const face = faceValue(rank);
            deck.push(new Card(suit, rank, `${suit}_${face}`, cardSprites[`${suit}_${face}`], true));            
        }
    }
    return deck;
}

function faceValue(card) {
    switch (card) {
        case 11:
            return "Jack";
            break;
        case 12:
            return "Queen";
            break;
        case 13: 
            return "King";
            break;
        case 14:
            return "A";
            break;
        default:
            return `${card}`;
            break;
    }
}

function shuffleDeck(array) {
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    } 
    return array;
}

export { cardSprites, buildDeck, shuffleDeck }
