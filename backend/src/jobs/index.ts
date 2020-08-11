import { startProcessMailQueue } from './send-mails-from-queue'
import { removeInvalidRequestNewPasswordToken } from './remove-invalid-request-new-password-token'
import { removeUnconfirmedLocalSignUps } from './remove-unconfirmed-local-sign-ups'

export const startCronJobs = () => {
  const CronJob = require('cron').CronJob

  // every 10 seconds
  new CronJob('*/10 * * * * *', async () => await startProcessMailQueue()).start()

  // every day at 23:00
  new CronJob('0 0 23 * * *', async () => await removeInvalidRequestNewPasswordToken()).start()

  // every day at 23:01
  new CronJob('0 1 23 * * *', async () => await removeUnconfirmedLocalSignUps()).start()
}

export default {
  startCronJobs
}
