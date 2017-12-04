import React, { Component } from 'react';

import WeatherCard from './weatherCard';
import config from '../config';
import './weather-search.less';

export default class WeatherSearch extends Component {
  constructor(props) {
      super(props);
      this.state = {
        textInput: ''
      }
  };

  componentDidMount() {
    window.addEventListener('load', this.bindAutoComplete);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.textInput.length) {
      this.setState({
        textInput: nextProps.textInput
      })
    }
  }
  
  changeInput = (event) => {
    this.setState({textInput: event.target.value});
	};

  fetchDataInput = (event) => {
    event.preventDefault();
    this.props.fetchData(this.state.textInput);
  };

  bindAutoComplete = () => {
    let input = this.refs.textInput;
    const autocomplete = new window.google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }
      const location = `${place.geometry.location.lat()},${place.geometry.location.lng()}`;
      this.props.fetchData(location);
      this.setState({ textInput: `${place.name} - ${place.formatted_address}` });
    });
  };

  render() {
    return (
    <form onSubmit={this.fetchDataInput}>
        <input 
        type='text'
        ref='textInput'
        placeholder='Digite uma localização'
        value={this.state.textInput} 
        onChange={this.changeInput} 
        />
    </form>
    );
  };
}
