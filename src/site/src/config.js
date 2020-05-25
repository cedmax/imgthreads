const config = {
  stage: {
    lambdaURL:
      'https://75pjlrszfi.execute-api.eu-west-1.amazonaws.com/stage/upload',
    imgBaseURL: 'https://img-threads-stage.s3-eu-west-1.amazonaws.com/',
  },
  dev: {
    lambdaURL:
      'https://un314j0ci9.execute-api.eu-west-1.amazonaws.com/dev/upload',
    imgBaseURL: 'https://img-threads-dev.s3-eu-west-1.amazonaws.com/',
  },
  prod: {
    lambdaURL:
      'https://z0wrvghgl5.execute-api.eu-west-1.amazonaws.com/prod/upload',
    imgBaseURL: 'https://img-threads.s3-eu-west-1.amazonaws.com/',
  },
}

export const databaseURL = 'https://ifeeltired.firebaseio.com/'
export const databasePath = process.env.REACT_APP_ENV
export const lambdaURL = config[process.env.REACT_APP_ENV].lambdaURL
export const imgBaseURL = config[process.env.REACT_APP_ENV].imgBaseURL
