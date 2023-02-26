import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags, postsFilter } from '../redux/slices/posts';
export const Home = () => {
  const dispatch = useDispatch();
  const [tab, setTab] = useState('NEW');
  // const [filteredPosts, setFilteredPosts] = useState([...Array(5)]);

  const userData = useSelector(state => state.auth.data);
  const {posts, tags} = useSelector(state => state.posts);

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(postsFilter(tab));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])


  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={tab === 'NEW'? 0 : 1} aria-label="basic tabs example">
        <Tab label="Новые" onClick={() => setTab('NEW')} />
        <Tab label="Популярные" onClick={() => setTab('POPULAR')} />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) => 
            isPostsLoading ? (
              <Post key={index} isLoading={true}/>
            ) : (
              <Post
                key={index}
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl? `http://localhost:4444${obj.imageUrl}` : ''}
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={obj.comments.length}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            )
            )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                author: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это тестовый комментарий',
              },
              {
                author: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
