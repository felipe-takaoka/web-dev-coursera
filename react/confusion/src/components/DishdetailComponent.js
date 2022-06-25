import { Card, CardImg, CardText, CardBody, CardTitle } from 'reactstrap';
import React from 'react';

function RenderDish({dish}) {
  return (
    <Card>
      <CardImg width="100%" src={dish.image} alt={dish.name} />
      <CardBody>
        <CardTitle>{dish.name}</CardTitle>
        <CardText>{dish.description}</CardText>
      </CardBody>
    </Card>
  )
}

function RenderComments({comments}) {
  if (comments != null) {
    return (
      <div>
        <h4>Comments</h4>
        <ul className='list-unstyled'>
          {comments.map(comment => {
            let id = comment.id;
            let commentText = comment.comment;
            let author = comment.author;
            let options = { year: 'numeric', month: 'short', day: 'numeric' };
            let formattedDate = new Date(comment.date).toLocaleDateString("en-US", options);

            return (
              <div key={id}>
                <li key={id}>
                  <blockquote className="blockquote">
                    <p className="mb-0">{commentText}</p>
                    <footer className="blockquote-footer">{author}, {formattedDate}</footer>
                  </blockquote>
                </li>
              </div>
            )
          })}
        </ul>
      </div>
    )
  } else {
    return (<div></div>)
  }
}

const Dishdetail = (props) => {
  if (props.dish != null) {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-12 col-md-5 m-1'>
            <RenderDish dish={props.dish} />
          </div>

          <div className='col-12 col-md-5 m-1'>
            <RenderComments comments={props.dish.comments} />
          </div>
        </div>
      </div>
    );
  } else {
    return (<div></div>);
  }
}

export default Dishdetail;
