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
    this.moves = 0;
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
    $(".stars").empty();
  }

  render() {
    this.clean();
    for (let i=0; i<this.cards.length; i++) {
      let card = this.cards[i];
      let img = card.getImage();
      let listItem = `<li class="card" location="${i}"><img src="${img}" alt="back of deck"></li>`;
      $(".panel").append(listItem);
    }

    //Star Rating based on Click count
    let star =  '<i class="fa fa-star fa-2x" aria-hidden="true"></i>'
    let emptyStar = '<i class="fa fa-star-o fa-2x" aria-hidden="true"></i>'

    if (this.moves >= 10 && this.moves < 15) {
      $(".stars").append(star).append(star).append(emptyStar);
    } else if (this.moves >= 15) {
      $(".stars").append(star).append(emptyStar).append(emptyStar);
    } else {
      $(".stars").append(star).append(star).append(star);
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

  isEverythingOpen() {
    return this.cards.every(function(element) {
      return element.isOpen()});
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

deck.render();

$(document).on('change', ".panel", function() {
  if (deck.isEverythingOpen()) {
    swal({
      icon: "success",
      title: "Congrats!",
      text: `You finished the game with ${deck.moves} moves !!`,
      showCancelButton: true,
      confirmButtonColor: '#00E4C9',
      cancelButtonColor: '#fdec67',
      confirmButtonText: 'Restart!'
    }).then(function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    })
  };
})

$(document).on('click', ".card", function() {
  let indx = $(this).attr("location");
  let card = deck.getCardByIndex(indx);

  if (!card.isOpen()) {
    card.open = true;
    deck.render();
    if (deck.guess !== null) {
      if (deck.guess.isMatched(card)) {
        deck.guess.open = true;
        $(".panel").trigger('change');
      } else {
          deck.render();
          deck.guess.open = false;
          card.open = false;
          deck.moves += 1;
        }
        setTimeout(function () {deck.render();}, 700)
      }
      deck.setGuess(card);
  };
});

//Restart Game
$(".refresh").bind('click', function() {
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'Are You Sure?',
    text: "Your progress will be LOST!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#00E4C9',
    cancelButtonColor: '#fdec67',
    confirmButtonText: 'Restart!'
  }).then(function(isConfirm) {
    if (isConfirm) {
      location.reload();
    }
  })
});
