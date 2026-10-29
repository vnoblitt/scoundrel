import "./styles.css";
import { cardSprites, buildDeck, shuffleDeck } from "./Deck.js";

let deck = buildDeck();
let discardPile = [];
let playPile = [];
let newGame = true;
let drawDisabled = false;
let slotsActive = 0;
let life = 20;
let weapon = { "weapon": "unequipped", "power": 0, "lowestLevel": 0, "equipped": false};

const content = document.getElementById("content");

const lifeDisplay = document.createElement("div");
lifeDisplay.classList.add("life");
lifeDisplay.textContent = life;

const weaponWrapper = document.createElement("div");
weaponWrapper.classList.add("wrapper", "weapon");
const weaponSprite = document.createElement("img");
weaponSprite.classList.add("card", "weapon");
weaponSprite.src = cardSprites["card_blank.png"];
const weaponLabel = document.createElement("div");
weaponLabel.textContent = `${weapon.weapon}`;

const deckWrapper = document.createElement("div");
deckWrapper.classList.add("wrapper", "deck");
const deckSprite = document.createElement("img");
deckSprite.classList.add("card", "deck");
deckSprite.src = cardSprites["card_back.png"];
const deckLabel = document.createElement("div");
deckLabel.classList.add("label");
deckLabel.textContent = deck.length;

const slot1 = document.createElement("div");
slot1.isDisabled = false;
slot1.classList.add("wrapper", "slot1");
const slot1Sprite = document.createElement("img");
slot1Sprite.classList.add("card");
slot1Sprite.src = cardSprites["card_blank.png"];

const slot2 = document.createElement("div");
slot2.isDisabled = false;
slot2.classList.add("wrapper", "slot2");
const slot2Sprite = document.createElement("img");
slot2Sprite.classList.add("card");
slot2Sprite.src = cardSprites["card_blank.png"];

const slot3 = document.createElement("div");
slot3.isDisabled = false;
slot3.classList.add("wrapper", "slot3");
const slot3Sprite = document.createElement("img");
slot3Sprite.classList.add("card");
slot3Sprite.src = cardSprites["card_blank.png"];

const slot4 = document.createElement("div");
slot4.isDisabled = false;
slot4.classList.add("wrapper", "slot4");
const slot4Sprite = document.createElement("img");
slot4Sprite.classList.add("card");
slot4Sprite.src = cardSprites["card_blank.png"];

const discardWrapper = document.createElement("div");
discardWrapper.classList.add("wrapper", "discard");
const discardSprite = document.createElement("img");
discardSprite.classList.add("card", "discard");
discardSprite.src = cardSprites["card_blank.png"];
const discardLabel = document.createElement("div");
discardLabel.classList.add("label");
discardLabel.textContent = discardPile.length;

deckWrapper.append(deckSprite, deckLabel);
slot1.append(slot1Sprite);
slot2.append(slot2Sprite);
slot3.append(slot3Sprite);
slot4.append(slot4Sprite);
discardWrapper.append(discardSprite, discardLabel);
weaponWrapper.append(weaponSprite, weaponLabel);
content.append(deckWrapper, slot1, slot2, slot3, slot4, discardWrapper, lifeDisplay, weaponWrapper)

deckSprite.addEventListener("click", () => {
    if(newGame) {
        drawInitialRoom();
        drawDisabled = true;
        newGame = false;
    }
    if(!drawDisabled) {
        drawRoom();
        drawDisabled = true;
    }
});

discardSprite.addEventListener("click", () => {
    console.log(discardPile);
});

function handleSlotClick(slot, sprite, event) {
    if(slot.isDisabled) return;

    const index = playPile.findIndex(card => card.name === event.target.id);
    if (index === -1) return;
    
    const [target] = playPile.splice(index, 1);
    if (target.suit === "Diamonds") {
        sprite.src = cardSprites["card_blank.png"]; 
        slot.isDisabled = true;
        slotsActive--;
        if (slotsActive <= 1) {
            drawDisabled = false; 
            enableSlots(false);
        } 
        equip(target);
        return;
    } 
    discardPile.push(target);
    discardLabel.textContent = discardPile.length;
    sprite.src = cardSprites["card_blank.png"]; 
    slot.isDisabled = true;
    slotsActive--;
    if (slotsActive <= 1) {
        drawDisabled = false; 
        enableSlots(false);
    } 
    interact(target);
}

slot1.addEventListener("click", (event) => handleSlotClick(slot1, slot1Sprite, event));
slot2.addEventListener("click", (event) => handleSlotClick(slot2, slot2Sprite, event));
slot3.addEventListener("click", (event) => handleSlotClick(slot3, slot3Sprite, event));
slot4.addEventListener("click", (event) => handleSlotClick(slot4, slot4Sprite, event));

function drawInitialRoom() {
    playPile = [...playPile, ...deck.splice(0,4)];
    deckLabel.textContent = deck.length;
    let slots = [
        [slot1, slot1Sprite],
        [slot2, slot2Sprite],
        [slot3, slot3Sprite],
        [slot4, slot4Sprite]
    ]

    for(const card of playPile) {
        const slot = slots[0]
        slot[1].src = cardSprites[`${card.name}`];
        slot[1].id = `${card.name}`;
        slot[0].id = `${card.name}`;
        slots.splice(0,1);
    }

    slotsActive = 4;
    console.log("Draw requested");
    console.log(playPile)
}

function drawRoom() {
    enableSlots(true);
    playPile = [...playPile, ...deck.splice(1, 3)];
    deckLabel.textContent = deck.length;
    let slots = [
        [slot1, slot1Sprite],
        [slot2, slot2Sprite],
        [slot3, slot3Sprite],
        [slot4, slot4Sprite]
    ]

    for(const card of playPile) {
        const slot = slots[0]
        slot[1].src = cardSprites[`${card.name}`];
        slot[1].id = `${card.name}`;
        slot[0].id = `${card.name}`;
        slots.splice(0,1);
    }

    slotsActive = 4;
    console.log("Draw requested");
    console.log(playPile)
}

function enableSlots(bool) {
    slot1.isDisabled = !bool;
    slot2.isDisabled = !bool;
    slot3.isDisabled = !bool;
    slot4.isDisabled = !bool;
}

function interact(card) {
    console.log(card)
    switch (card.suit) {
        case "Spades":
            fight(card);
            break;
        case "Hearts":
            heal(card);
            break;
        case "Clubs":
            fight(card);
            break;
        case "Diamonds":
            console.log("EQUIP");
            equip(card);
            break;
        default:
            break;
    }
}

function fight(card) {
    if(!weapon.equipped) {
        life -= card.value;
    } else if (weapon.lowestLevel >= card.value) {
        if (weapon.power > card.value) {
            weapon.lowestLevel = card.value;
            weaponLabel.textContent = `str: ${weapon.power} lvl: ${weapon.lowestLevel}`;
        } else {
            life -= card.value - weapon.power;
            weapon.lowestLevel = card.value;
            weaponLabel.textContent = `str: ${weapon.power} lvl: ${weapon.lowestLevel}`;
        }
    } else {
        life -= card.value;
    }
    if (life <= 0) {
        gameOver();
    }
    lifeDisplay.textContent = life;
}

function heal(card) {
    life += card.value;
    lifeDisplay.textContent = life;
}

function equip(card) {
    if (weapon.equipped) {
        discardPile.push(weapon.weapon);
        discardLabel.textContent = discardPile.length;
    }
    weapon.equipped = true;
    weapon.weapon = card;
    weapon.power = card.value;
    weapon.lowestLevel = 14;
    weaponSprite.src = cardSprites[`${card.name}`];
    weaponLabel.textContent = `str: ${weapon.power} lvl: ${weapon.lowestLevel}`; 
}

function gameOver() {
    enableSlots(false);
    drawDisabled = true;
    content.innerHTML = "";
    let endScore = life;

    for (let card of deck) {
        if (card.suit === "Clubs" || card.suit === "Spades") {
            endScore -= card.value;
        }
    }
    const message = document.getElementById("game-over");
    message.textContent = `You Lose!`
    message.classList.add("active");
    const message2 = document.createElement("div");
    message2.textContent = `Score: ${endScore}`;
    message.append(message2)
}

shuffleDeck(deck);