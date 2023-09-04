import React from 'react';
import SendIcon from '@mui/icons-material/Send';


export default function ContactForm() {
  return (
              <form action="https://formspree.io/f/mleynlbd" method="POST">
                  <input type="email" name="Email" class="form-control" placeholder="Email" required />
                  <select class="form-select mt-3" aria-label="Default select example" name="rating" required>
                    <option selected>Rate the app</option>
                    <option value="1">1 (Worst)</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5 (Best)</option>
                </select>
                  <div class="mb-3 mt-3">
                      <textarea class="form-control" name="Feedback" rows="5" id="comment" placeholder="Feedback" required></textarea>
                  </div>
                  <button type="submit" class="btn btn-success mt-3">Send <SendIcon /></button>

                </form>
  );
}