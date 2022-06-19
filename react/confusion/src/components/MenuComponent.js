import React, { Component } from 'react';
import { Media } from 'reactstrap';

class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      idxSelected: 0,
      dishes: [
        {
          id: 0,
          name:'Uthappizza',
          image: 'assets/images/uthappizza.png',
          category: 'mains',
          label:'Hot',
          price:'4.99',
          description:'A unique combination of Indian Uthappam (pancake) and Italian pizza, topped with Cerignola olives, ripe vine cherry tomatoes, Vidalia onion, Guntur chillies and Buffalo Paneer.'                        },
       {
          id: 1,
          name:'Zucchipakoda',
          image: 'assets/images/zucchipakoda.png',
          category: 'appetizer',
          label:'',
          price:'1.99',
          description:'Deep fried Zucchini coated with mildly spiced Chickpea flour batter accompanied with a sweet-tangy tamarind sauce'                        },
       {
          id: 2,
          name:'Vadonut',
          image: 'assets/images/vadonut.png',
          category: 'appetizer',
          label:'New',
          price:'1.99',
          description:'A quintessential ConFusion experience, is it a vada or is it a donut?'                        },
       {
          id: 3,
          name:'ElaiCheese Cake',
          image: 'assets/images/elaicheesecake.png',
          category: 'dessert',
          label:'',
          price:'2.99',
          description:'A delectable, semi-sweet New York Style Cheese Cake, with Graham cracker crust and spiced with Indian cardamoms'                        }
       ],
    }

    this.handleSelectNext = this.handleSelectNext.bind(this);
    this.handleSelectPrev = this.handleSelectPrev.bind(this);
  }

  addToIdx(idx, val, len) {
    let newVal = (idx + val) % len;
    return (newVal >= 0) ? newVal : len + newVal;
  }

  handleSelectPrev() {
    this.setState((state) => ({idxSelected: this.addToIdx(state.idxSelected, -1, state.dishes.length)}))
  }

  handleSelectNext() {
    this.setState((state) => ({idxSelected: this.addToIdx(state.idxSelected, +1, state.dishes.length)}))
  }
  
  render() {
    const menu = this.state.dishes.map((dish, idx) => {
      const divStyle = 'col-12 mt-5' + ( (idx === this.state.idxSelected) ? ' border border-primary' : '')
      return (
        <div key={dish.id} className={divStyle}>
          <Media tag='li'>
            <Media left middle>
              <Media object src={dish.image} alt={dish.name} />
            </Media>
            <Media body className='ml-5'>
              <Media heading>{dish.name}</Media>
              <p>{dish.description}</p>
            </Media>
          </Media>
        </div>
      );
    });

    return (
      <div className='container'>
        <div className='row mt-5'>
          <div className='col'>
            <button 
              onClick={this.handleSelectPrev}
              type='button'
              className='btn btn-primary btn-block'>
                &lt;
            </button>
          </div>
          <div className='col text-center'>
            <h2>{this.state.idxSelected}</h2>
          </div>
          <div className='col'>
            <button 
              onClick={this.handleSelectNext}
              type='button'
              className='btn btn-primary btn-block'>
                &gt;
            </button>
          </div>
          
        </div>
        <div className='row'>
          <Media list>
            {menu}
          </Media>
        </div>
      </div>
    );
  }
}

export default Menu;
