import React, { useCallback, useState } from 'react'
import Caption from './Caption'

export default ({ onSubmit, onCancel }) => {
  const [caption, setCaption] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sumbit = useCallback(
    e => {
      e.preventDefault()
      setIsSubmitting(true)
      onSubmit(caption)
    },
    [caption, onSubmit]
  )

  const cancel = useCallback(() => onCancel(), [onCancel])

  return (
    <form onSubmit={onSubmit}>
      <Caption value={caption} onChange={setCaption} disabled={isSubmitting} />
      <div className="actions">
        <button onClick={sumbit} type="submit" disabled={isSubmitting}>
          Send
        </button>
        <button
          onClick={cancel}
          type="button"
          className="hide"
          disabled={isSubmitting}
        >
          cancel
        </button>
      </div>
    </form>
  )
}
