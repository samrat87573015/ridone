import React from "react"

function VideoThumbnail({ thumbnailUrl }) {
  return (
    <div className="position-relative bg-dark rounded overflow-hidden" style={{ aspectRatio: "16/9" }}>
      <img src={thumbnailUrl || "/placeholder.svg"} alt="Video thumbnail" className="w-100 h-100 object-fit-cover" />
      <div className="position-absolute top-50 start-50 translate-middle">
        <div
          className="bg-danger rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: "48px", height: "48px" }}
        >
          <i className="fas fa-play text-white"></i>
        </div>
      </div>
    </div>
  )
}

export default VideoThumbnail

