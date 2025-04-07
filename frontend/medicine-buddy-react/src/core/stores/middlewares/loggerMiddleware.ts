export const loggerMiddleware = (store: any) => (next: any) => (action: any) => {
    console.log('store: ', store)
    console.log('next: ', next)
    console.log('action: ', action)
    next(action)
  }