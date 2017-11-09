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
  getImage() {  //decides which face of the card to show (front or back)
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
    this.clicked = 0;
  }

  setGuess(card) {
    if (this.guess === null) {
      this.guess = card;
    } else {
      this.guess = null;
    }
  }

  clean() { //clears panel in the beginning and to restart
    $(".panel").empty();
    $(".stars").empty();
  }

  createGrid() {
    let location = 0;
    for(var i=0; i<4; i++) { //row
      $(".panel").append(`<div class="row" id="row_${i}"></div>`);
      for(var j=0; j<4; j++) {  //col
        let card = this.cards[location];
        let img = card.getImage();
        let responsiveImage = `<div class="imgContainer"><img class="card img-responsive" src="${img}" alt="back of deck" location="${location}"></div>`
        let column = `<div class="col-md-3 col-xs-3 col-lg-3 col-sm-3">${responsiveImage}</div>`
        $(`#row_${i}`).append(column);
        location += 1;
      }
    }
  }

  render() {
    //constructs the game panel with rendering the cards
    this.clean();
    this.createGrid();

    let star =  '<i class="fa fa-star fa-3x" aria-hidden="true"></i>'
    let emptyStar = '<i class="fa fa-star-o fa-3x" aria-hidden="true"></i>'

    //decides star rating based on the number of moves the player has made
    if (this.moves >= 10 && this.moves < 15) {
      $(".stars").append(star).append(star).append(emptyStar);
    } else if (this.moves >= 15) {
      $(".stars").append(star).append(emptyStar).append(emptyStar);
    } else {
      $(".stars").append(star).append(star).append(star);
    }
  }

  shuffle(a) {
  //shuffle is taken from
  //https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
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
//fixed card images
  [
    'images/1.png',
    'images/2.png',
    'images/3.png',
    'images/4.png',
    'images/5.png',
    'images/6.png',
    'images/7.png',
    'images/8.png',
  ]

let panelImages = imgs.concat(imgs); //creates 8 pairs of cards with fixed card images
const deck = new Deck(panelImages);

deck.render();

//End Game
$(document).on('change', ".panel", function() {
  if (deck.isEverythingOpen()) {
    const now = new Date().getTime(); //gives time when all the cards are matched
    let elapsed = Math.floor((now - deck.start)/1000); //calculates elapsed time by substracting starting time from finishing time
    clearInterval(deck.timer);
    let stars = $(".stars")
    swal({
      icon: "success",
      title: "Congrats!",
      text: `You finished the game with ${deck.moves} moves in ${elapsed} seconds!! ${stars.html()}`,
      showCancelButton: true,
      confirmButtonColor: '#00E4C9',
      cancelButtonColor: '#fdec67',
      confirmButtonText: 'Restart!'
    }).then(function(isConfirm) {
      if (isConfirm) {
        location.reload(); //refresh function
      }
    })
  };
})

$(document).on('click', ".card", function() {
  deck.clicked = deck.clicked + 1;
  if (deck.clicked === 1) {
    //counts clicks to start timer and to give the number of moves in the end
    const now = new Date().getTime(); //gets current time at first click
    deck.start = now;
    deck.timer = window.setInterval(function() { //creates a dynamic timer
      let gameTime = new Date().getTime();
      let diff = Math.floor((gameTime - now) / 1000);
      $(".timer").text(`Timer: ${diff}`);
    }, 1000);
  };

  let indx = $(this).attr("location");
  let card = deck.getCardByIndex(indx);

  if (!card.isOpen()) {
    card.open = true;
    deck.render();
    if (deck.guess !== null) {
      if (deck.guess.isMatched(card)) {
        //checks if the cards are matched
        deck.guess.open = true;
        $(".panel").trigger('change');
      } else {
        //checks if the cards are not matched and counts moves based on the false guesses
          deck.render();
          deck.guess.open = false;
          card.open = false;
          deck.moves += 1;
          $(".moves").text(`You have made ${deck.moves} moves`);
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
      location.reload(); //refreshes the game when clicking restart button
    }
  })
});
