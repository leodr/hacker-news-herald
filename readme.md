<div align="center">
    <img src="icon.png" height="200" />
    <h1>Hacker News Herald</h1>
    <p>
        <strong>Sends a copy of the most upvoted recent posts (<code>/best</code>) from Hacker News as an email. Has to be deployed as a CRON job.</strong>
    </p>
</div>

<br><br>

When the script is run, it fetches the 30 best stories from https://news.ycombinator.com/best and composes a nicely styled email out of it.

I personally have it deployed as a CRON job on [Render](https://render.com/), it costs 1$ per month and sends the email every day at 5am. You can deploy it with this button:

<div align="center">
   <a href="https://render.com/deploy?repo=https://github.com/leodr/hacker-news-herald.git">
     <img src="https://render.com/images/deploy-to-render-button.svg" alt="Deploy to Render">
   </a>
</div>

<br><br>

## Environment Variables

The following environment variables need to be set:

- `RESEND_API_KEY`: Your API key from [resend.com](https://resend.com/)
- `RECIPIENT_ADDRESS`: The email address that should receive the newsletter
- `SENDER_ADDRESS`: The email address that will be used as the sender

<br>

## Screenshots

![Screenshot of an example email](screenshot.jpg)

## Development

1. **Requirements**

   You need [Node.js](https://nodejs.org/en/) installed on your system.

2. **Install packages**

   Run `npm install` to install all neccesary packages.

3. **Set environment variables**

   Create a `.env` file in the root of the project and set the environment variables. Example:

   ```
   RESEND_API_KEY=your_resend_api_key
   RECIPIENT_ADDRESS=your_recipient_email
   SENDER_ADDRESS=your_sender_email
   ```

4. **Run the application**

   Compile the TypeScript code by running `npm run build` and then start the script by running `npm start`.
