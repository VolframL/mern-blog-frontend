import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { fetchPostById } from "../redux/slices/posts";

// import axios from "../axios";

export const FullPost = () => {
  const dispatch = useDispatch();

  const {post} = useSelector(state => state.posts);
  const isPostLoading = post.status === 'loading';
  const {id} = useParams();

  useEffect(() => {
    dispatch(fetchPostById(id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isPostLoading) {
    return <Post isLoading={isPostLoading}/>
  }


  return (
    <>
      <Post
        id={post.post._id}
        title={post.post.title}
        imageUrl={post.post.imageUrl? `http://localhost:4444${post.post.imageUrl}` : ''}
        user={post.post.user}
        createdAt={post.post.createdAt}
        viewsCount={post.post.viewsCount}
        // commentsCount={10}
        commentsCount={post.post.comments.length}
        tags={post.post.tags}
        isFullPost
      >
        <ReactMarkdown children={post.post.text}></ReactMarkdown>
      </Post>
      <CommentsBlock
        items={post.post.comments}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  ); 
};
