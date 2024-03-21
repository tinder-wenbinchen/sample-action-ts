import * as core from '@actions/core'
import { context, getOctokit } from '@actions/github'
import { wait } from './wait'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')
    const { owner, repo } = context.repo
    const issue =
      context.payload.issue?.number ??
      context.payload.pull_request?.number ??
      -1
    if (issue === -1) {
      console.warn(
        'Was not able to determine the related PR/Issue will perform NoOp'
      )
      return
    }
    const client = getOctokit(
      `Bearer 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`
    )
    const { data } = await client.rest.issues.createComment({
      issue_number: issue,
      owner,
      repo,
      body: `An friendly hello from ${context.action} and thanks for raising a PR.`
    })

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${ms} milliseconds ...`)
    console.log(`Starting this action which is written in TS`)

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())
    core.setOutput('comment-id', data.id)

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
