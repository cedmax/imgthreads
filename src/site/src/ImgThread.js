import React, { memo } from 'react'
import { useList } from 'react-firebase-hooks/database'
import firebase from 'firebase'

const baseUrl = 'http://img-threads.s3-eu-west-1.amazonaws.com/'
firebase.initializeApp({
  databaseURL: 'https://ifeeltired.firebaseio.com',
})

export default memo(({ id }) => {
  const [values, loading, error] = useList(
    firebase.database().ref(`/${id}`).orderByChild('timestamp')
  )
  return (
    <div>
      <p>
        {error && <strong>Error: {error}</strong>}
        {loading && <span>List: Loading...</span>}
        {!loading && values && (
          <React.Fragment>
            <span>
              List:{' '}
              {values.map(v => (
                <img
                  key={v.key}
                  width={100}
                  src={`${baseUrl}${v.val().file.replace('r/', 't/')}`}
                />
              ))}
            </span>
          </React.Fragment>
        )}
      </p>
    </div>
  )
})
