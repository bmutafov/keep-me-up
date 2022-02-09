# Simple Keep PC Awake

A simple quick program that keeps your PC awake by moving your mouse by 1px diagonally every 30 seconds. It has no interface as is intended to be as simple as possible.

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

To run via built executables, go to [the releases tab in the repo](https://github.com/mutafow/simple-keep-pc-awake/releases) and download the latest version of the binaries for your machine. Then simply run it when you need to keep your PC awake and close it when you don't!

## Options

When running via node or NPX you can set some options:

```
npx simple-keep-pc-awake [options]

  Options:

    --quiet               quiet mode, does not output any logs (default: false)
    --offset              by how many pixels should the mouse move (default: 1)
    --interval            how much time should pass before mouse is moved again, in seconds (default: 30s)

  Examples:

    npx simple-keep-pc-awake --quiet --offset 5             moves the cursor by 5px each 30 seconds, in quiet mode
    npx simple-keep-pc-awake --offset 5 --interval 100      moves the cursor by 5px each 100 seconds
    npx simple-keep-pc-awake                                default behavior, moves the cursor by 1px every 30 seconds
```
