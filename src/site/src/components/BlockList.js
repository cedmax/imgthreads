import React from 'react'
import Block from './Block'

export default ({ values, ownerCode, browserId }) =>
  values.length > 0 &&
  values.map((v, i) => (
    <Block
      ownerCode={ownerCode}
      browserId={browserId}
      isParent={i === 0}
      key={v.val().timestamp}
      v={v.val()}
    />
  ))
