import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";

import axios from "../axios";

export const FullPost = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const {id} = useParams();

  useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then(res => {
        setData(res.data)
        setIsLoading(false);

      })
      .catch(err => {
        console.warn(err);
        alert('Ошибка получения статьи');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  if (isLoading) {
    return <Post isLoading={isLoading}/>
  }


  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl? `http://localhost:4444${data.imageUrl}` : ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text}></ReactMarkdown>
      </Post>
      <CommentsBlock
        items={data.comments}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
