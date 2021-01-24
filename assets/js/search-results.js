// ************************ From Rose ************************//
// global variables
var searchShowEl = document.querySelector("#search-show");
var searchInputEl = document.querySelector('#findlocate');
var searchFormEl = document.querySelector('.hero-search-filter-form');
var modalBox = document.querySelector(".modal-box");

// create search result container
var resultContainerEl = document.createElement('div');
resultContainerEl.classList = 'result-container';
resultContainerEl.setAttribute('id', 'result-container');
modalBox.appendChild(resultContainerEl);

// Function for submiting search
var searchSubmitHandler = function(event) {
    // prevent page from refreshing
    event.preventDefault();
    // get value from input element
    var seriesName = searchInputEl.value.trim();
    if (seriesName) {
      // call function to display modal
      displayModal(seriesName);
      // clear old content from search input
      searchInputEl.value = '';
    } else {
      alert('Please enter a TV show');
    }
};

// Function for searching the series name entered in the input form element
var getSeries = function(seriesName) {
    // clear old content from modal
    while(resultContainerEl.firstChild) {
      resultContainerEl.removeChild(resultContainerEl.firstChild);
    }
    var apiUrl = "http://api.tvmaze.com/singlesearch/shows?q=" + seriesName; // From Rose
    fetch(apiUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          displaySeriesdata(data);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function(error) {
      alert('Unable to connect');
    });
  
};

// Function for displaying the serached series information
var displaySeriesdata = function(series) {
  
  if(series != null){
    // create section for holding series data
    var seriesDataEl = document.createElement('div');
    seriesDataEl.className = 'series-data';
    seriesDataEl.setAttribute('id', 'series-data');
    resultContainerEl.appendChild(seriesDataEl);

    // display Image
    if(series.image != null && series.image.medium != null) {
      var imageEl = document.createElement('img');
      imageEl.className = ('search-image')
      imageEl.setAttribute("id", 'search-image');
      imageEl.setAttribute("src", series.image.medium);
      seriesDataEl.appendChild(imageEl);
    }
    
    // display name of the series
    var nameEl = document.createElement('p');
    nameEl.className = ('search-name')
    nameEl.setAttribute("id", 'search-name');
    nameEl.textContent = series.name;
    seriesDataEl.appendChild(nameEl);

    // display website
    var websiteEl = document.createElement('a');
    websiteEl.textContent = "Visit Website";
    websiteEl.className = ('search-website')
    websiteEl.setAttribute("id", 'search-website');
    websiteEl.setAttribute("href", series.officialSite);
    websiteEl.setAttribute("target", '_blank');
    seriesDataEl.appendChild(websiteEl);

    // display schedule, savebutton and network or webchannel if show is running
    if(series.status === "Running") {
      
      // display network or webChannel
      var networkSearchEl = document.createElement('p');
      if(networkSearchEl) {
        networkSearchEl.className = ('search-network');
        networkSearchEl.setAttribute("id", 'search-network');
        networkSearchEl.textContent = series.network.name;
        seriesDataEl.appendChild(networkSearchEl);
      }
      else {
        var webChannelSearchEl = document.createElement('p');
        webChannelSearchEl.className = ('search-webchannel');
        webChannelSearchEl.setAttribute("id", 'search-webchannel');
        webChannelSearchEl.textContent = series.webChannel.name;
        seriesDataEl.appendChild(webChannelSearchEl);
      }

      // display schedule
      var showDays = [];
      var showDays = series.schedule.days;
      for(var i=0; i <showDays.length; i ++) {
        var scheduleEl = document.createElement('p');
        scheduleEl.className = ('search-schedule')
        scheduleEl.setAttribute("id", 'search-schedule');
        scheduleEl.textContent = series.schedule.time + " "+ showDays[i];
        seriesDataEl.appendChild(scheduleEl);
      }

      // add save button
      var saveButtonEl = document.createElement('button');
      saveButtonEl.className = 'save-button';
      saveButtonEl.setAttribute('id', 'save-button');
      saveButtonEl.setAttribute('type', 'button');
      saveButtonEl.innerHTML = "<i class='fa fa-search'></i>"
      saveButtonEl.textContent = "Save";
      seriesDataEl.appendChild(saveButtonEl);    
    }
    else {
      //display status if show has ended
      var statusEl = document.createElement('p');
      statusEl.className = ('search-status')
      statusEl.setAttribute("id", 'search-status');
      statusEl.textContent = "Status: " + series.status;
      seriesDataEl.appendChild(statusEl);
    }

    // display summary
    var summaryEl = document.createElement('div');
    summaryEl.className = 'search-summary';
    summaryEl.setAttribute('id', 'search-summary');
    summaryEl.innerHTML = series.summary;
    resultContainerEl.appendChild(summaryEl);

    // call function to get rating
    seriesRating(series.externals.imdb);
  }
  else{
    console.log("displaySeriesdata input is null");
  }
    
};

// Function for getting rating
var seriesRating = function(id) {

    var apiUrl = "http://www.omdbapi.com/?i=" + id + "&apikey=8f19b7dc";

    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
        response.json().then(function(data) {
            displayRating(data);
        });
        } else {
        alert('Error: ' + response.statusText);
        }
    })
    .catch(function(error) {
        alert('Unable to connect');
    });
};

// Function to display rating
var displayRating = function(rating) {

    var ratingContainerEl = document.createElement('div');
    ratingContainerEl.className = 'rating-container';
    ratingContainerEl.setAttribute('id', 'rating-container');
    resultContainerEl.appendChild(ratingContainerEl);

    // display rating score
    console.log(rating.Ratings[0].Value);
    var ratingEl = document.createElement('p');
    ratingEl.className = 'rating-score';
    ratingEl.setAttribute('id', 'rating-score');
    ratingEl.textContent = rating.Ratings[0].Value;
    ratingContainerEl.appendChild(ratingEl);
  
    // display rating source
    console.log(rating.Ratings[0].Source);
    var sourceEl = document.createElement('span');
    sourceEl.className = 'rating-source';
    sourceEl.setAttribute('id', 'rating-source');
    sourceEl.textContent = " Source: " + rating.Ratings[0].Source;
    ratingEl.appendChild(sourceEl);
  
};

// add event listener for search
searchFormEl.addEventListener('submit', searchSubmitHandler);