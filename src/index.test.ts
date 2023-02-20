import { MCEvent } from '@managed-components/types'
import { sendEvent } from '.'

const isRecentTs = (value: string) => {
  const now = new Date().valueOf();
  let ts = parseInt(value);
  return ts <= now && ts > now - 10000;
}

const dummyClient = {
  title: 'Zaraz "Test" /t Page',
  timestamp: 1670502437,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
  language: 'en-GB',
  referer: '',
  ip: '127.0.0.1',
  emitter: 'browser',
  url: new URL('http://127.0.0.1:1337'),
  fetch: () => undefined,
  set: () => undefined,
  execute: () => undefined,
  return: () => {},
  get: () => undefined,
  set: () => undefined,
  attachEvent: () => {},
  detachEvent: () => {},
}

const settings = { id: '12345' }

describe('Taboola MC handles pageview correctly', () => {
  let fetchRequest: any

  const fakeEvent = new Event('pageview', {}) as MCEvent
  fakeEvent.payload = {}
  fakeEvent.client = {
    ...dummyClient,
    fetch: (url, opts) => {
      fetchRequest = { url, opts }
      return undefined
    },
  }

  sendEvent(settings.id)(fakeEvent);

  it('creates the Taboola pageview request correctly', async () => {
    expect(fetchRequest).toBeTruthy()
    expect(fetchRequest?.opts?.mode).toEqual('no-cors')
    expect(fetchRequest?.opts?.keepalive).toEqual(true)
    expect(fetchRequest?.opts?.credentials).toEqual('include')

    const url = new URL(fetchRequest.url)

    expect(url.origin).toEqual('https://trc.taboola.com')
    expect(url.pathname).toEqual(`/${settings.id}/log/3/unip`)
    expect(url.searchParams.get('tim')).toSatisfy(isRecentTs)
    expect(url.searchParams.get('cv')).toBeTypeOf('string')
    expect(url.searchParams.get('ref')).toEqual(fakeEvent.client.referer)
    expect(url.searchParams.get('en')).toEqual('page_view')
    expect(url.searchParams.get('item-url')).toEqual(fakeEvent.client.url.href)
  })
})

describe('Taboola MC handles event correctly', () => {
  let fetchRequest: any

  const fakeEvent = new Event('event', {}) as MCEvent
  fakeEvent.payload = {
    en: "make_purchase",
    revenue: "8.90",
    currency: "MXN",
    orderid: "54321",
    custom_field: "custom_value"
  }
  fakeEvent.client = {
    ...dummyClient,
    fetch: (url, opts) => {
      fetchRequest = { url, opts }
      return undefined
    },
  }

  sendEvent(settings.id)(fakeEvent);

  it('creates the Taboola pageview request correctly', async () => {
    expect(fetchRequest).toBeTruthy()
    expect(fetchRequest?.opts?.mode).toEqual('no-cors')
    expect(fetchRequest?.opts?.keepalive).toEqual(true)
    expect(fetchRequest?.opts?.credentials).toEqual('include')

    const url = new URL(fetchRequest.url)

    expect(url.origin).toEqual('https://trc.taboola.com')
    expect(url.pathname).toEqual(`/${settings.id}/log/3/unip`)
    expect(url.searchParams.get('tim')).toSatisfy(isRecentTs)
    expect(url.searchParams.get('cv')).toBeTypeOf('string')
    expect(url.searchParams.get('ref')).toEqual(fakeEvent.client.referer)
    expect(url.searchParams.get('en')).toEqual(fakeEvent.payload.en)
    expect(url.searchParams.get('revenue')).toEqual(fakeEvent.payload.revenue)
    expect(url.searchParams.get('currency')).toEqual(fakeEvent.payload.currency)
    expect(url.searchParams.get('orderid')).toEqual(fakeEvent.payload.orderid)
    expect(url.searchParams.get('custom_field')).toEqual(fakeEvent.payload.custom_field)
  })
})

describe('Taboola MC handles custom event correctly', () => {
  let fetchRequest: any

  const fakeEvent = new Event('event', {}) as MCEvent
  fakeEvent.payload = {
    en: "custom",
    custom_en: "my_event_name",
    custom_field: "custom_value"
  }
  fakeEvent.client = {
    ...dummyClient,
    fetch: (url, opts) => {
      fetchRequest = { url, opts }
      return undefined
    },
  }

  sendEvent(settings.id)(fakeEvent);

  it('creates the Taboola pageview request correctly', async () => {
    expect(fetchRequest).toBeTruthy()
    expect(fetchRequest?.opts?.mode).toEqual('no-cors')
    expect(fetchRequest?.opts?.keepalive).toEqual(true)
    expect(fetchRequest?.opts?.credentials).toEqual('include')

    const url = new URL(fetchRequest.url)

    expect(url.origin).toEqual('https://trc.taboola.com')
    expect(url.pathname).toEqual(`/${settings.id}/log/3/unip`)
    expect(url.searchParams.get('tim')).toSatisfy(isRecentTs)
    expect(url.searchParams.get('cv')).toBeTypeOf('string')
    expect(url.searchParams.get('ref')).toEqual(fakeEvent.client.referer)
    expect(url.searchParams.get('en')).toEqual(fakeEvent.payload.custom_en)
    expect(url.searchParams.get('custom_field')).toEqual(fakeEvent.payload.custom_field)
  })
})