# baseframe-djs
---
[Getting Started](#start) \
[Starting the bot](#bot) \
[Creating an event](#event) \
[Creating commands](#command) 

---
As base framework for discord.js bot.
We all know starting a new discord.js bot project is annoying. We have to do many repeatative things, like adding command handlers, adding event handlers, performing checks and whatnot. \
Well, for that exact reason, baseframe-djs exists! This is basically a template for discord.js bots (an advanced one, for sure) which you can use! \
You don't have to worry about making the boring stuff anymore. And feel free to open an Issue if there comes one, or discuss things in discussions tab! \
The code is pretty easy to understand, though it might not be for first time users. So, the basic gist will be given here! \
The code exists in the `master` branch.

## <a name="start"></a>Getting started
To get started, just switch over to the `master` branch and use it as a template! Or clone it to your device using a pull request, and things. \
Then, in the console to the directory root where you cloned it, run `npm i` to install all the dependencies! \
That's it!

## <a name="bot"></a>Starting the bot
To start the bot, all you have to do is add your bot token to a `.env` file and a mongodb URL (you can use localhost):
```.env
URL=mongodb://localhost:3000/your_db_name
TOKEN=your_token_here
```
You can replace the URL with the url of your database (it's free) \
Now run `npm start` to start your bot!

## <a name="event"></a>Creating an event
Creating an event is simple! Just go to the `events` folder and copy the `event.base.js` file contents to a new file in the same folder! Then, change the `EventName` variable to the CASE SENSITIVE event name you want to use! \
After that, scroll down to the `call()` function inside the `Event` class, and begin coding! \
The discord bot client is stored in `this.client` variable. If you're using an event that has an argument in callback, make sure to add it in all places as follows:
```js
// call() event in Event class
call(your_argument, your_argument_two) {
  //...
}

//...

//call: (client) in module.exports
call: (client, your_argument, your_argument_two) => {
        if(!Instance.initiated) Instance.init(client);

        Instance.call(your_argument, your_argument_two);

    }
```

## <a name="command"></a>Creating a command
Creating a command is similar to creating an event. Go over to the `commands` folder, and inside it will be a `dev` folder. So, now your folder should be `root/commands/dev`. \
In that folder, there is a `$command.base.js` file. Similar to event, copy the code and create a new file in any of the folders inside the `root/commands` folder (these act as categories) or create a new one! And paste it there. \
Now you can replace the `CommandUseName` variable with the command name of your choice, and this one is NOT case sensitive, so you should use it the way you'd like it to be displayed in a help message. \
Now all you have to do is scroll down to the `call(message)` function and get coding!

## And there you go! Now you can successfully use baseframe-djs like a pro! Have fun coding!
