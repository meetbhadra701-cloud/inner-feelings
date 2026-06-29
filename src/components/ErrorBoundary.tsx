import { Component, type ReactNode } from 'react'
import { useI18n } from '../i18n/I18nContext'
import { CONTACT, telHref, mailtoHref } from '../lib/contact'

function ErrorFallback() {
  const { t } = useI18n()
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold">{t('error.title')}</h1>
      <p className="text-ink-muted">{t('error.body')}</p>
      <ul className="space-y-1 font-medium">
        <li>
          <a className="underline" href={telHref}>
            {CONTACT.phoneDisplay}
          </a>
        </li>
        <li>
          <a className="underline" href={mailtoHref}>
            {CONTACT.email}
          </a>
        </li>
      </ul>
      <button
        type="button"
        className="mt-2 rounded-full bg-ink px-6 py-3 font-semibold text-white focus-on-ink"
        onClick={() => window.location.reload()}
      >
        {t('error.reload')}
      </button>
    </main>
  )
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Inner Feelings UI error:', error)
  }

  render() {
    if (this.state.hasError) return <ErrorFallback />
    return this.props.children
  }
}
