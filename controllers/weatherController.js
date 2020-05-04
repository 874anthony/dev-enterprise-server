const axios = require('axios').default;

const getWeather = async city => {
  const url = `http://api.weatherstack.com/current?access_key=${process.env.WEATHERSTACK_KEY}&query=${city}`;
  const weather = await axios.get(url);
  return weather.data;
};

// TODO: Verificar si puedo corregir el tema del query en el city name (Read Documentation)

exports.getWeatherByName = async (req, res) => {
  const { city } = req.params;

  try {
    const weather = await getWeather(city);

    res.status(200).json({
      status: 'success',
      data: {
        weather
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      data: {
        error
      }
    });
  }
};
