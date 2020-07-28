import React from 'react'
import Header from 'components/Header/Header'
import Layout from 'components/Layout/Layout'
import WeatherSection from 'components/WeatherSection/WeatherSection'
import useGeolocation from 'hooks/useGeolocation'
import useGeolocationConverter from 'hooks/useGelocationConverter'

const App = () => {
  const locationCoordinates = useGeolocation()
  const { city, state, sunRise, sunSet } = useGeolocationConverter(locationCoordinates)

  return (
    <main
      style={{
        backgroundImage:
          'url("https://www.bing.com/th?id=OHR.WheatCastilla_ROW1945841583_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp")',
        backgroundSize: 'cover',
      }}
    >
      <Layout>
        <Header city={city} state={state} />

        <WeatherSection city={city} sunRise={sunRise} sunSet={sunSet} />
      </Layout>
    </main>
  )
}

export default App
