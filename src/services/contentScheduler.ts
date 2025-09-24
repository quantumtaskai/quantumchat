// Simplified content scheduler - no longer using scraping
import type { BusinessConfig } from '@/types'

export const contentScheduler = {
  needsScraping: () => false,
  isScheduled: () => false,
  getNextScrapeTime: () => null,
  scheduleBusinessScraping: () => {},
  forceScrapeBusiness: () => Promise.resolve(false)
}