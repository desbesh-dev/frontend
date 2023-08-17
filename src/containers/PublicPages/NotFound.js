import React from 'react';
import { Link, Redirect } from 'react-router-dom';

const NotFound = () => (

  <div id="notfound">
    <div className="notfound">
      <div className="notfound-404">
        <h1>404</h1>
      </div>
      <h2>Oops! Page not found</h2>
      <p>The page you are looking for is not available, please check spelling or typing mistake. <a href='/'>Return to homepage</a></p>
      <div className="notfound-social">
        <a href="#"><i class="fad fa-home"></i></a>
        <a href="#"><i class="fad fa-facebook"></i></a>
        <a href="#"><i class="fad fa-twitter"></i></a>
        <a href="#"><i class="fad fa-google-plus"></i></a>
      </div>
    </div>
  </div>
);

export default NotFound;
