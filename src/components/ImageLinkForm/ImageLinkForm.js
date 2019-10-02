import React from 'react';
import './ImageLinkForm.css';


const ImageLinkForm  = ({ onInputChange, onButtonSubmit })=> {
    return(
        <div>
            <p className='fw6'>
                    {'This Magic Brain will detect faces in your pictures. Give it a try'}
            </p>
            <div className='center'>
                <div className= 'center form pa4 br3 shadow-5'>
                    <input className='center' type='text' onChange= {onInputChange } aria-label="Image URL" />
                    <button 
                        className='f7 pa2 grow fw6 white bg-light-purple '
                        onClick={ onButtonSubmit }
                        >Detect</button>
                </div>
            </div>
        </div>
    )
}

export default ImageLinkForm;