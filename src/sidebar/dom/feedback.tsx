/** @jsx jsx */
import useMediaRecorder from '@wmik/use-media-recorder'
import React from 'react'
import { Box, jsx } from 'theme-ui'

interface FeedbackProps {}

export function DomSidebarFeedback(props: FeedbackProps) {
  let {
    error,
    status,
    mediaBlob,
    stopRecording,
    getMediaStream,
    startRecording,
  } = useMediaRecorder({
    recordScreen: true,
    blobOptions: { type: 'video/mp4' },
    mediaStreamConstraints: {
      audio: false,
      video: {
        displaySurface: 'browser',
        cursor: 'always',
      },
    },
  })

  return (
    <article>
      <h1>Screen recorder</h1>
      {error ? `${status} ${error.message}` : status}
      <section>
        <button
          type="button"
          onClick={getMediaStream}
          disabled={status === 'ready'}
        >
          Share screen
        </button>
        <button
          type="button"
          onClick={startRecording}
          disabled={status === 'recording'}
        >
          Start recording
        </button>
        <button
          type="button"
          onClick={stopRecording}
          disabled={status !== 'recording'}
        >
          Stop recording
        </button>
      </section>
      <Player srcBlob={mediaBlob} />
    </article>
  )
}

function Player({ srcBlob, audio }: any) {
  if (!srcBlob) {
    return null
  }

  if (audio) {
    return <audio src={URL.createObjectURL(srcBlob)} controls />
  }

  return (
    <video
      src={URL.createObjectURL(srcBlob)}
      width={520}
      height={480}
      controls
    />
  )
}
