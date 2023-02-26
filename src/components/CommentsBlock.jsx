import React, {useState, useEffect} from "react";
import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";



export const CommentsBlock = ({ items, children, isLoading }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setComments(items);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <SideBlock title="Комментарии">
      <List>
        {(isLoading ? [...Array(5)] : comments).map((obj, index) => (
          <React.Fragment key={index}>
            {/* <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar alt={obj.author.fullName} src={`http://localhost:4444${obj.author.avatarUrl}`} />
                )}
              </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              ) : (
                <ListItemText
                  primary={obj.author.fullName}
                  secondary={obj.text}
                />
              )}
            </ListItem> */}
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
