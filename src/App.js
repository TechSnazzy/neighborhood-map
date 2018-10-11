import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Map from './components/Map';
import ErrorCatcher from './components/ErrorCatcher';
import escapeRegExp from 'escape-string-regexp';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      venues: [],
      allVenues: [],
      allMarkers: [],
      query: ''
    };
  }

  componentDidMount() {
    this.getVenues();
    document.title = 'Bay Area Ice Cream Locator';
  }

  renderMap = () => {
    const GoogleMapsAPI = 'AIzaSyCcy8mnVTHRmKX8ubNE38RuSV5et15HNiQ';
    loadScript(
      `https://maps.googleapis.com/maps/api/js?libraries=geometry,drawing&key=${GoogleMapsAPI}&v=3&callback=initMap`
    );
    window.initMap = this.initMap;
  };

  getVenues = () => {
    const endPoint = 'https://api.foursquare.com/v2/venues/explore?';
    const parameters = {
      client_id: 'HK5FLRYBMQ2AO2JYR4VVGU5ZXKB4B0N2B0YLOOGHCKXDD0EZ',
      client_secret: 'SOZXIHAVVLHETXOGTSXOIOA5FKCPWUGNQCW1GC3L5TIF31PK',
      query: 'icecream',
      ll: '37.338208, -121.886329',
      near: 'San Jose,CA',
      v: '20182507',
      limit: 10
    };

    axios
      .get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState(
          {
            venues: response.data.response.groups[0].items,
            allVenues: response.data.response.groups[0].items
          },
          this.renderMap()
        );
      })
      .catch(error => {
        console.log('ERROR!! ' + error);
      });
  };

  initMap = () => {
    // Snazzy Maps
    var styles = [
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry',
        stylers: [
          {
            color: '#f9f5ed'
          },
          {
            saturation: '0'
          }
        ]
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [
          {
            color: '#d0e3b4'
          }
        ]
      },
      {
        featureType: 'landscape.natural.terrain',
        elementType: 'geometry',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.attraction',
        elementType: 'all',
        stylers: [
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'poi.business',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.medical',
        elementType: 'geometry',
        stylers: [
          {
            color: '#fbd3da'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [
          {
            color: '#bde6ab'
          }
        ]
      },
      {
        featureType: 'poi.sports_complex',
        elementType: 'all',
        stylers: [
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#fcfcdd'
          },
          {
            saturation: '0'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#efd151'
          },
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#dcdcdc'
          },
          {
            visibility: 'on'
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry.fill',
        stylers: [
          {
            visibility: 'on'
          },
          {
            color: '#ffffff'
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry.stroke',
        stylers: [
          {
            visibility: 'on'
          },
          {
            color: '#dedbd3'
          }
        ]
      },
      {
        featureType: 'transit.station.airport',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#cfb2db'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
          {
            color: '#a2daf2'
          }
        ]
      }
    ];
    // Create A Map
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 37.338208,
        lng: -121.886329
      },
      zoom: 12,
      styles: styles
    });

    // Create An Info Window
    const infowindow = new window.google.maps.InfoWindow();

    // Display Dynamic Markers
    this.state.venues.forEach(myVenue => {
      const markerImage = 'http://techsnazzy.com/assets/img/ice-cream.png';
      // Create A Marker
      const marker = new window.google.maps.Marker({
        position: {
          lat: myVenue.venue.location.lat,
          lng: myVenue.venue.location.lng
        },
        map: map,
        title: myVenue.venue.name,
        icon: markerImage,
        id: myVenue.venue.id,
        animation: window.google.maps.Animation.DROP
      });

      const infoString = `
        <h4>${myVenue.venue.name}</h4>
        <p>${myVenue.venue.location.address}<br>${
        myVenue.venue.location.city
      }, ${myVenue.venue.location.state} ${
        myVenue.venue.location.postalCode
      }</p>
        `;

      // Click On A Marker
      marker.addListener('click', function() {
        // Change The Content
        infowindow.setContent(infoString);
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
        }
        setTimeout(() => {
          marker.setAnimation(null);
        }, 1000);

        // Open An InfoWindow
        infowindow.open(map, marker);
      });
    });
  };

  //Handling the search box changes
  handleSearch = query => {
    this.setState({ query });
    var filterVenues;
    var hiddenMarkers;
    this.state.markers.map(marker => marker.setVisible(true));
    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i');
      filterVenues = this.state.venues.filter(site =>
        match.test(site.venue.name)
      );
      this.setState({ venues: filterVenues });
      hiddenMarkers = this.state.markers.filter(marker =>
        filterVenues.every(site => site.venue.name !== marker.title)
      );
      this.itemVisibility(hiddenMarkers, false);
      this.setState({ hiddenMarkers });
    } else {
      this.setState({ venues: this.state.allVenues });
      this.itemVisibility(this.state.markers, true);
    }
  };

  render() {
    return (
      <ErrorCatcher>
        <div className="App" role="main">
          <Header />
          <div className="d-flex flex-row bd-highlight mb-3">
            <SearchBar
              className="p-2 bd-highlight"
              markers={this.state.markers}
              filteredVenues={this.filteredVenues}
              query={this.state.query}
              clearQuery={this.clearQuery}
              handleSearch={b => this.handleSearch(b)}
              clickLocation={this.clickLocation}
              venues={this.state.venues}
            />
            <Map className="p-2 bd-highlight" />
          </div>
        </div>
      </ErrorCatcher>
    );
  }
}

function loadScript(url) {
  var index = window.document.getElementsByTagName('script')[0];
  var script = window.document.createElement('script');
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
  script.onerror = function() {
    document.write('Error! Map was not loaded.');
  };
}

export default App;
