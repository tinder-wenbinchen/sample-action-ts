import * as core from '@actions/core'
import * as github from '@actions/github'
import { wait } from './wait'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const token = core.getInput('repo-token', { required: true })
    const ms: string = core.getInput('milliseconds')
    const client = github.getOctokit(token)
    const pullRequest = github.context.payload.pull_request
    //     const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`Checking payload ${payload}.`)
    if (!pullRequest) {
      console.warn(
        'Was not able to determine the related PR/Issue will perform NoOp'
      )
      return
    }
    //     if (pullRequest.base?.ref === "master") {
    //       git fetch origin `${ pullRequest.base?.ref }`
    //     }
    const issue = pullRequest.number
    // const { data } = await client.rest.issues.createComment({
    //   issue_number: issue,
    //   owner: github.context.repo.owner,
    //   repo: github.context.repo.repo,
    //   body: `An friendly hello from ${github.context.action} and thanks for raising a PR.`
    // });

    const { data } = await client.rest.pulls.get({
      pull_number: issue,
      owner: github.context.repo.owner,
      repo: github.context.repo.repo
    })

    console.log(`pr template data ${data}`)

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
