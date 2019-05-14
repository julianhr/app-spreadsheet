export const sleep = async (timeMs) => (
  new Promise(resolve => setTimeout(() => { resolve(true) }, timeMs))
)
