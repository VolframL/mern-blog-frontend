import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { useParams } from "react-router-dom";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

import { selectIsAuth } from "../../redux/slices/auth";

import { addComment } from "../../redux/slices/posts";

export const Index = () => {
  const dispatch = useDispatch();
  const {id} = useParams();

  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector(state => state.auth.data);
  const [text, setText] = React.useState('');

  const onSubmit = async () => {
    try {
      
      const fields = {
        id,
        text,
        author: userData._id,
        timestamps: Date.now()
      }
      dispatch(addComment(fields));
      setText('');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    (isAuth?
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={`http://localhost:4444${userData.avatarUrl}`}
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
