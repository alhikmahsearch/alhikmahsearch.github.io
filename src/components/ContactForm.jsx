import React from 'react';
import SendIcon from '@mui/icons-material/Send';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';



export default function ContactForm() {
  const [value, setValue] = React.useState(2);
  return (
              <form action="https://formspree.io/f/mleynlbd" method="POST">
                  
                  <Typography component="legend">Rate the app</Typography>
                  <Rating
                        name="stars"
                        value={value}
                        onChange={(event, newValue) => {
                          setValue(newValue);
                        }}
                      />
                  <div class="mb-3 mt-3">
                      <textarea class="form-control" name="Feedback" rows="5" id="comment" placeholder="How can we improve this app" required></textarea>
                  </div>
                  <input type="email" name="Email" class="form-control" placeholder="Email"/>
                  <button type="submit" class="btn btn-success mt-3">Send <SendIcon /></button>

                </form>
  );
}