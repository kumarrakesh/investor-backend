const Configs = require('../modals/config.modals')

const createConfig = async () => {
  const isPresent = await Configs.count({})
  if (!isPresent) {
    const addConfig = await Configs.create({})
    console.log('Default Config added', addConfig)
  } else {
    console.log('Configration present')
  }
}
createConfig()
