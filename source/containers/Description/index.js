import React from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as temperatureUnitActions from '../../actions/temperatureUnitActions';
import Description from '../../components/Description';

class DescriptionContainer extends React.Component {
    getTemperature() {
        const temperatureFarenheit = this.props.weather.temperature;
        if (this.props.temperatureUnit === 'celsius') {
            const exactTemperature = (temperatureFarenheit - 32) * 5/9;
            const temperature = Math.round(exactTemperature * 10) / 10;
            return `${temperature}ºC`;
        }
        return `${temperatureFarenheit}ºF`;
    }

    convertDegreesToCardinals(degrees) {
        const directions = [
            { from: 348.75, to: 360, name: 'N' },
            { from: 0, to: 11.25, name: 'N' },
            { from: 11.25, to: 33.75, name: 'NNE' },
            { from: 33.75, to: 56.25, name: 'NE' },
            { from: 56.25, to: 78.75, name: 'ENE' },
            { from: 78.75, to: 101.25, name: 'E' },
            { from: 101.25, to: 123.75, name: 'ESE' },
            { from: 123.75, to: 146.25, name: 'SE' },
            { from: 146.25, to: 168.75, name: 'SSE' },
            { from: 168.75, to: 191.25, name: 'S' },
            { from: 191.25, to: 213.75, name: 'SSW'},
            { from: 213.75, to: 236.25, name: 'SW'},
            { from: 236.25, to: 258.75, name: 'WSW'},
            { from: 258.75, to: 281.25, name: 'W'},
            { from: 281.25, to: 303.75, name: 'WNW'},
            { from: 303.75, to: 326.25, name: 'NW'},
            { from: 326.25, to: 348.75, name: 'NNW'},
        ];

        return directions.reduce((prev, cur) => {
            if (degrees >= cur.from && degrees < cur.to) {
                return cur.name;
            }
            return prev;
        }, 'N');
    }

    getWind() {
        const speedMph =
            R.path(['wind', 'speed'], this.props.weather);
        const directionDegrees =
            R.path(['wind', 'direction'], this.props.weather);

        const speed = Math.round(speedMph * 1.60934);
        const direction = this.convertDegreesToCardinals(directionDegrees);
        return `${direction} ${speed}km/h`;
    }

    getHumidity() {
        const humidity =
            R.path(['atmosphere', 'humidity'], this.props.weather);
        return `${humidity}%`;
    }

    getPressure() {
        const pressure =
            R.path(['atmosphere', 'pressure'], this.props.weather);
        return `${pressure}hPA`;
    }

    getWeatherTypeName() {
        const { weatherType } = this.props.weather;
        const mapTypeNameToWeatherType = {
            'Ensolarado': [31, 32, 36],
            'Ventanoso': [24],
            'Nublado': [26, 28, 30, 34, 44],
            'Nublado (noite)': [27, 29, 33],
            'Chuvoso': [3, 4, 6, 11, 12, 45, 35, 37, 38, 39, 40, 47],
            'Neve': [5, 7, 8, 9, 10, 13, 14, 15, 16, 41, 42, 43, 46],
        };

        return Object.keys(mapTypeNameToWeatherType)
            .reduce((prev, currKey) => {
                const curr = mapTypeNameToWeatherType[currKey];
                if (curr.indexOf(weatherType) !== -1) {
                    return `${currKey}`;
                }
                return prev;
            }, `N/A`);
    }

    getBackgroundColor() {
        const temperature = (this.props.weather.temperature - 32) * 5/9;
        if (temperature > 35) {
            let scale = (45 - temperature) / 10;
            scale = scale < 0 ? 0 : scale;
            const redColor = 200 + Math.round(scale * (255-200));
            return this.formatRGBA(redColor, 100, 100);
        }
        if (temperature < 15) {
            let scale = (temperature - 0) / 15;
            scale = scale < 0 ? 0 : scale;
            const blueColor = 255 - Math.round(scale * (255-200));
            return this.formatRGBA(100, 100, blueColor);
        }
        const scale = (temperature - 15) / 20;
        const redColor = 100 + Math.round(scale * 50);
        const blueColor = 100 - Math.round(scale * 50);
        return this.formatRGBA(redColor, 150, blueColor);
    }

    formatRGBA(r, g, b, a = 0.7) {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    render() {
        if (this.props.weather.locationName) {
            return (
                <Description
                    weatherType={this.props.weather.weatherType}
                    day="Hoje"
                    color={this.getBackgroundColor()}
                    temperature={this.getTemperature()}
                    changeTemperatureUnit={
                        this.props.actions.changeTemperatureUnit}
                    weatherTypeName={this.getWeatherTypeName()}
                    wind={this.getWind()}
                    humidity={this.getHumidity()}
                    pressure={this.getPressure()}
                />
            );
        }
        return <Description loading={true}/>;
    }
}

const mapStateToProps = (state, ownProps) =>
    ({ weather: state.weather, temperatureUnit: state.temperatureUnit });

const mapDispatchToProps = (dispatch) =>
    ({ actions: bindActionCreators(temperatureUnitActions, dispatch) });

export default connect(
    mapStateToProps, mapDispatchToProps)(DescriptionContainer);
