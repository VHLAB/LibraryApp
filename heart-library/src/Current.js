import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import firebaseui from 'firebaseui';


firebase.initializeApp(config);

class App extends React.Component {
  
  constructor(props){
    super(props);
    this.state={
      loggedIn: true,
      hearts: []
    };
    
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }
  
  handleLogin(){
    this.setState({loggedIn: true});
  }
  
  handleLogout(){
    this.setState({loggedIn: false});
  }
  
  render(){
    
    if (this.state.loggedIn){
      return <ListView handleLogout={this.handleLogout} hearts={this.state.hearts}/>
    }else{
      return <LoginView handleLogin={this.handleLogin}/>
    }
  }

  //************************************************************
       //**FEATURES TO ADD FIREBASE**
  //***************************************************************
  componentWillMount() { //without ReactFire
    this.firebaseRef = firebase.database().ref("hearts"); //firebaseRef becomes nodes of hearts
    this.firebaseRef.on("child_added", (heartNode) => { //called at each child_added alert
      this.state.hearts.push(heartNode.val());
      this.setState({
       hearts: this.state.hearts //update this.state.hearts to include the heart node just added
     });
    }).bind(this);
  }

  componentWillUnmount(){
    this.firebaseRef.off();
  }
  //****************************************************************/
}
  
class LoginView extends React.Component{
  
  constructor(props){
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }
  
  handleLogin(){
    // CONSIDER CHANGING USER TO EMAIL
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    var success = true;

    firebase.auth().signInWithEmailAndPassword(user, pass).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("code: " + errorCode + "\n" + errorMessage);
      success = false;
      // ...
    }).then(()=>{
      if(success){this.props.handleLogin()}
    });
  }

  handleSignup(){
    alert("ask admin for sign up");
    /*****************************************************
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    var success = true;

    firebase.auth().createUserWithEmailAndPassword(user, pass).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("code: " + errorCode + "\n" + errorMessage);
      success = false;
      // ...
    }).then(()=>{
      if (success){
        alert("profile successfully created");
        this.props.handleLogin();
      }
    });
    ****************************************************/
  }
  
  render(){
    return (
      <div>
        <span><h1>Visible Heart Library</h1></span><br /><br />
        <form>
        <input id="username" type="text" placeholder="email..." />&nbsp;&nbsp;
        <input id="password" type="password" placeholder="password..." /><br />
        <button type="button" onClick={this.handleLogin}>log in</button>&nbsp;&nbsp;
        <button type="button" onClick={this.handleSignup}>Sign up</button>
        </form>
      </div>
    );
  }
}

class ListView extends React.Component{
  
  constructor(props){
    super(props);
    
    this.state = {
      boolSpecific: false,
      objSpecific: null
    };
    
    this.handleLogout = this.handleLogout.bind(this);
    this.listify = this.listify.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  
  handleLogout(){
    var success = true;
    firebase.auth().signOut().catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("code: " + errorCode + "\n" + errorMessage);
      success = false;
    }).then(()=>{
      if(success){this.props.handleLogout()}
    });
  }
  
  listify(){
    return this.props.hearts.map((heart) => {
      return <li className="list-group-item" onClick={this.handleSelect.bind(this,heart)}>{heart.Numbering}</li> //'NUMBERING' ISNT A PRIMARY KEY...WHAT TO DO
    });
  }
  
  handleSelect(heart){
    this.setState({
      boolSelected: true,
      objSelected: heart
    });
  }
  
  handleClose(){
    this.setState({
      boolSelected: false,
      objSelected: null
    });
  }
  
  render(){
    if (this.state.boolSelected){
      return <SpecificView heart={this.state.objSelected} handleClose={this.handleClose}/>;
    }else{
      return(
        <div>
          <div>
            <span><h1>All hearts</h1>
            <button type="button" onClick={this.handleLogout}>Log out</button></span><br /><br />
          </div>
          <ol className="list-group" id="list">{this.listify()}</ol>
        </div>
      );}
  }
}

class SpecificView extends React.Component{
  constructor(props){
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }
  
  handleClose(){
    this.props.handleClose();
  }
  
  render(){
    //WHICH PROPS ARE MOST IMPORTANT???
    const heart = this.props.heart;
    /*
    return <div><span>Heart#: {heart.HeartNumber}&nbsp;&nbsp;<button type='button' onClick={this.handleClose}>Close</button></span><br /><br />
      <b>Age: </b>{heart.Age}<br /><br />
      <b>Blood Pressure In Vitro (mmHg): </b>{heart['Blood Pressure In Vitro (mmHg)']}<br /><br />
      <b>Body Weight (kgs): </b>{heart['Body Weight (kgs)']}<br /><br />
      <b>CVP In Vitro (mmHg): </b>{heart['CVP In Vitro (mmHg)']}<br /><br />
      <b>Cause of Death: </b>{heart['Cause of Death']}<br /><br />
      <b>Cross Clamp Time: </b>{heart['Cross Clamp Time']}<br /><br />
      <b>Date collected: </b>{heart['Date Collected']}<br /><br />
      <b>Date of Video: </b>{heart['Date of Video']}<br /><br />
      <b>Date of fixation: </b>{heart['Date of fixation']}<br /><br />
      <b>Drug/alcohol intake: </b>{heart['Drugs\\Alcohol\\Tobacco']}<br /><br />
      <b>ECG(available/data): </b>{heart['ECG Available\\Data']}<br /><br />
      <b>Heart Rate In Vitro(bpm): </b>{heart['Heart Rate In Vitro(bmp)']}<br /><br />
      <b>Heart number: </b>{heart['HeartNumber']}<br /><br />
      <b>Height (cm): </b>{heart['Height (cm)']}<br /><br />
      <b>Investigator: </b>{heart['Investigator']}<br /><br />
      <b>Ischemic time before isolation (min): </b>{heart['Ischemic Time before Isolation (min)']}<br /><br />
      <b>Link to ECGs: </b><link src={heart['Link to ECGs']}></link><br /><br />
      <b>Current medical history: </b>{heart['Medical History: Current']}<br /><br />
      <b>Medications: </b>{heart['Medications']}<br /><br />
      <b>Numbering: </b>{heart['Numbering']}<br /><br />
      <b>Past medical history: </b>{heart['Past Medical History']}<br /><br />
      <b>Published in: </b>{heart['Published In']}<br /><br />
      <b>Race: </b>{heart['Race']}<br /><br />
      <b>Sex: </b>{heart['Sex']}<br /><br />
    </div>
    */
    return <div>
      <h2>Heart {heart.HeartNumber}</h2><br />
      <button type='button' onClick={this.handleClose}>Close</button><br /><br />
      <SpecificComp display="Age: " index="Age" heart={heart}/>
      <SpecificComp display="Blood Pressure In Vitro (mmHg): " index="Blood Pressure In Vitro (mmHg)" heart={heart}/>
      <SpecificComp display="Body Weight (kgs): " index="Body Weight (kgs)" heart={heart}/>
      <SpecificComp display="CVP In Vitro (mmHg): " index="CVP In Vitro (mmHg)" heart={heart}/>
      <SpecificComp display="Cause of Death: " index="Cause of Death" heart={heart}/>
      <SpecificComp display="Cross Clamp Time: " index="Cross Clamp Time" heart={heart}/>
      <SpecificComp display="Date Collected: " index="Date Collected" heart={heart}/>
      <SpecificComp display="Date of fixation: " index="Date of fixation" heart={heart}/>
      <SpecificComp display="Drug/alcohol intake: " index="Drugs\\Alcohol\\Tobacco" heart={heart}/>
      <SpecificComp display="ECG (Available/Data): " index="ECG Available\\Data" heart={heart}/>
      <SpecificComp display="Heart Rate In Vitro(bpm): " index="Heart Rate In Vitro(bmp)" heart={heart}/>
      <SpecificComp display="Height (cm): " index="Height (cm)" heart={heart}/>
      <SpecificComp display="Investigator: " index="Investigator" heart={heart}/>
      <SpecificComp display="Ischemic Time before Isolation (min): " index="Ischemic Time before Isolation (min)" heart={heart}/>
      <SpecificComp display="Link to ECGs: " index="Link to ECGs" heart={heart}/>
      <SpecificComp display="Current Medical History: " index="Medical History: Current" heart={heart}/>
      <SpecificComp display="Medications: " index="Medications" heart={heart}/>
      <SpecificComp display="Past Medical History: " index="Past Medical History" heart={heart}/>
      <SpecificComp display="Published In: " index="Published In" heart={heart}/>
      <SpecificComp display="Race: " index="Race" heart={heart}/>
      <SpecificComp display="Sex: " index="Sex" heart={heart}/>      
    </div>
  }
}

class SpecificComp extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    return <div class='container'>
      <h3 className="label">{this.props.display}</h3>
      <div className='panel panel-default'><div class='panel-body'>
        {this.props.heart[this.props.index]}
      </div><br /></div>
    </div>
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

export default App;