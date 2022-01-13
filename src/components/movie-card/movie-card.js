import './movie-card.css';
import Masonry from 'react-masonry-css';
import {
  LikeOutlined,
  DislikeOutlined,
  LikeFilled,
  DislikeFilled,
  DeleteOutlined
} from '@ant-design/icons';
import _ from 'lodash';

import { Card, Tooltip } from 'antd';

export default function MovieCard({movies, likeFunction, dislikeFunction, deleteMovie, pagination, currentCategories}) {
  const breakpointColumnsObj = {
    default: 4,
    1300: 3,
    900: 2,
    600: 1
  };

  return (
    <Masonry breakpointCols={breakpointColumnsObj}
    className="my-masonry-grid"
    columnClassName="my-masonry-grid_column"
    >
      {_.filter(movies, mv => _.includes(currentCategories, mv.category)).slice((pagination.currentPage -1) * pagination.pageSize, pagination.currentPage * pagination.pageSize).map(movie => <Card key={movie.id}>
        <div>
          <div>{movie.title}</div>
          <div>{movie.category}</div>
        </div>

        <div className='card-function-wrapper'>
          <div>
            <Tooltip placement="top" title="Like">
              <span className='hover-effect like-margin' onClick={() => likeFunction(movie.id)}> <span className='like-margin'>{movie.likes}</span>  
                {_.get(movie, 'dirty', false) && _.get(movie, 'likeAction', null) === 'like' ? <LikeFilled /> : <LikeOutlined />}
              </span>
            </Tooltip>
            <Tooltip placement="top" title="Dislike">
              <span className='hover-effect like-margin' onClick={() => dislikeFunction(movie.id)}> <span className='like-margin'>{movie.dislikes}</span>  
                {_.get(movie, 'dirty', false) && _.get(movie, 'likeAction', null) === 'dislike' ? <DislikeFilled /> : <DislikeOutlined />}
              </span> 
            </Tooltip>
          </div>

          <div className='hover-effect' onClick={() => deleteMovie(movie.id)}>
            <Tooltip placement="top" title="Delete">
              <DeleteOutlined />
            </Tooltip>
          </div>
        </div>

        </Card>
        )}
    </Masonry>
      

  );
}
