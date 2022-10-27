import { useState } from 'react'
import './App.css'
import AWS from 'aws-sdk'

const S3_BUCKET = process.env.REACT_APP_S3_BUCKET
const REGION = 'us-east-2'

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
})

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
})

function App() {
  const [progress, setProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileInput = e => {
    setSelectedFile(e.target.files[0])
  }

  const uploadFile = file => {
    const params = {
      ACL: 'public-read',
      Body: file,
      Bucket: S3_BUCKET,
      ContentType: file.type,
      Key: file.name,
    }

    myBucket
      .putObject(params)
      .on('httpUploadProgress', evt => {
        setProgress(Math.round((evt.loaded / evt.total) * 100))
      })
      .send(err => {
        if (err) console.error(err)
      })
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Image uploader</h1>
        <input type='file' onChange={handleFileInput} />
        <button onClick={() => uploadFile(selectedFile)}>Upload {progress > 0 && 'loading'}</button>
      </header>
    </div>
  )
}

export default App
