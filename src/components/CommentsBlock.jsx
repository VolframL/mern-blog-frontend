import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";

import axios from "../axios";


export const CommentsBlock = ({ children }) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const {id} = useParams();

  useEffect(() => {
    axios
      .get(id? `/posts/${id}/comments` : '/comments')
      .then(res => {
        setData(res.data)
        setIsLoading(false);
      })
      .catch(err => {
        console.warn(err);
        alert('Ошибка получения комментариев');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);


  return (
    <SideBlock title="Комментарии">
      <List>
        {(isLoading ? [...Array(5)] : data).map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar alt={obj.user.fullName} src={`http://localhost:4444${obj.user.avatarUrl}`} />
                )}
              </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              ) : (
                <ListItemText
                  primary={obj.user.fullName}
                  secondary={obj.text}
                />
              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
