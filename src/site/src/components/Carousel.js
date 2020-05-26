import React, { memo } from 'react'
import Carousel, { Modal, ModalGateway } from 'react-images'
import { imgBaseURL } from '../config'

export const FooterCaption = memo(props => {
  const { currentView } = props
  if (!currentView) return <div />
  const { caption } = currentView

  return <span>{caption}</span>
})

const getAltText = ({ data, index }) => {
  if (data.caption) return data.caption
  return `Image ${index + 1}`
}

export default memo(({ lightBoxOpen, values, onClose, selectedIdx }) => (
  <ModalGateway>
    {lightBoxOpen ? (
      <Modal onClose={onClose}>
        <Carousel
          components={{ FooterCaption }}
          currentIndex={selectedIdx}
          formatters={{ getAltText }}
          views={values.map(v => {
            v.source = `${imgBaseURL}${v.file}`
            return v
          })}
        />
      </Modal>
    ) : null}
  </ModalGateway>
))
