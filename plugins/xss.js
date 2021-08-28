import xss from 'xss'

const options = {
  whiteList: {
    ...xss.whiteList,
    summary: [],
    h1: ['id'],
    h2: ['id'],
    h3: ['id'],
    h4: ['id'],
    h5: ['id'],
    h6: ['id'],
  },
}

const configuredXss = new xss.FilterXSS(options)

export default (ctx, inject) => {
  inject('xss', (string) => configuredXss.process(string))
}
