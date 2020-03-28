import ApiHost from '@/modules/api-host'
import { GetPostById } from '@payw/eodiro-one-api/api/one/scheme'
import { useState } from 'react'
import ImageViewer from '../ImageViewer'
import './style.scss'

type PostViewerFileContainerProps = {
  files: GetPostById['payload']['data']['files']
}

export const PostViewerFileContainer: React.FC<PostViewerFileContainerProps> = (
  props
) => {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false)
  const [initialImageIndex, setInitialImageIndex] = useState(0)

  const imageFiles = props.files.filter((file) =>
    file.mimeType.startsWith('image/')
  )

  const otherFiles = props.files.filter(
    (file) => !file.mimeType.startsWith('image/')
  )

  return (
    <div id="post-viewer-file-container">
      {/* Images */}
      <div className="images">
        {imageFiles.map((image, i) => {
          return (
            <div
              className="image-container"
              key={image.fileId}
              onClick={() => {
                setInitialImageIndex(i)
                setIsImageViewerOpen(true)
              }}
            >
              <img src={ApiHost.getHost(true) + image.path} alt={image.name} />
            </div>
          )
        })}
      </div>

      <div
        style={{
          visibility: isImageViewerOpen ? 'visible' : 'hidden',
        }}
      >
        <ImageViewer
          srcs={imageFiles.map((image) => ApiHost.getHost(true) + image.path)}
          close={() => {
            setIsImageViewerOpen(false)
          }}
          initialIndex={initialImageIndex}
        />
      </div>

      {/* Other downloadable files */}
      {otherFiles.map((file) => {
        return (
          <a
            href={ApiHost.getHost(true) + file.path}
            className="file d-flex align-items-center"
            key={file.fileId}
          >
            <i className="icon octicon octicon-file" />
            {file.name}
          </a>
        )
      })}
    </div>
  )
}
