import { vi, describe, it, expect } from 'vitest'
import TaboolaComponent from './index' // Import the default export
import { MCEvent, Manager } from '@managed-components/types'

describe('Taboola Managed Component', () => {
  it('should register an event listener and call sendEvent on "event" event', async () => {
    // Mock the settings and manager objects
    const settings = { clickIdParam: 'tbclid' }
    const mockManager = {
      addEventListener: vi.fn(),
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: () => ({ message: 'ok' }) }),
    } as unknown as Manager

    // Call the default export function to initialize the component
    await TaboolaComponent(mockManager, settings)

    // Verify that the event listeners were registered
    expect(mockManager.addEventListener).toHaveBeenCalledWith(
      'event',
      expect.any(Function)
    )
    expect(mockManager.addEventListener).toHaveBeenCalledWith(
      'pageview',
      expect.any(Function)
    )

    // Get the registered 'event' listener function
    const eventListener = mockManager.addEventListener.mock.calls[0][1] as (
      event: MCEvent
    ) => Promise<void>

    // Prepare a mock MCEvent to trigger the listener
    const mockMCEvent = {
      type: 'event',
      name: 'Test Event',
      payload: {},
      client: {
        url: new URL('https://example.com/?tbclid=test-id-from-url'),
        get: vi.fn(),
        set: vi.fn(),
      },
    } as unknown as MCEvent

    // Trigger the listener function with the mock event
    await eventListener(mockMCEvent)

    // Verify that the manager.fetch function was called with the correct URL
    const expectedSearchParams = new URLSearchParams({
      'click-id': 'test-id-from-url',
      name: 'Test Event',
    })
    expect(mockManager.fetch).toHaveBeenCalledWith(
      `https://trc.taboola.com/actions-handler/log/3/s2s-action?${expectedSearchParams.toString()}`,
      { method: 'GET' }
    )
  })

  it('should not call manager.fetch if clickId is missing', async () => {
    const settings = { clickIdParam: 'tbclid' }
    const mockManager = {
      addEventListener: vi.fn(),
      fetch: vi.fn(),
    } as unknown as Manager

    await TaboolaComponent(mockManager, settings)

    // Get the registered 'event' listener function
    const eventListener = mockManager.addEventListener.mock.calls[0][1] as (
      event: MCEvent
    ) => Promise<void>

    // Prepare a mock MCEvent with a missing clickId
    const mockMCEvent = {
      type: 'event',
      name: 'Test Event',
      payload: {},
      client: {
        url: new URL('https://example.com/'),
        get: vi.fn().mockReturnValue(null),
        set: vi.fn(),
      },
    } as unknown as MCEvent

    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => { })

    // Trigger the listener function
    await eventListener(mockMCEvent)

    // Verify that manager.fetch was not called and a warning was logged
    expect(mockManager.fetch).not.toHaveBeenCalled()
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Missing Taboola click-id from param "tbclid" — conversion will not be sent.'
    )
    consoleWarnSpy.mockRestore()
  })

  it('should call manager.fetch with revenue, currency, and orderId', async () => {
    const settings = { clickIdParam: 'tbclid' }
    const mockManager = {
      addEventListener: vi.fn(),
      fetch: vi
        .fn()
        .mockResolvedValue({ ok: true, json: () => ({ message: 'ok' }) }),
    } as unknown as Manager

    await TaboolaComponent(mockManager, settings)
    const eventListener = mockManager.addEventListener.mock.calls[0][1] as (
      event: MCEvent
    ) => Promise<void>

    const mockMCEvent = {
      type: 'event',
      name: 'Purchase',
      payload: {
        revenue: 100.5,
        currency: 'USD',
        orderId: 'ORDER-123',
      },
      client: {
        url: new URL('https://example.com/?tbclid=test-id'),
        get: vi.fn(),
        set: vi.fn(),
      },
    } as unknown as MCEvent

    await eventListener(mockMCEvent)

    // Verify that manager.fetch was called with the correct parameters
    const expectedSearchParams = new URLSearchParams({
      'click-id': 'test-id',
      name: 'Purchase',
      revenue: '100.5',
      currency: 'USD',
      orderid: 'ORDER-123',
    })
    expect(mockManager.fetch).toHaveBeenCalledWith(
      `https://trc.taboola.com/actions-handler/log/3/s2s-action?${expectedSearchParams.toString()}`,
      { method: 'GET' }
    )
  })
})
