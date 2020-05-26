import Holmes from 'holmes-js'

const identifyBrowser = async () => {
  const holmes = new Holmes()
  const browserId = await holmes.get()
  return `${browserId}`
}

export const getBrowserId = async () => {
  if (!window.localStorage) return identifyBrowser()

  let browserId = localStorage.getItem('browserId')

  if (!browserId) {
    browserId = await identifyBrowser()
    localStorage.setItem('browserId', browserId)
  }

  return browserId
}

const map = {}
export const setOwnerCode = (id, ownerCode) => {
  if (!window.localStorage) return (map[id] = ownerCode)

  localStorage.setItem(id, ownerCode)
}

export const getOwnerCode = id => {
  if (!window.localStorage) return map[id]

  return localStorage.getItem(id)
}
