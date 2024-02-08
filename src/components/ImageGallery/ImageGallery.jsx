import React, { Component } from 'react';
import { ImageGalleryItem } from '../ImageGalleryItem/ImageGalleryItem';
import { Button } from '../Button/Button';
import { Loader } from '../Loader/Loader';
import css from './ImageGallery.module.css';

export class ImageGallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
    };
  }

  handleLoadMore = () => {
    this.setState((prevState) => ({
      page: prevState.page + 1
    }), () => this.props.onLoadMore());
  };


  componentDidUpdate(prevProps, prevState) {
    if (prevProps.query !== this.props.query || prevState.page !== this.state.page) {
      this.props.onLoadMore();
    }
  }

  render() {
    const { images, isLoading, totalImages } = this.props;
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