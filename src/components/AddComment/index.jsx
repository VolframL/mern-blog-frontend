import React from "react";
import { useSelector } from "react-redux";

import { useParams } from "react-router-dom";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

import { selectIsAuth } from "../../redux/slices/auth";
import axios from '../../axios';

export const Index = () => {
  const {id} = useParams();
  const isAuth = useSelector(selectIsAuth);
  const [text, setText] = React.useState('');
  const avatarUrl = window.localStorage.getItem('avatarUrl');

  const onSubmit = async () => {
    try {
      const fields = {
        text,
      }

      await axios.post(`/posts/${id}/comments`, fields);
      setText('');
    } catch (error) {
      console.warn(error);
      alert('Ошибка при создании комментария')
    }
  }



  return (
    (isAuth?
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={`http://localhost:4444${avatarUrl}`}
        />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <Button onClick={onSubmit} variant="contained">Отправить</Button>
        </div>
      </div>
    </> :
    null)
  );
};
