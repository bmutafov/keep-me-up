# Simple Keep PC Awake

A simple quick program that keeps your PC awake by moving your mouse by some pixels every time whenever the system has been idling more than the configured time. Default is: moves the mouse 1px back and forth, when the system has been idle for 120 seconds.
It has no interface as is intended to be as simple as possible.

## Run via npx

To run the awake, just open a new terminal and run
`npx simple-keep-pc-awake`
This will start the script. When you want to stop it just exit with `Ctrl+C`.

## Running via node

To keep with node on your pc you have to perform the following steps:

- Make sure you have Node installed on your machine
- Clone the repository and navigate to folder
- run `npm install`
- run `node index.js`

This will start the awake process and will run until you stop with with `Ctrl+C`.

You can create .bat scripts or bash aliases to quickly start and stop the process when needed.

## Running via executable

To run via built executables, go to [the releases tab in the repo](https://github.com/mutafow/simple-keep-pc-awake/releases) and download the latest version of the binaries for your machine. Then simply run it and it will detect when you are idling and react accordingly. The executable will always use the default settings.

## Options

When running via node or NPX you can set some options:

```
npx simple-keep-pc-awake [options]

  Options:

    --offset              by how many pixels should the mouse move (default: 1)
    --max-idle            how much time should pass after system is idling before the script moves the mouse, in seconds (default: 120s)

  Examples:

    npx simple-keep-pc-awake --offset 5                     moves the cursor by 5px each 30 seconds
    npx simple-keep-pc-awake --offset 5 --max-idle 300      moves the cursor by 5px each 300 seconds (5 minutes)
    npx simple-keep-pc-awake                                default behavior, moves the cursor by 1px after 120 seconds of idling
```
