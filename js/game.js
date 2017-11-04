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

function selectRandomly (array) {
  let index = Math.floor(Math.random() * array.length);
  let rand = array[index];
  deleteSelected(index);
  return rand;
}

function deleteSelected (index) {
  panelImages.splice(index, 1);
}

function setImage (element) {
  let image = selectRandomly(panelImages);
  $("img", element).attr("src",image);
}

function setIndex (element, index) {
  $(element).attr("location", index);
}

$.each( $(".panel").children(), function(index, value) {
  setImage(value);
  setIndex(value, index);
});
