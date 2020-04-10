import { Spinner } from '@/components/global/Spinner'
import InfiniteScrollContainer from '@/components/utils/InfiniteScrollContainer'
import { pathIds } from '@/config/paths'
import { visualizeBody } from '@/layouts/BaseLayout/Body'
import ApiHost from '@/modules/api-host'
import getState from '@/modules/get-state'
import mergeClassNames from '@/modules/merge-class-name'
import { oneAPIClient } from '@payw/eodiro-one-api'
import { FetchPostsOfBoard } from '@payw/eodiro-one-api/api/one/scheme'
import { OneApiPayload } from '@payw/eodiro-one-api/api/one/scheme/types/utils'
import { ResizeSensor } from 'css-element-queries'
import _ from 'lodash'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import PostItem from './PostItem'

// Dynamic post container component
type PostContainerProps = {
  boardId: number
}
const PostContainer: React.FC<PostContainerProps> = ({ boardId }) => {
  function isFromPostOrNew(): boolean {
    const lastpage = sessionStorage.getItem('lastpage')
    if (!lastpage) return false
    const writePageRegExp = new RegExp(
      `\/square\/.*\/${pathIds.writePost}`,
      'g'
    )
    return (
      lastpage.match(/\/square\/.*\/[0-9]*/g)?.length > 0 ||
      lastpage.match(writePageRegExp)?.length > 0
    )
  }

  // Get board name from router
  const router = useRouter()
  const boardName = router.query.boardName as string

  // Posts init value with cached ones
  const [posts, setPosts] = useState<OneApiPayload<FetchPostsOfBoard>>([])
  const [isMobile, setIsMobile] = useState(false)
  const postContainerRef = useRef<HTMLDivElement>(null)

  function checkWidth(width: number): void {
    if (width < 400) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }

  useEffect(() => {
    // Check container width for responsive layout
    checkWidth(postContainerRef.current.clientWidth)
    new ResizeSensor(postContainerRef.current, () => {
      checkWidth(postContainerRef.current.clientWidth)
    })
  }, [])

  // Resotre cached data and scroll position
  useEffect(() => {
    if (isFromPostOrNew()) {
      const cached = JSON.parse(sessionStorage.getItem('sbpd'))
      if (cached !== null) {
        setPosts(cached)
      }
      setTimeout(() => {
        window.scrollTo(0, Number(sessionStorage.getItem('sbsp')))
        visualizeBody()
      }, 0)
    } else {
      visualizeBody()
    }
  }, [])

  async function loadMore(): Promise<boolean> {
    const posts = getState(setPosts)
    const newPosts = await oneAPIClient(ApiHost.getHost(), {
      action: 'fetchPostsOfBoard',
      data: {
        boardID: boardId,
        lastPostID: _.last(posts)?.id,
      },
    })

    if (newPosts.length === 0) {
      return false
    }

    const updatedPosts = [...posts, ...newPosts]
    setPosts(updatedPosts)
    sessionStorage.setItem('sbpd', JSON.stringify(updatedPosts))
  }

  async function loadNew(): Promise<void> {
    const posts = getState(setPosts)
    if (posts && posts.length > 0) {
      const payload = await oneAPIClient(ApiHost.getHost(), {
        action: 'fetchRecentPostsOfBoard',
        data: {
          boardID: boardId,
          mostRecentPostID: posts[0].id,
        },
      })
      if (payload && payload.length > 0) {
        sessionStorage.setItem('sbpd', JSON.stringify([...payload, ...posts]))
        const updatedPosts = [...payload, ...posts]
        setPosts(updatedPosts)
      }
    }
  }

  // Poll to update new data
  useEffect(() => {
    // Initial refresh
    loadNew()

    const refreshInterval = setInterval(loadNew, 3000)

    return () => {
      clearInterval(refreshInterval)
    }
  }, [])

  return (
    <div
      className={mergeClassNames('posts-container', isMobile && 'mobile')}
      ref={postContainerRef}
    >
      <InfiniteScrollContainer strategy={loadMore}>
        {posts.length > 0 ? (
          posts.map((post) => {
            return <PostItem key={post.id} boardName={boardName} post={post} />
          })
        ) : (
          <div className="display-flex justify-content-center">
            <Spinner />
          </div>
        )}
      </InfiniteScrollContainer>
    </div>
  )
}

export default PostContainer