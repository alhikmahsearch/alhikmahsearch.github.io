import React from 'react';
import SendIcon from '@mui/icons-material/Send';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';



export default function ContactForm() {
  const [value, setValue] = React.useState(2);
  return (
              <form action="https://formspree.io/f/mleynlbd" method="POST">
                  <input type="email" name="Email" class="form-control" placeholder="Email" required />
                  {/* <select class="form-select mt-3" aria-label="Default select example" name="rating" required>
                    <option selected>Rate the app</option>
                    <option value="5">⭐⭐⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="1">⭐</option>
                </select> */}
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
                  <button type="submit" class="btn btn-success mt-3">Send <SendIcon /></button>

                </form>
  );
}