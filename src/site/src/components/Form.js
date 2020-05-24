import React, { useCallback, useState } from 'react'
import Caption from './Caption'

export default ({ onSubmit }) => {
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

  return (
    <form onSubmit={onSubmit}>
      <Caption value={caption} onChange={setCaption} disabled={isSubmitting} />
      <input
        onClick={sumbit}
        type="submit"
        value="Send"
        disabled={isSubmitting}
      />
    </form>
  )
}
