import './main.css';
import { movies$ } from '../../shared/movies';
import MovieCard from '../../components/movie-card/movie-card';
import _ from 'lodash';

import React, { useState, useEffect } from 'react';

import { Pagination, Select } from 'antd';
const { Option } = Select;

export default function Main() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setfilters] = useState({categories: [], selectedCategories: [], pagination: {pageSize: 4, tolalNumberOfEle: 0, currentPage: 1}});

  function likeFunction(movieId) {
    const movieList = [...movies];
    const selectedMovie = _.find(movieList, movie => movie.id === movieId);
    var updatedMovieList = [];
    if (selectedMovie.dirty) {
      switch(selectedMovie.likeAction) {
        case 'like':
          updatedMovieList = _.map(movieList, movie => movie.id === movieId ? {...movie, likes: movie.likes - 1, dirty: false, likeAction: null} : movie);
          break;
        case 'dislike' :
          updatedMovieList = _.map(movieList, movie => movie.id === movieId ? {...movie, likes: movie.likes + 1, dislikes: movie.dislikes - 1, dirty: true, likeAction: 'like'} : movie);
          break;
        default :
          updatedMovieList = _.map(movieList, movie => movie.id === movieId ? {...movie, likes: movie.likes + 1 , dirty: true, likeAction: 'like'} : movie);
          break;
      }
    } else {
      updatedMovieList = _.map(movieList, movie => movie.id === movieId ? {...movie, likes: movie.likes + 1 , dirty: true, likeAction: 'like'} : movie);
    }
    setMovies(updatedMovieList)
  }

  function dislikeFunction(movieId) {
    const movieList = [...movies];
    const selectedMovie = _.find(movieList, movie => movie.id === movieId);
    var updatedMovieList = []
    if (selectedMovie.dirty) {
      switch(selectedMovie.likeAction) {
        case 'like':
          updatedMovieList = _.map(movieList, movie => movie.id === movieId ? {...movie, likes: movie.likes - 1, dislikes: movie.dislikes + 1, dirty: true, likeAction: 'dislike'} : movie);
          break;
        case 'dislike' :
          updatedMovieList = _.map(movieList, movie => movie.id === movieId ? {...movie, dislikes: movie.dislikes - 1, dirty: false, likeAction: null} : movie);
          break;
        default :
          updatedMovieList = _.map(movieList, movie => movie.id === movieId ? {...movie, dislikes: movie.dislikes + 1 , dirty: true, likeAction: 'dislike'} : movie);
          break;
      }
    } else {
      updatedMovieList = _.map(movieList, movie => movie.id === movieId ? {...movie, dislikes: movie.dislikes + 1 , dirty: true, likeAction: 'dislike'} : movie);
    }
    setMovies(updatedMovieList)
  }

  function deleteMovie(movieId) {
    const movieIndex = _.findIndex(movies, movie => movie.id === movieId);
    const selectedMovieCategory = _.find(movies, movie => movie.id === movieId).category;
    const catogoryCheck = _.filter(movies, movie => movie.category === selectedMovieCategory);
    var movieList = [...movies];
    movieList.splice(movieIndex, 1);
    setMovies(movieList);
    const updatedCategoryList = _.uniq(_.map(movies, movie => movie.category));
    setfilters(currentfilters => ({...currentfilters, categories: updatedCategoryList,
       selectedCategories: catogoryCheck.length > 0 ? currentfilters.selectedCategories : _.filter(currentfilters.selectedCategories, cat => cat !== selectedMovieCategory)}));
  }

  async function component() {
    if (loading) {
      await movies$.then(result => {
        const movieList = _.map(result, dt => ({...dt, dirty: false, likeAction: null}));
        setMovies(movieList);
        setfilters(currentfilters => ({
          categories: [..._.uniq(_.map(movieList, dt => dt.category))],
          selectedCategories: [..._.uniq(_.map(movieList, dt => dt.category))],
          pagination: {...currentfilters.pagination, tolalNumberOfEle: movieList.length}}));
     }).catch(err => console.log('There was an error:' + err));
     setLoading(false);
    } else {
      return;
    }
  }

  function itemRender(current, type, originalElement) {
    if (type === 'prev') {
      return <a>Previous</a>;
    }
    if (type === 'next') {
      return <a>Next</a>;
    }
    return originalElement;
  }

  function handleChangeCategory(value) {
    setfilters(currentfilters => ({...currentfilters, selectedCategories: value, pagination: {...currentfilters.pagination,
       tolalNumberOfEle: _.filter(movies, movie => _.includes(value , movie.category)).length, currentPage: 1}}))
  }

  function handleChangePage(value) {
    setfilters(currentfilters => ({...currentfilters, pagination: {...currentfilters.pagination, currentPage: value}}))
  }

  function handleChangeSize(currentPage, value) {
    setfilters(currentfilters => ({...currentfilters, pagination: {...currentfilters.pagination, currentPage: currentPage, pageSize: value}}))
  }

  useEffect(() => {
    component();
  }, []);

  return (
    <div className='main-wrapper'>

      <MovieCard  movies={movies} likeFunction={likeFunction} dislikeFunction={dislikeFunction}
        deleteMovie={deleteMovie} pagination={filters.pagination}
        currentCategories={filters.selectedCategories}
      />
      
      <div className='filters-wrapper'>
        <Pagination 
          size="small" 
          total={filters.pagination.tolalNumberOfEle} 
          showSizeChanger 
          itemRender={itemRender}
          onChange={handleChangePage}
          onShowSizeChange={handleChangeSize}
          pageSize={filters.pagination.pageSize}
          pageSizeOptions={[4,8,12]}
          current={filters.pagination.currentPage}
        />

        <Select 
          value={filters.selectedCategories} mode="multiple" size='small' 
          showArrow={true}
          onChange={handleChangeCategory}>
            {filters.categories.map(category => <Option key={category} value={category}>{category}</Option>)}
        </Select>
      </div>

    </div>
  );
}
