import { describe, expect, it } from 'vitest'
import { themeAt } from '../src'
import type { CharpenteConfig } from '../src'

const config: CharpenteConfig = {
  defaultTheme: 'solid',
  timeZone: 'Europe/Paris',
  schedule: [
    { theme: 'web', from: '10-15', to: '11-02' },
    { theme: 'dots', from: '12-01', to: '12-31' },
    { theme: 'outline', from: '12-21', to: '03-19' },
  ],
}

const at = (iso: string): string => themeAt(config, new Date(iso))

describe('themeAt', () => {
  it('uses the default theme outside every range', () => {
    expect(at('2026-05-15T12:00:00Z')).toBe('solid')
  })

  it('picks the scheduled theme inside a range', () => {
    expect(at('2026-10-31T12:00:00Z')).toBe('web')
  })

  it('includes both ends of a range', () => {
    expect(at('2026-10-15T12:00:00Z')).toBe('web')
    expect(at('2026-11-02T12:00:00Z')).toBe('web')
  })

  it('lets the first matching entry win when ranges overlap', () => {
    expect(at('2026-12-25T12:00:00Z')).toBe('dots')
  })

  it('handles a range that wraps over the new year', () => {
    expect(at('2027-01-05T12:00:00Z')).toBe('outline')
    expect(at('2027-03-19T12:00:00Z')).toBe('outline')
    expect(at('2027-03-20T12:00:00Z')).toBe('solid')
  })

  it('reads the day in the configured time zone, not in UTC', () => {
    expect(at('2026-11-02T23:30:00Z')).toBe('solid')
  })

  it('falls back to solid without any configuration', () => {
    expect(themeAt({}, new Date('2026-05-15T12:00:00Z'))).toBe('solid')
  })
})

describe('a yearly calendar', () => {
  const config = {
    defaultTheme: 'solid',
    schedule: [
      { theme: 'halloween', from: '10-15', to: '11-02' },
      { theme: 'christmas', from: '12-15', to: '12-26' },
      { theme: 'new-year', from: '12-27', to: '01-03' },
      { theme: 'winter', from: '12-21', to: '03-19' },
      { theme: 'spring', from: '03-20', to: '06-20' },
      { theme: 'summer', from: '06-21', to: '09-22' },
      { theme: 'autumn', from: '09-23', to: '12-20' },
    ],
  }
  it.each([
    ['2026-10-31', 'halloween'],
    ['2026-12-25', 'christmas'],
    ['2026-12-31', 'new-year'],
    ['2027-01-02', 'new-year'],
    ['2027-02-10', 'winter'],
    ['2026-04-10', 'spring'],
    ['2026-07-14', 'summer'],
    ['2026-09-30', 'autumn'],
  ])('picks the theme for %s', (day, theme) => {
    expect(themeAt(config, new Date(`${day}T12:00:00Z`))).toBe(theme)
  })
})
