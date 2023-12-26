// Client facing scripts here

$(document).ready(function() {
  console.log('Client works');

  //Delegation when a favorite btn is clicked
  const favoriteItem = function(event) {
    event.preventDefault();

    if (event.target.classList.contains('heart-icon')) {
      // Adds 'is-favorite' class if doesn't exist and removes if it does
      $(event.target).toggleClass('is-favorite');

      if ($(event.target).hasClass('is-favorite')) {
        // changes the color to yellow if the fav class is present
        $(event.target).css('color', '#FFC436');
      } else {
        // Resets the color to dark-blue is the class is not present
        $(event.target).css('color', '#033c9d');
      }
    }
  }
  $(document).on('click', '.heart-icon', favoriteItem);

});

let selectedYear, selectedModel, selectedMake, selectedPrice;

// capturing values from each filter option

$('#filterYear').on('change', function() {
  selectedYear = $(this).val();
  console.log(selectedYear);
});

$('#filterMake').on('change', function() {
  selectedMake = $(this).val();
  console.log(selectedMake);
});

$('#filterModel').on('change', function() {
  selectedModel = $(this).val();
  console.log(selectedModel);
});

$('#filterPrice').on('change', function() {
  selectedPrice = $(this).val();

  if (selectedPrice) {
    let [min, max] = selectedPrice.split(' ');
    min = Number(min);
    max = Number(max);
    selectedPrice = [min, max];
  }
});

$('.filter-form').on('submit', function(event) {
  event.preventDefault();

  // creating object to pass to server side route

  // example object:
  // const formData = {
  //  year: 1959,
  //  make: 'Chevrolet',
  //  model: 'Corvette',
  //  price: ['80000', '90000']
  // };

  const formData = {
    year: selectedYear,
    make: selectedMake,
    model: selectedModel,
    price: selectedPrice
  };

  $.ajax({
    method: 'POST',
    url: '/filtered',
    data: formData
  })
    .done((response) => {
      console.log('Success');
      updateCarList(response);
    })
})


// Empty card container and update HTML with new array of cars from filter

function updateCarList(cars) {

  // class that holds the car information

  const $carList = $('.row.mb-4');
  $carList.empty();

  //copied HTML format from index.ejs to render same format and styling

  cars.forEach((data) => {
    const html = `
      <div class="col-md-3">
        <div class="card">
          <a href="/sell/${data.id}">
            <img src="${data.photo_url_1}" class="card-img-top" alt="image_unavailable">
          </a>
          <div class="card-body">
            <h5 class="card-title">
              ${data.make}
              ${data.model}
            </h5>
            <h6 class="card-info"><b>Year:</b>
              ${data.year}
            </h6>
            <h6 class="card-info"><b>Color:</b>
              ${data.color}
            </h6>
            <h6 class="card-info"><b>Mileage:</b>
              ${data.odometer}
            </h6>
            <h6 class="card-info"><b>Price:</b> $${data.price}
            </h6>
            <a href="/contact_seller" class="btn btn-warning btn-md" role="button">Contact Seller</a>
            <div class="add-to-favs">
              <!-- When favorite btn is clicked -->
              <b>Add to Favourites </b><i class="heart-icon fa-solid fa-heart fa-lg"></i>
            </div>

          </div>
        </div>
      </div>`;
    $carList.append(html);
  });
}



//Chat on contact_seller page
const sendMessage = function() {
  const messageInput = $("#messageInput");
  const chatContainer = $("#chatContainer");

  // Gets the msg input value
  const msg = messageInput.val();

  // Creates a new message
  const newMessage = $("<div class='mb-2'><strong>You:</strong> " + msg + "</div>");

  // Adds a new message to the chat
  chatContainer.append(newMessage);

  // Clears the msg input field
  messageInput.val("");
}

// Sends the msg on a button click
$("#send-btn").click(sendMessage);



