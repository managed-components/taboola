import { ComponentSettings, Manager, MCEvent } from '@managed-components/types'

export const sendEvent = (id: string) => (event: MCEvent) => {
  const { payload, client, type } = event
  const { en, custom_en, timestampt, ...customFields } = payload
  const isPageview = type === 'pageview'
  const tblci = client.url.searchParams.get('tblci')

  const data = {
    tim: new Date().getTime(),
    cv: '20230105-3-RELEASE',
    ref: client.referer,
    en: isPageview ? 'page_view' : en === 'custom' ? custom_en || '' : en,
    ...(isPageview && { 'item-url': client.url.href }),
    ...(tblci && { tblci }),
    ...(!isPageview && customFields), // revenue, currency, orderid and any custom fields
  }

  const params = new URLSearchParams(data).toString()

  client.fetch(`https://trc.taboola.com/${id}/log/3/unip?${params}`, {
    credentials: 'include',
    keepalive: true,
    mode: 'no-cors',
  })
}

export default async function (manager: Manager, settings: ComponentSettings) {
  manager.addEventListener('pageview', sendEvent(settings.id))
  manager.addEventListener('event', sendEvent(settings.id))
}
