import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
// npm install --save-dev @iconify/react @iconify-icons/la
import { Icon, InlineIcon } from '@iconify/react';
import Plane from '@iconify-icons/la/telegram-plane';
import { TwitterTweetEmbed, TwitterTimelineEmbed } from 'react-twitter-embed';
// npm install --save-dev @iconify/react @iconify-icons/fa-solid
import globeAfrica from '@iconify-icons/fa-solid/globe-africa';
import YouTube from 'react-youtube';



function App() {

  const [currentInput, setCurrentInput] = useState('');
  const [richLinks, setRichLinks] = useState([]);

  const getData = async (e, input) => {
    e.preventDefault();
    const httpsRemoved = input.replace('https://', '');
    const httpRemoved = httpsRemoved.replace('http://', '');
    const slashesToTildes = httpRemoved
      .replace(/\//g, '~')
      .replace(/\?/g, '_dm_question_mark_')
      .replace(/\=/g, '_dm_equal_sign_')
      .replace(/\&/g, '_dm_ampersand_')
    const apiResponse = await fetch(`http://localhost:1337/${slashesToTildes}`);
    const responseJson = await apiResponse.json();
    console.log(responseJson);
    setRichLinks((r) => [responseJson, ...r]);

 }

  return (
    <div className="App">
      <main>
        <div className="search-wrapper">
          <form onSubmit={(e) => getData(e, currentInput)}>
            <input className="search-input" type="search" value={currentInput} onChange={(e) => setCurrentInput(e.target.value)}/>
            <button className="submit-button" type="submit"><Icon width={24} height={24} icon={Plane}/></button>
          </form>
        </div>
        <div className="display-wrapper">
          {richLinks.map((r, index) => (
            <div className="result-wrapper">
              {r.twitterUser ? (
                <TwitterTimelineEmbed sourceType="profile" screenName={r.twitterUser} options={{height:400}} />
              ) : null}
              {r.tweetId ? (
                <TwitterTweetEmbed tweetId={r.tweetId} />
              ) : null}
              {!r.twitterUser && !r.tweetId ? (
                <a target="_blank" href={r.url} className="result-card" key={index}>
                  <div className="result-main">
                  <div className="image-wrapper">
                    {!r.primaryImage ? (
                      <Icon width={64} height={64} icon={globeAfrica} />
                    ) : (
                      <img src={r.primaryImage} alt="" className="result-image" />
                    )}
                  </div>
                  <div className="result-details">
                    <h3 className="result-title">
                    {r.title}
                    </h3>
                    <p className="result-desc">
                      {r.description}
                    </p>
                    <p className="result-domain">
                      {r.domain}
                    </p>
                  </div>
                </div>
                    {r.youtubeId ? (
                      <YouTube className="youtube-embed" videoId={r.youtubeId} />
                    ) : null}
                </a>

              ) : null}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
