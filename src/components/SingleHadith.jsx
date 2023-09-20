import React, {useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

function SingleHadith({hadith}) {
    const generateReferenceLink = (reference) => {
        const [_, source, id] = reference.split(' ');
        let urlBase = '';
        if (source === 'Muslim') {
            urlBase = 'https://sunnah.com/muslim:';
          
        } 
        else{
            urlBase = 'https://sunnah.com/bukhari:';
        }
        return `${urlBase}${id}`;
      };
    
      const referenceLink = generateReferenceLink(hadith["Id"]);
    
    return (
        <div className="container my-4">
          <div className="row">
            <div className="col-12">
              <div className="card" style={{backgroundColor: '#f3f3f3'}}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-6 text-left">
                      <h5 className="card-title">{hadith["English Book Name"]}</h5>
                    </div>
                    <div className="col-6 text-right">
                      <h5 className="card-title" style={{ fontSize: '1.5em' }}>{hadith["Arabic Book Name"]}</h5>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6 text-left">
                      <h6 className="card-subtitle mb-2 text-muted">{hadith["English Chapter Name"]}</h6>
                    </div>
                    <div className="col-6 text-right">
                      <h6 className="card-subtitle mb-2 text-muted" style={{ fontSize: '1.2em' }}>{hadith["Arabic Chapter Name"]}</h6>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6 text-left">
                      <p className="card-text">{hadith["English Hadith"]}</p>
                    </div>
                    <div className="col-6 text-right">
                      <p className="card-text" style={{ fontSize: '1.2em' }}>{hadith["Arabic Hadith"]}</p>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <small className="text-muted">Reference: <a href={referenceLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>{hadith["Id"]}</a></small>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}

export default SingleHadith