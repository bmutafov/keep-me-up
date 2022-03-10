# Keep Me Up!

<p align="center">
  <img src="https://i.ibb.co/Xj8CNfQ/Custom-Size-1.png" />
</p>
<p align="center">
  <img src="https://i.ibb.co/H7YPFpK/demo-gif.gif" />
</p>

Simple NodeJS script, which keeps your PC awake when you are away. It detects when there has not been activity since certain threshold and starts moving the mouse to prevent it from sleeping or showing away status.

## Running

### Run via npx

The simplest way is via `npx` if you have NodeJS installed on your machine. Simply open a terminal and type:

```
npx keep-me-up
```

This will start the script. When you want to stop it just exit with `Ctrl+C`.

---

### Running via node

To run with NodeJS on your PC, you have to perform the following steps:

- Make sure you have Node installed on your machine
- Clone the repository and navigate to folder
- run `npm install`
- run `node index.js`

This will start the awake process and will run until you stop with with `Ctrl+C`.

You can create .bat scripts or bash aliases to quickly start and stop the process when needed.
You can also make changes to the code to better adapt it to your use case.

---

### Running via executable

To run via built executables, go to [the releases tab in the repo](https://github.com/mutafow/keep-me-up/releases) and download the latest version of the binaries for your machine. Then run it and it will detect when you are idling and react accordingly. The executable will always use the default settings.

## Options

When running via node or NPX you can set some options:

```
npx keep-me-up [options]

  Options:

    --offset              by how many pixels should the mouse move (default: 1)
    --max-idle            how much time should pass after system is idling before the script moves the mouse, in seconds (default: 120s)
    --random              if provided the mouse will be moved by random amount each time. Overwrites --offset command

  Examples:

    npx keep-me-up --offset 5                     moves the cursor by 5px each 30 seconds
    npx keep-me-up --offset 5 --max-idle 300      moves the cursor by 5px each 300 seconds (5 minutes)
    npx keep-me-up --random                       will move your mouse by random amount of pixels, every 120 seconds
    npx keep-me-up                                default behavior, moves the cursor by 1px after 120 seconds of idling
```
