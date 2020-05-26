import React, { Fragment, useCallback, useState, memo } from 'react'
import Block from './Block'
import Carousel from './Carousel'
export default memo(({ values, ownerCode, browserId }) => {
  const [lightBoxOpen, setLightBoxOpen] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(0)

  const openLightbox = useCallback(selectedIndex => {
    setLightBoxOpen(true)
    setSelectedIdx(selectedIndex)
  }, [])
  const closeLightbox = useCallback(selectedIndex => {
    setLightBoxOpen(false)
  }, [])

  return (
    values.length > 0 && (
      <Fragment>
        {values.map((v, i) => (
          <Block
            onClick={() => openLightbox(i)}
            ownerCode={ownerCode}
            browserId={browserId}
            isParent={i === 0}
            key={v.timestamp}
            v={v}
          />
        ))}
        <Carousel
          selectedIdx={selectedIdx}
          lightBoxOpen={lightBoxOpen}
          onClose={closeLightbox}
          values={values}
        />
      </Fragment>
    )
  )
})
