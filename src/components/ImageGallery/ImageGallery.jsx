import React, { Component } from 'react';
import { ImageGalleryItem } from '../ImageGalleryItem/ImageGalleryItem';
import { Button } from '../Button/Button';
import { Loader } from '../Loader/Loader';
import css from './ImageGallery.module.css';

export class ImageGallery extends Component {
  state = {
    images: [],
    page: 1,
    isLoading: false,
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.query !== this.props.query) {
      this.setState({ images: [], page: 1 }, () => this.fetchImages());
    }
  }

  fetchImages = () => {
    const { query, perPage } = this.props;
    const { page } = this.state;
    const apiKey = '41687911-62b9e6d772891b12bf67d3c73'; 

    this.setState({ isLoading: true });

    const apiUrl = `https://pixabay.com/api/?q=${query}&page=${page}&key=${apiKey}&image_type=photo&orientation=horizontal&per_page=${perPage}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        this.setState((prevState) => ({
          images: [...prevState.images, ...data.hits],
          page: prevState.page + 1,
          isLoading: false,
        }));
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
        this.setState({ isLoading: false });
      });
  };

  render() {
    const { images, isLoading } = this.state;
    const { query } = this.props;

    return (
      <div>
        <ul className={css.ImageGallery}>
          {images.map((image) => (
            <ImageGalleryItem key={image.id} imageUrl={image.webformatURL} />
          ))}
        </ul>

        {isLoading && <Loader />}

        {images.length > 0 && !isLoading && <Button onClick={this.fetchImages} />}
        {query && images.length === 0 && !isLoading && (
          <p className={css.Message}>
            Sorry! No images were found. Try another keyword for what you are seeking! <br />😊
          </p>
        )}
      </div>
    );
  }
}

ImageGallery.defaultProps = {
  perPage: 12,
};
