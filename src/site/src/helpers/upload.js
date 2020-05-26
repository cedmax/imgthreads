import { lambdaURL } from '../config'

export const getUploadUrl = async ({ file, caption, parent, browserId }) =>
  fetch(lambdaURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: file.name,
      type: file.type,
      caption,
      browserId,
      parent,
    }),
  }).then(response => response.json())

export const upload = async (url, { file, buffer }) =>
  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: new Blob([buffer], { type: file.type }),
  })

export const hide = async (id, { ownerCode, browserId }) =>
  fetch(lambdaURL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, ownerCode, browserId }),
  })
