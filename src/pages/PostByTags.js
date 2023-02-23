import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import { Post } from '../components/Post';

import { fetchPostsByTag } from '../redux/slices/posts';

export const PostByTags = () => {
  const dispatch = useDispatch();
  const { tag } = useParams();

  const userData = useSelector((state) => state.auth.data);
  const { posts } = useSelector((state) => state.posts);

  const isPostsLoading = posts.status === 'loading';

  useEffect(() => {
    dispatch(fetchPostsByTag(tag));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container spacing={4}>
      <Grid xs={12} item>
        <div style={{ fontSize: 40, color: 'gray' }}>#{tag}</div>
      </Grid>
      <Grid xs={12} item>
        {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
          isPostsLoading ? (
            <Post key={index} isLoading={true} />
          ) : (
            <Post
              key={index}
              id={obj._id}
              title={obj.title}
              imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={3}
              tags={obj.tags}
              isEditable={userData?._id === obj.user._id}
            />
          )
        )}
      </Grid>
    </Grid>
  );
};
