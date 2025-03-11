import React, { useState } from "react"

function VideoPlayer({ thumbnailUrl, videoUrl, title }) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="position-relative bg-dark rounded overflow-hidden" style={{ aspectRatio: "16/9" }}>
      {!isPlaying ? (
        <>
          <img src={thumbnailUrl || "/placeholder.svg"} alt={title} className="w-100 h-100 object-fit-cover" />
          <button
            onClick={() => setIsPlaying(true)}
            className="position-absolute top-50 start-50 translate-middle border-0 bg-transparent"
          >
            <div
              className="bg-danger rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "64px", height: "64px" }}
            >
              <i className="fas fa-play fa-2x text-white"></i>
            </div>
          </button>
          <div className="position-absolute bottom-0 start-50 translate-middle-x text-white fs-5 fw-medium mb-4">
            {title}
          </div>
        </>
      ) : (
        <iframe
          width="100%"
          height="100%"
          src={videoUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  )
}

export default VideoPlayer

