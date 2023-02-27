import React, {useRef} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
// import {useForm} from 'react-hook-form';
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";
import Avatar from '@mui/material/Avatar';

import axios from '../../axios';

import styles from './Login.module.scss';

export const Registration = () => {
  const [avatarUrl, setAvatarUrl] = React.useState(null);
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const isAuth = useSelector(selectIsAuth);

  const inputFileRef = useRef(null);
  const dispatch = useDispatch();

  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData();
      const file = e.target.files[0];
      formData.append('image', file);
      const {data} = await axios.post('/uploadAvatar', formData);
      setAvatarUrl(data.url);
    } catch (error) {
      console.warn(error);
      alert('Ошибка при загрузке файла')
    }
    
  };

  if(isAuth) {
    return <Navigate to="/"/>
  }

  const onSubmit = async () => {
    try {
      // setLoading(true);
      const fields = {
        fullName, 
        email,
        password,
        avatarUrl: avatarUrl ?? '/uploads/noavatar.png'
      }

      const data = await dispatch(fetchRegister(fields));

      if(!data.payload) {
        return alert('Не удалось зарегистрироваться');
      }

      if ('token' in data.payload) {
        window.localStorage.setItem('token', data.payload.token);
      }
      if ('avatarUrl' in data.payload) {
        window.localStorage.setItem('avatarUrl', data.payload.avatarUrl);
      }

    } catch (error) {
      console.warn(error);
      alert('Ошибка при регистрации')

    }
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        {avatarUrl? (
          <Avatar 
          onClick={() => inputFileRef.current.click()} 
          sx={{ width: 100, height: 100 }}
          alt="avatar"
          src={`http://localhost:4444${avatarUrl}`}  />
        ):(
          <Avatar 
          onClick={() => inputFileRef.current.click()} 
          sx={{ width: 100, height: 100 }}/>
        )}
      </div>
        <input 
          ref={inputFileRef} 
          type="file" 
          onChange={handleChangeFile} 
          hidden/>
        <TextField 
          className={styles.field} 
          label="Полное имя" 
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          fullWidth/>
        <TextField 
          className={styles.field} 
          label="E-Mail" 
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth/>
        <TextField 
          type='password'
          className={styles.field} 
          label="Пароль" 
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth/>
        <Button onClick={onSubmit} size="large" variant="contained" fullWidth>
          Зарегистрироваться
        </Button>
      {/* <form onSubmit={handleSubmit(onSubmit)}>

        <input 
          // ref={inputFileRef} 
          type="file" 
          onChange={handleChangeFile} 
          hidden 
          error={Boolean(errors.avatarUrl?.message)}
          helperText={errors.avatarUrl?.message}
          {...register('inputFileRef')}
          />
        <TextField 
          className={styles.field} 
          label="Полное имя" 
          fullWidth 
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName', {required: 'Укажите имя'})}/>
        <TextField 
          className={styles.field} 
          label="E-Mail" 
          fullWidth 
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', {required: 'Укажите email'})}/>
        <TextField 
          className={styles.field} 
          label="Пароль" 
          fullWidth 
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}   
          {...register('password', {required: 'Укажите пароль'})}/>
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Зарегистрироваться
        </Button> 
        </form>*/}
    </Paper>
  );
};
