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
    totalImages: 0,
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.query !== this.props.query) {
      this.setState({ images: [], page: 1, totalImages: 0 }, () => this.fetchImages());
    } else if (prevState.page !== this.state.page) {
      this.fetchImages();
    }
  }

  handleLoadMore = () => {
    this.setState((prevState) => ({ page: prevState.page + 1 }));
  };

  fetchImages = () => {
    const { query, perPage } = this.props;
    const { images, totalImages, page } = this.state;
    const apiKey = '41687911-62b9e6d772891b12bf67d3c73';

    if (totalImages > 0 && images.length >= totalImages) {
      return;
    }

    this.setState({ isLoading: true });

    const apiUrl = `https://pixabay.com/api/?q=${query}&page=${page}&key=${apiKey}&image_type=photo&orientation=horizontal&per_page=${perPage}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        this.setState((prevState) => ({
          images: [...prevState.images, ...data.hits],
          totalImages: data.total,
          isLoading: false,
        }));
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
        this.setState({ isLoading: false });
      });
  };

  render() {
    const { images, isLoading, totalImages } = this.state;
    const { query } = this.props;

    return (
      <div>
        {images.length > 0 && (
          <ul className={css.ImageGallery}>
            {images.map((image) => (
              <ImageGalleryItem key={image.id} imageUrl={image.webformatURL} />
            ))}
          </ul>
        )}

        {isLoading && <Loader />}

        {images.length > 0 && !isLoading && totalImages > images.length && (
          <Button onClick={this.handleLoadMore}>Load more</Button>
        )}

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
