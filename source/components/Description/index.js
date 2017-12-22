import style from './style.css';
import React from 'react';

import DescriptionIcon from '../DescriptionIcon';
import DescriptionText from '../DescriptionText';

class Description extends React.Component {
    render() {
        return (
            <div className={style.description}>
                <DescriptionIcon
                    icon={this.props.icon}/>
                <DescriptionText
                    className={style.descriptionText}
                    day={this.props.day}
                    temperature={this.props.temperature}
                    weatherType={this.props.weatherType}
                    wind={this.props.wind}
                    humidity={this.props.humidity}
                    pressure={this.props.pressure}/>
            </div>
        );
    }
}

export default Description;
