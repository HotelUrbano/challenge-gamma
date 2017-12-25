import style from './style.css';
import React from 'react';

class DescriptionText extends React.Component {
    render() {
        return (
            <div className={style.descriptionText}>
                <div className={style.day}>
                    {this.props.day}
                </div>
                <div
                    className={style.temperature}
                    onClick={this.props.changeTemperatureUnit}>
                    {this.props.temperature}
                </div>
                <div className={style.weatherType}>
                    {this.props.weatherTypeName}
                </div>
                <div className={style.wind}>
                    Vento: {this.props.wind}
                </div>
                <div className={style.humidity}>
                    Humidade: {this.props.humidity}
                </div>
                <div className={style.pressure}>
                    Pressão: {this.props.pressure}
                </div>
            </div>
        );
    }
}

export default DescriptionText;
