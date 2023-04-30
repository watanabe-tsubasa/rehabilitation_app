import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedTherapist, setSelectedTherapist] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [movieCategory, setMovieCategory] = useState('');
  const [selectedMovie, setSelectedMovie] = useState('');
  const [movieMessage, setMovieMessage] = useState('');

  const handleTherapistChange = (event) => {
    setSelectedTherapist(event.target.value);
    setSelectedFilter(event.target.value);
  };

  const handlePatientChange = (event) => {
    setSelectedPatient(event.target.value);
    console.log({selectedPatient});
  };
  
  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const handleSendMessage = async () => {
    console.log({message});
    console.log({selectedPatient});
    const data = {
      userId: selectedPatient,
      messages: [
        {
          type: 'text',
          text: message,
        },
      ],
    };
    console.log(data);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/sendMessage', 
        data, 
        {
          headers: {'Content-Type': 'application/json'}
        });
        console.log(response.data);
      } catch (error) {
        console.error(error.response.data);
      }
    setPatients(patients.map(patient => {
      if (patient.userId === selectedPatient) {
        return {
          ...patient,
          sendMessage: [...patient.sendMessage, message]
        }
      }
      return patient;
    }));
    console.log(patients);
    setMessage('');  
  };

  const movieCategoryChange = (event) => {
    setMovieCategory(event.target.value);
  };

  const handleMovieChange = (event) => {
    setSelectedMovie(event.target.value);
  };

  const handleSendMovieMessage = async () => {
    console.log({movieMessage});
    console.log({sendVideoUrl});
    console.log({selectedPatient});
    const data = {
      userId: selectedPatient,
      messages: [
        {
          type: 'text',
          text: sendVideoUrl,
        },
        {
          type: 'text',
          text: movieMessage,
        },
      ],
    };
    console.log(data);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/sendMovieMessage', 
        data, 
        {
          headers: {'Content-Type': 'application/json'}
        });
        console.log(response.data);
      } catch (error) {
        console.error(error.response.data);
      }
    setMovieMessage('');  
  };

  let title = "";
  let videoId = "";
  // let thumbnail = "";

  if (selectedMovie === "movie1") {
    title = "膝のトレーニング";
    videoId = "aP4blC8vxrQ";
    // thumbnail = "https://example.com/movie1_thumbnail.jpg";
  } else if (selectedMovie === "movie2") {
    title = "股関節のトレーニング";
    videoId = "UaIvzTICYJw";
    // thumbnail = "https://example.com/movie2_thumbnail.jpg";
  } else if (selectedMovie === "movie3") {
    title = "大臀筋のトレーニング";
    videoId = "kYWBBe_A-dU";
    // thumbnail = "https://example.com/movie3_thumbnail.jpg";
  }

  const videoUrl = `https://www.youtube.com/embed/${videoId}`
  const sendVideoUrl = `https://www.youtube.com/watch?v=${videoId}`

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/')
      .then(res => {
        console.log(res.data);
        setPatients(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    patients ?
    <div>
      <h1>リハビリ管理</h1>
      <div className='selecter-wrapper'>
        <h2>条件入力</h2>
        <label htmlFor="therapist">理学療法士：</label>
        <select id="therapist" name="therapist" value={selectedTherapist} onChange={handleTherapistChange}>
          <option value=""></option>
          <option value="therapist1">療法士1</option>
          <option value="therapist2">療法士2</option>
          <option value="therapist3">療法士3</option>
        </select>
        <br />
        <label htmlFor="patient">患者：</label>
        <select id="patient" name="patient" value={selectedPatient} onChange={handlePatientChange}>
          <option value=""></option>
          {selectedFilter === 'all' ? patients.map(patient => {
            return <option key={patient._id} value={patient.userId}>{patient.userName}</option>
          }):
          patients.filter(patient => patient.mainTherapist === selectedFilter).map(patient => {
            return <option key={patient._id} value={patient.userId}>{patient.userName}</option>
          })}
        </select>
        <br />
        <label htmlFor="filter">表示：</label>
        <select id="filter" name="filter" value={selectedFilter} onChange={handleFilterChange}>
          <option value="all">全表示</option>
          <option value={selectedTherapist}>担当</option>
          <option value="is_not_set">初診患者</option>
        </select>
        <br />
      </div>
      <div className='linemessage-wrapper'>
        <h2>患者さんとのコミュニケーション</h2>
          <h3>患者さんからのメッセージ</h3>
          {selectedPatient && patients.filter(patient => patient.userId === selectedPatient)[0].replyMessage && (
            <ul>
              {[...patients.filter(patient => patient.userId === selectedPatient)[0].replyMessage].reverse().map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          )}
          <h3>送信メッセージ</h3>
          {selectedPatient && patients.filter(patient => patient.userId === selectedPatient)[0].sendMessage && (
            <ul>
              {[...patients.filter(patient => patient.userId === selectedPatient)[0].sendMessage].reverse().map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          )}
            <h4>メッセージを送る</h4>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>送信</button>
      </div>
      <div className='movie-wrapper'>
        <h2>動画のやり取り</h2>
          <h3>送信した動画の履歴</h3>
          {selectedPatient && patients.filter(patient => patient.userId === selectedPatient)[0].recommendMovie && (
            <ul>
              {[...patients.filter(patient => patient.userId === selectedPatient)[0].recommendMovie].reverse().map((recommendation, index) => {
                const videoId = recommendation.sendMovieURL.split('v=')[1];
                const videoUrl = `https://www.youtube.com/embed/${videoId}`;
                const title = recommendation.movieMessage;
                return (
                  <li key={index}>
                    <p>{recommendation.sendMovieURL}</p>
                    <iframe
                      width="300"
                      height="200"
                      src={videoUrl}
                      title={title}>
                    </iframe>
                    <p>{recommendation.movieMessage}</p>
                  </li>
                )
              })}
            </ul>
          )}

          <h3>今回お送りする動画</h3>
          <label htmlFor="movieCategory">症例：</label>
          <select id="movieCategory" name="movieCategory" value={movieCategory} onChange={movieCategoryChange}>
            <option value=""></option>
            <option value="knee">膝周り</option>
            <option value="coxa">股関節</option>
            <option value="gluteus">大臀筋</option>
          </select>
          <br />
          <label htmlFor="movie">動画名：</label>
          <select
            id="movie"
            name="movie"
            value={selectedMovie}
            onChange={handleMovieChange}
          >
            <option value={null}></option>
            {movieCategory === "knee" && (
              <>
                <option value="movie1">膝のトレーニング</option>
                {/* 以下、必要な数だけoption要素を追加 */}
              </>
            )}
            {movieCategory === "coxa" && (
              <>
                <option value="movie2">股関節のトレーニング</option>
                {/* 以下、必要な数だけoption要素を追加 */}
              </>
            )}
            {movieCategory === "gluteus" && (
              <>
                <option value="movie3">大臀筋のトレーニング</option>
                {/* 以下、必要な数だけoption要素を追加 */}
              </>
            )}
          </select>
          {/* <label htmlFor="movie">動画名：</label>
          <select id="movie" name="movie" value={selectedMovie} onChange={handleMovieChange}>
            <option value=""></option>
            <option name="knee" value="movie1">膝のトレーニング</option>
            <option name="coxa" value="movie2">股関節のトレーニング</option>
            <option name="gluteus" value="movie3">大臀筋のトレーニング</option>
          </select> */}
          {selectedMovie && (
            <div>
              <h3>{title}</h3>
              <iframe
                width="560"
                height="315"
                src={videoUrl}
                title={title}>
              </iframe>
            </div>
          )}
            <h4>動画と一緒に送るコメント</h4>
            <input
              type="text"
              value={movieMessage}
              onChange={(e) => setMovieMessage(e.target.value)}
            />
            <button onClick={handleSendMovieMessage}>送信</button>
      </div>
    </div>
    :<div><p>now loading...</p></div>
  );
}

export default App;
