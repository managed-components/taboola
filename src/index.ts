import { ComponentSettings, Manager, MCEvent } from '@managed-components/types'

const getRequestBody = async (
  eventType: string,
  event: MCEvent,
  settings: ComponentSettings
) => {
  const { client, payload } = event
  const clickIdParam = settings.clickIdParam || 'tbclid'
  let clickId =
    client.get(clickIdParam) || client.url.searchParams.get(clickIdParam) || ''

  if (client.url.searchParams.get(clickIdParam)) {
    client.set(clickIdParam, clickId)
  }

  if (!clickId) {
    console.warn(`Missing Taboola click-id from param "${clickIdParam}" — conversion will not be sent.`)
    return null
  }

  const eventName = payload.eventName || payload.ev || event.name || eventType

  return {
    clickId,
    eventName,
    revenue: payload.revenue,
    currency: payload.currency,
    orderId: payload.orderId
  }
}

const sendEvent = async (payload: Record<string, any>, manager: Manager) => {
  const params = new URLSearchParams({
    'click-id': payload.clickId,
    name: payload.eventName,
    ...(payload.revenue && { revenue: payload.revenue.toString() }),
    ...(payload.currency && { currency: payload.currency }),
    ...(payload.orderId && { orderid: payload.orderId })
  })

  const taboolaUrl = `https://trc.taboola.com/actions-handler/log/3/s2s-action?${params.toString()}`
  try {
    const resp = await manager.fetch(taboolaUrl, { method: 'GET' })
    let data
    try { data = await resp.json() } catch { data = await resp.text() }
    if (!resp.ok) {
      throw new Error(`Taboola S2S error: ${data?.message || resp.status}`)
    }
  } catch (err) {
    console.error('Error sending Taboola S2S event:', err)
  }
}

export default async function (manager: Manager, settings: ComponentSettings) {
  const send = async (event: MCEvent) => {
    const request = await getRequestBody(event.type, event, settings)
    if (!request) return
    await sendEvent(request, manager)
  }

  manager.addEventListener('event', send)
  manager.addEventListener('pageview', send)
}
