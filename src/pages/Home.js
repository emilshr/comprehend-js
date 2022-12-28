import React, { Component } from 'react';
import { renderToString } from 'react-dom/server'
import { Button, Container, Dropdown, Form, Icon, TextArea } from 'semantic-ui-react';
import ContentEditable from "react-contenteditable";
import './Home.css';

import { startAudio, stopAudio } from '../audio/miceAudioStream';
import getCredentials from '../services/getTranscribeCredentials';
import runComprehend from '../comprehend/comprehendUtil';
import { TranscriptHTML, TranscriptLine } from '../comprehend/TranscriptLine';

function App() {

  return (
    <HomeScreen/>
  );
}

export default App;

class HomeScreen extends Component {

  constructor(props){  
    super(props);  
    this.state = { listening: false, transcriptPiece: "", clientCredentials: {}, transcriptionHtml: ""};
  }

  componentDidMount() {
  }

  startRecording = () => {
    const result = getCredentials();
    
      startAudio(this.toggleStartStop, this.getTranscript, result);
      this.setState({clientCredentials: result});
    
  }

  getTranscript = (transcript, isFinal) => {
    if (isFinal) {
      runComprehend(transcript, this.state.clientCredentials)
      .then(entities => {
        let htmltxt = renderToString(<TranscriptLine chunk={transcript} results={entities}/>)
        this.setState({ transcriptionHtml: this.state.transcriptionHtml + htmltxt, transcriptPiece: ''})
      })
    } else {
      this.setState({transcriptPiece: transcript + "\n"})
    }
    this.scrollToBottom();
  }

  endRecording = () => {
    stopAudio();
  }

  toggleStartStop = () => {
    this.setState({listening: !this.state.listening})
  }

  scrollToBottom = () => {
    if(this.textarearef) {
     this.textarearef.scrollIntoView({ behavior: "smooth" })
    }
  }

  render() {
    const {listening, transcriptPiece, textchunks, comprehendResults, line, transcriptionHtml} = this.state;

    return (
      <div>
        <Container text style={{ marginTop: '2em' }}>
          <Form>
            <div className='homepage'>
              <ContentEditable ref={this.editableref} className="editable" html={transcriptionHtml+transcriptPiece} name='transcription'/>
              {listening ? '' : <Icon name="microphone" className="mice" link onClick={this.startRecording}/> }
              {listening ? <Icon name="mute" className="mute" link onClick={this.endRecording}/> :''}
            </div>
            </Form>
        </Container>
      </div>
    );
  }
}