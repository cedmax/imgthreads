import React, { useCallback } from 'react'

export default ({ onChange, value, disabled }) => {
  const change = useCallback(
    e => {
      onChange(e.target.value)
    },
    [onChange]
  )
  return (
    <label htmlFor="caption">
      Caption:
      <input
        disabled={disabled}
        onChange={change}
        value={value}
        name="caption"
        type="text"
      />
      <br />
    </label>
  )
}
