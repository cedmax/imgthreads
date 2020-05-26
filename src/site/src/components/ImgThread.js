import React, { useRef, memo, useState, useEffect } from 'react'
import { useList } from 'react-firebase-hooks/database'
import firebase from 'firebase/app'
import { getOwnerCode } from '../helpers/identity'
import { databaseURL, databasePath } from '../config'
import BlockList from './BlockList'
import 'firebase/database'

firebase.initializeApp({
  databaseURL,
})

export default memo(({ id, browserId, sendingId, onLoad }) => {
  const timeout = useRef(null)
  const [ownerCode, setOwnerCode] = useState(false)
  const [message, setMessage] = useState('Loading...')
  const [values, loading] = useList(
    firebase.database().ref(`/${databasePath}/${id}`).orderByChild('timestamp')
  )

  useEffect(() => {
    if (loading) return

    if (values.length) {
      clearTimeout(timeout.current)
      setOwnerCode(getOwnerCode(values[0].val().id))
    } else {
      setMessage('Wait for it...')
      timeout.current = setTimeout(() => {
        setMessage('Mmm...')
        timeout.current = setTimeout(() => {
          window.location.replace('/')
        }, 3000)
      }, 2000)
    }
  }, [values, loading])

  useEffect(() => {
    if (values.find(v => v.val().id === sendingId)) {
      onLoad()
    }
  }, [values, sendingId, onLoad])

  return (
    <>
      {!values.length && <span>{message}</span>}
      <BlockList values={values} ownerCode={ownerCode} browserId={browserId} />
    </>
  )
})
