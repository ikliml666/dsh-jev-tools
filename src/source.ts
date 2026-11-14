/**
 * The one producer identity every message this plugin appends carries.
 *
 * Session format v4 has no shared catch-all source kind: each message states
 * *who* produced it, and the retired `{ kind: 'plugin', plugin }` wrapper is
 * refused outright — the writer fails the whole turn with
 * `format v4 message requires a producer-owned source kind`. So `kind` is this
 * plugin's own name, with no `plugin:` prefix.
 *
 * `form: 'snapshot'` is the shape the harness's own context producers use
 * (`agent-instructions`, `skill-catalog`) and the one
 * `@deepseek-ai/dsh-frontend-design` uses for its `agent/pre-step` reminder, so
 * an injected notice renders as `上下文注入 · dsh-jev-tools` beside the others.
 * The `notice` form instead keeps the producer as `plugin:dsh-jev-tools` and
 * appends the summary to the collapsed row, which reads like an internal log
 * line rather than a context injection.
 *
 * @module dsh-jev-tools/source
 */

/** Plugin identity used in the injected notice's source. */
export const PLUGIN_ID = 'dsh-jev-tools'

/**
 * Producer-owned source kind for every durable message this plugin appends.
 *
 * A literal `'plugin'` kind is reserved by the session format as the retired
 * wrapper and is rejected on write; the producer's own name is the kind.
 */
export const PLUGIN_SOURCE_KIND = PLUGIN_ID

/** One named contribution inside an injected snapshot. */
export interface NoticeSection {
  readonly name: string
  readonly text: string
}

/**
 * The source of one advisory this plugin injects.
 *
 * `kind` answers who produced it. `form: 'snapshot'` answers what kind of thing
 * it is — producer-supplied context attached to this step — and `sections`
 * carries its named contributions, which is what the chat row expands to.
 */
export interface NoticeSource {
  readonly kind: string
  readonly form: 'snapshot'
  readonly sections: readonly NoticeSection[]
}

/**
 * Build the source of one injected notice.
 *
 * @param text - one-line account of what the judgment did.
 * @returns the `snapshot`-form source for this plugin's message.
 */
export function noticeSource (text: string): NoticeSource {
  return {
    kind: PLUGIN_SOURCE_KIND,
    form: 'snapshot',
    sections: [{ name: PLUGIN_SOURCE_KIND, text }],
  }
}
