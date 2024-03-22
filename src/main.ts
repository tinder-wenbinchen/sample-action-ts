import * as core from '@actions/core'
import * as github from '@actions/github'
import { wait } from './wait'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')
    const client = github.getOctokit(
      `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`
    )
    const pullRequest = github.context.payload.pull_request
    if (!pullRequest) {
      console.warn(
        'Was not able to determine the related PR/Issue will perform NoOp'
      )
      return
    }
    const issue = pullRequest.number
    const { data } = await client.rest.issues.createComment({
      issue_number: issue,
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      body: `An friendly hello from ${github.context.action} and thanks for raising a PR.`
    })

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${ms} milliseconds ...`)
    console.log(`Starting this action which is written in TS`)

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    // Set outputs for other workflow steps to use
    core.setOutput('comment-id', data.id)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
