import Body from '@/layouts/BaseLayout/Body'
import { NextPage } from 'next'
import React from 'react'
import './ErrorPage.scss'

type ErrorPageProps = {
  statusCode: number
}

const ErrorPage: NextPage<ErrorPageProps> = ({ statusCode }) => {
  const msg =
    statusCode === 500
      ? '서버에 연결할 수 없습니다.'
      : '페이지를 찾을 수 없습니다.'

  return (
    <Body pageTitle={statusCode?.toString()} titleHidden centered>
      <div id="error-page">
        <h1 className="status-code">{statusCode}</h1>
        <p className="manifesto">{msg}</p>
      </div>
    </Body>
  )
}

ErrorPage.getInitialProps = async ({ res, err }): Promise<ErrorPageProps> => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404

  return {
    statusCode,
  }
}

export default ErrorPage
