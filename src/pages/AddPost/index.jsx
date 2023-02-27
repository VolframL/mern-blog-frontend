import {useRef, useEffect, useState, useCallback, useMemo} from 'react';
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import { selectIsAuth } from "../../redux/slices/auth";
import axios from '../../axios';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

export const AddPost = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);

  // const [isLoading, setLoading] = React.useState(false);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [inputTag, setInputTag] = useState('');
  const [tags, setTags] = useState([]);
  const [imageUrl, setImageUrl] = useState('');

  const isEditing = Boolean(id);

  const inputFileRef = useRef(null);

  const splitTags = (e) => {
    const tag = e.target.value;
    if (tag.length > 15 || tags.length >= 5) {
      return;
    }
    const comma = tag.charAt(tag.length - 1) === ',';

    setInputTag(tag);
    if (comma && !inputTag.includes(',') && inputTag.trim() !== '') {
      const newArr = [...tags, tag.slice(0, -1).trim()];
      setTags(newArr);
      setInputTag('');
    }
  }

  const makeArrayOnBlur = (e) => {
    const tag = e.target.value;
    if (tag) {
      const newArr = [...tags, tag];
      setTags(newArr);
      setInputTag('');
    }
  }

  const deleteTag = (i) => {
    let newArr = [...tags];
    newArr.splice(i,1);
    setTags(newArr);
  }

  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData();
      const file = e.target.files[0];
      formData.append('image', file);
      const {data} = await axios.post('/upload', formData);
      setImageUrl(data.url);
    } catch (error) {
      console.warn(error);
      alert('Ошибка при загрузке файла')
    }
    
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      // setLoading(true);
      const fields = {
        title, 
        text,
        tags,
        imageUrl
      }
      const {data} = isEditing ? 
      await axios.patch(`/posts/${id}`, fields) :
      await axios.post('/posts', fields);
      const _id = isEditing? id : data._id;
      navigate(`/posts/${_id}`);

    } catch (error) {
      console.warn(error);
      alert('Ошибка при создании статьи')

    }
  }

  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({data}) => {
          setTitle(data.title);
          setText(data.text);
          setTags(data.tags);
          setImageUrl(data.imageUrl);
        })
        .catch((error)=> {
          console.warn(error);
        })
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if(window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/"/>
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
      />
      <div className="tags" style={{display: 'flex'}}>
        {tags[0] !== '' ?
          tags.map((name, i) => (
            <Button key={i} onClick={() => deleteTag(i)}>
              {name}
            </Button>
          )):
          <Button key="no tag"> 
          </Button>}            
        <TextField 
          style={{marginLeft: '10px' }}
          classes={{ root: styles.tags }} 
          variant="standard" 
          placeholder="Тэги"
          onBlur={(e) => makeArrayOnBlur(e)}
          value={inputTag}
          onChange={e => splitTags(e)}
          fullWidth
          />
      </div>
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing? 'Сохранить': 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
