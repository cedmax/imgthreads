import React, { useCallback, useState } from 'react'
import Title from './Title'

export default ({ onSubmit }) => {
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sumbit = useCallback(
    e => {
      e.preventDefault()
      setIsSubmitting(true)
      onSubmit(title)
    },
    [title, onSubmit]
  )

  return (
    <form onSubmit={onSubmit}>
      <Title value={title} onChange={setTitle} />
      <input
        onClick={sumbit}
        type="submit"
        value="Send"
        disabled={isSubmitting}
      />
    </form>
  )
}
