//Constructing Card Object
class Card {
  constructor(image, indx) {
    this.image = image;
    this.open = false;
    this.indx = indx;
  }
  isOpen() {
    return this.open;
  }
  getImage() {
    if (this.isOpen()) {
      return this.image;
    } else {
      return "images/deckBack.png";
    }
  }
  isMatched(card) {
    if (this.image === card.image) {
      return true;
    } else {
      return false;
    }
  }
}

//Constructing Deck Object
class Deck {
  constructor(array) {
    this.array = array;
    this.cards = this.createCardArray();
    this.guess = null;
  }

  setGuess(card) {
    if (this.guess === null) {
      this.guess = card;
    } else {
      this.guess = null;
    }
  }

  clean() {
    $(".panel").empty();
  }

  renderCards() {
    this.clean();
    for (let i=0; i<this.cards.length; i++) {
      let card = this.cards[i];
      let img = card.getImage();
      let listItem = `<li class="card" location="${i}"><img src="${img}" alt="back of deck"></li>`;
      $(".panel").append(listItem);
    }
  }

  //shuffle is taken from
  //https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  createCardArray() {
    let shuffledArray = this.shuffle(this.array);
    let cards = [];
    for (let i=0; i<shuffledArray.length; i++) {
      const card = new Card(shuffledArray[i], i);
      cards.push(card);
    }
    return cards;
  }

  getCardByIndex(indx) {
    return this.cards[indx];
  }
}

const imgs =
  [
    'images/1.jpg',
    'images/2.jpg',
    'images/3.jpg',
    'images/4.jpg',
    'images/5.jpg',
    'images/6.jpg',
    'images/7.jpg',
    'images/8.jpg',
  ]

let panelImages = imgs.concat(imgs);
const deck = new Deck(panelImages);
deck.renderCards();


$(document).on('click', ".card", function() {
  let indx = $(this).attr("location");
  let card = deck.getCardByIndex(indx);
  card.open = true;
  deck.renderCards();
  if (deck.guess !== null) {
    if (deck.guess.isMatched(card)) {
      deck.guess.open = true;
    } else {
        deck.renderCards();
        deck.guess.open = false;
        card.open = false;
    }
    setTimeout(function () {deck.renderCards();}, 700)
  }
  deck.setGuess(card);
});
