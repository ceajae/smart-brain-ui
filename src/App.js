import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import './App.css';



const app = new Clarifai.App({
    apiKey: '013dea983487489f8dbf42b7f4f2f430'
});

const particlesOptions = {
    particles: {
       number : {
           value:200,
           density:{
               enable: true,
               value_area:700
           }
       }
    }
}


class App extends Component {
    constructor(){
        super();
        this.state = {
            input : '',
            imageUrl:'',
            box: {},
            route: 'signin',
            isSignedIn: false,
            user: {
                id: '',
                name: '',
                email: '',
                entries:0,
                joined: ''
            }
        }
    }

    loadUser = (data) => {
        this.setState({ user: {
            id: data.id,
            name: data.name,
            email: data.email,
            entries: data.entries,
            joined: data.joined
        }})
    }    


    calculateFaceLocation = (data)=> {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width = Number( image.width);
        const height = Number(image.height);
 
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
        }
    }

    displayFaceBox = (box) => {
        console.log(box)
        this.setState({ box:box })
    }

    onInputChange = (event) => {
        this.setState({input: event.target.value})
    }

    onButtonSubmit = () => {
        this.setState({ imageUrl: this.state.input })
        app.models.predict( Clarifai.FACE_DETECT_MODEL, this.state.input)
        .then( response => this.displayFaceBox(this.calculateFaceLocation(response)))
        .catch( err => console.log(err))
    }

    onRouteChange = (route) => {
        if (route === 'signout') {
            this.setState({ isSignedIn: false })
        } else if (route === 'home') {
            this.setState({ isSignedIn: true })
        }
        this.setState({ route: route })
    }

    render() {
        const { isSignedIn, box, imageUrl, route } = this.state;
        return (
            <div className="App">
                <Particles 
                    className='particles'
                    params={particlesOptions}
                />
                <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
                {
                    route === 'home'
                    ?   <div>   
                            <Logo />
                            <Rank name={this.state.user.name} entries={this.state.user.entries} />
                            <ImageLinkForm  
                                onInputChange= {this.onInputChange}
                                onButtonSubmit= { this.onButtonSubmit}
                            />
                            <FaceRecognition box={ box} imageUrl={ imageUrl} />
                        </div>
                    :(
                        route === 'signin'
                        ? <SignIn loadUser ={this.loadUser} onRouteChange={ this.onRouteChange} />
                        : <Register loadUser={this.loadUser} onRouteChange = {this.onRouteChange} />
                    )
                }
            </div>
        );
    }
}  

export default App;
