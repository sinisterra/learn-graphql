import React from 'react'
import Relay from 'react-relay';

const Quote = ({quote: {text, author}}) => (
  <blockquote>
    <p>{text}</p>
    <footer>{author}</footer>
  </blockquote>
)

export default Relay.createContainer(Quote, {
  fragments: {
    quote: () => Relay.QL`
      fragment OneQuote on Quote {
        text
        author
      }
    `
  }
}); 
