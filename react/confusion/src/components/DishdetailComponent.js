import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button,
         Modal, ModalHeader, ModalBody, Row, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { React, Component } from 'react';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => !(val) || (val.length >= len);

class CommentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleModal() {
    this.setState((prevState, props) => ({
      isModalOpen: !prevState.isModalOpen
    }))
  }

  handleSubmit(values) {
    this.toggleModal();
    this.props.postComment(this.props.dishId, values.rating, values.name, values.comment);
  }

  render() {
    return (
      <>
        <Button outline color="secondary" onClick={this.toggleModal}>
          <i className="fa fa-light fa-comment"></i> Submit Comment
        </Button>

        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
          <ModalBody>
            <div className='col-12'>
              <LocalForm onSubmit={this.handleSubmit}>
                <Row className="form-group">
                  <Label htmlFor="rating">Rating</Label>
                  <Control.select model=".rating" name="rating" className="form-control">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Control.select>
                </Row>
                <Row className="form-group">
                  <Label htmlFor=".name">Your Name</Label>
                  <Control.text model=".name" id="name" name="name"
                    placeholder="Your Name"
                    className="form-control"
                    validators={{required, minLength: minLength(3), maxLength: maxLength(15)}} />
                  <Errors
                    className="text-danger"
                    model=".name"
                    show="touched"
                    messages={{
                      required: "Required",
                      minLength: "Must be greater than 2 characters",
                      maxLength: "Must be 15 characters or less"
                    }} />
                </Row>
                <Row className="form-group">
                  <Label htmlFor="comment">Comment</Label>
                  <Control.textarea model=".comment" id="comment" name="comment"
                    rows="6" className="form-control" />
                </Row>
                <Row className="form-group">
                  <Button type="submit" color="primary">Submit</Button>
                </Row>
              </LocalForm>
            </div>
          </ModalBody>
        </Modal>
      </>
    );
  }
}

function RenderDish({dish}) {
  return (
    <FadeTransform in
        transformProps={{
          exitTransform: 'scale(0.5) translateY(-50%)'
        }}>
      <Card>
        <CardImg width="100%" src={baseUrl + dish.image} alt={dish.name} />
        <CardBody>
          <CardTitle>{dish.name}</CardTitle>
          <CardText>{dish.description}</CardText>
        </CardBody>
      </Card>
    </FadeTransform>
  )
}

function RenderComments({comments, postComment, dishId}) {
  if (comments != null) {
    return (
      <div>
        <h4>Comments</h4>
        <ul className='list-unstyled'>
          <Stagger in>
            {comments.map(comment => {
              let id = comment.id;
              let commentText = comment.comment;
              let author = comment.author;
              let options = { year: 'numeric', month: 'short', day: 'numeric' };
              let formattedDate = new Date(comment.date).toLocaleDateString("en-US", options);

              return (
                <Fade in>
                  <div key={id}>
                    <li key={id}>
                      <blockquote className="blockquote">
                        <p className="mb-0">{commentText}</p>
                        <footer className="blockquote-footer">{author}, {formattedDate}</footer>
                      </blockquote>
                    </li>
                  </div>
                </Fade>
              )
            })}
          </Stagger>
        </ul>
        <CommentForm dishId={dishId} postComment={postComment} />
      </div>
    )
  } else {
    return (<div></div>)
  }
}

const Dishdetail = (props) => {
  if (props.isLoading) {
    return (
      <div className='container'>
        <div className='row'>
          <Loading />
        </div>
      </div>
    );
  }
  
  else if (props.errMess) {
    return (
      <div className='container'>
        <div className='row'>
          <h4>{props.errMess}</h4>
        </div>
      </div>
    );
  }

  else if (props.dish != null) {
    return (
      <div className='container'>
        <div className='row'>
          <Breadcrumb>
            <BreadcrumbItem><Link to='/home'>Home</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
          </Breadcrumb>
          <div className='col-12'>
            <h3>{props.dish.name}</h3>
            <hr />
          </div>
        </div>
        <div className='row'>
          <div className='col-12 col-md-5 m-1'>
            <RenderDish dish={props.dish} />
          </div>

          <div className='col-12 col-md-5 m-1'>
            <RenderComments
              comments={props.comments}
              postComment={props.postComment}
              dishId={props.dish.id} />
          </div>
        </div>
      </div>
    );
  } else {
    return (<div></div>);
  }
}

export default Dishdetail;
