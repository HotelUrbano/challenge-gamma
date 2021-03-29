import { useCallback, useEffect, useRef, useState } from "react"
import { getCoordinates, fetchUserLocation, fetchForecast, fetchLocations, getTempColor, getWindDirection, getUnit } from "../Utils"
import { Card, IconWrapper, ForecastArea, SearchBarArea, DayLabel, Description, StyledWeatherIcon, StyledSection, Temperature } from "./styled"
import Overlay from 'react-bootstrap/Overlay'
import { RiCompassLine } from 'react-icons/ri'
import DropDownMenu from "./DropDownMenu"
import { IForecast, ILocationResult } from "../types/api-types"
import { IForecastState, ISystemState } from "../types"

const defaultSystem: ISystemState = 'metric'

function ForecastCard() {
    const searchAreaRef = useRef<HTMLDivElement>(null);
    const timeout = useRef<number>()
    const currentString = useRef<string>('')

    const [loading, setLoading] = useState<boolean>(false)
    const [initialLoading, setInitialLoading] = useState<boolean>(false)
    const [loadingForecast, setLoadingForecast] = useState<boolean>(false)
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [forecast, setForecast] = useState<IForecastState | null>(null)
    const [locations, setLocations] = useState<ILocationResult[]>()
    const [selectedLocation, setSelectedLocation] = useState<ILocationResult | undefined>()
    const [searchString, setSearchString] = useState<string>('')
    const [system, setSystem] = useState<ISystemState>(defaultSystem)

    useEffect(() => {
        if (navigator.geolocation) {
            setInitialLoading(true)
            getCoordinates().then(position => {
                const { latitude, longitude } = position.coords

                return fetchUserLocation(latitude, longitude).then(location => {
                    if (location) {
                        setSearchString(location.formatted)
                        setSelectedLocation(location)
                        return fetchForecast(latitude, longitude, defaultSystem)
                            .then(forecast => {
                                setForecast(formatForecastState(forecast))
                            })
                    }
                })
            }).finally(() => setInitialLoading(false))
        }
    }, [])

    const getLocationsOptions = useCallback(() => {
        if (locations) {
            return locations.map((location, index: number) => ({ value: location.formatted, id: index, ...location }))
        } else {
            return []
        }
    }, [locations])

    function formatForecastState(forecast: IForecast): IForecastState {
        return (
            {
                'today': forecast.current,
                'tomorrow': forecast.daily[1],
                'afterTomorrow': forecast.daily[2]
            }
        )
    }

    function switchSystem() {
        if (selectedLocation) {
            const newSystem = system === 'metric' ? 'imperial' : 'metric'
            const { lat, lng } = selectedLocation.geometry

            setLoadingForecast(true)

            fetchForecast(lat, lng, newSystem)
                .then(forecast => {
                    setForecast(formatForecastState(forecast))
                    setSystem(newSystem)
                    setLoadingForecast(false)
                })
        }
    }

    function onSearchLocation(query: string) {
        setSearchString(query)
        clearTimeout(timeout.current);
        timeout.current = window.setTimeout(() => {
            currentString.current = query
            setLoading(true)
            fetchLocations(query)
                .then(locations => {
                    if (currentString.current === query) {
                        setLoading(false)
                        setLocations(locations.results)
                    }
                })
        }, 300);
    }

    function formatTemperature(temp: number | null | undefined) {
        if (temp) {
            return `${temp.toFixed()} ${getUnit('temperature', system)}`
        } else {
            return ''
        }
    }

    return (
        <Card loadingElement={loadingForecast}>
            <SearchBarArea ref={searchAreaRef}>
                <IconWrapper>
                    <RiCompassLine />
                </IconWrapper>
                <input
                    type="text"
                    value={searchString}
                    onFocus={(e) => {
                        e.target.select()
                        setIsSearching(true)
                    }}
                    onChange={e => {
                        onSearchLocation(e.target.value)
                    }}
                />
                <Overlay
                    show={isSearching}
                    transition={false}
                    target={searchAreaRef.current}
                    placement="bottom"
                    rootClose
                    rootCloseEvent='mousedown'
                    onHide={(event) => {
                        if (searchAreaRef.current && !searchAreaRef.current.contains(event.target as Node)) {
                            setIsSearching(false)
                            if (selectedLocation) {
                                setSearchString(selectedLocation.formatted)
                            }
                        }
                    }}
                >
                    <DropDownMenu
                        data={getLocationsOptions()}
                        loading={loading}
                        onClickOption={(location) => {
                            const { lat, lng } = location.geometry

                            setIsSearching(false)
                            setLoadingForecast(true)
                            setSearchString(location.formatted)
                            setSelectedLocation(location)

                            fetchForecast(lat, lng, system)
                                .then(forecast => {
                                    setForecast(formatForecastState(forecast))
                                })
                                .finally(() => setLoadingForecast(false))
                        }}
                    />
                </Overlay>
            </SearchBarArea>
            <ForecastArea
                initialLoading={initialLoading}
                className='today'
                tempColor={getTempColor(forecast?.today.temp, 60, system)}
            >
                <Section show={!!forecast}>
                    <StyledWeatherIcon iconId={forecast?.today.weather[0].icon} />
                </Section>
                <Section show={!!forecast}>
                    <DayLabel>Hoje</DayLabel>
                    <Temperature onClick={switchSystem}>
                        {formatTemperature(forecast?.today.temp)}
                    </Temperature>
                    <Description>
                        {forecast?.today.weather[0].description}
                    </Description>
                    <div>
                        <span>Vento: </span>
                        {`${getWindDirection(forecast?.today.wind_deg)} ${forecast?.today.wind_speed} ${getUnit('wind', system)}`}
                    </div>
                    <div>
                        <span>Umidade: </span>
                        {`${forecast?.today.humidity} %`}
                    </div>
                    <div>
                        <span>Pressão: </span>
                        {`${forecast?.today.pressure} ${getUnit('pressure', system)} `}
                    </div>
                </Section>
            </ForecastArea>
            <ForecastArea
                initialLoading={initialLoading}
                className='tomorrow'
                tempColor={getTempColor(forecast?.today.temp, 50, system)}
            >
                <Section show={!!forecast}>
                    <DayLabel>Amanhã</DayLabel>
                    <Temperature onClick={switchSystem}>
                        {formatTemperature(forecast?.tomorrow?.temp.max)}
                        {` / ${formatTemperature(forecast?.tomorrow?.temp.min)}`}
                    </Temperature>
                </Section>
            </ForecastArea>
            <ForecastArea
                initialLoading={initialLoading}
                className='day-after-tomorrow'
                tempColor={getTempColor(forecast?.today.temp, 40, system)}
            >
                <Section show={!!forecast}>
                    <DayLabel>Depois de Amanhã</DayLabel>
                    <Temperature onClick={switchSystem}>
                        {formatTemperature(forecast?.afterTomorrow?.temp.max)}
                        {` / ${formatTemperature(forecast?.afterTomorrow?.temp.min)}`}
                    </Temperature>
                </Section>
            </ForecastArea>
        </Card >
    )
}

function Section({ show, children }: any) {
    return show ? (
        <StyledSection>
            {children}
        </StyledSection>
    ) : null
}

export default ForecastCard