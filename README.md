<img src="docs/pedals.png" srcSet="docs/pedals@2x.png 2x">

# TestBox Browser SDK

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Installation

First, install the package in to your front-end.

`npm i @testboxlab/browser`

`yarn add @testboxlab/browser`

## Usage and Purpose

This package provides two sets of functionality:

* Communication to TestBox for user experience purposes
* [Client-side Auto-login][1]
### Base Usage

If you just need the basics of TestBox for your app, you'll use something like this:

```javascript
import { startTestBox } from "@testboxlab/browser";

startTestBox({
    allowFullStory: true,
    // Allowing FullStory allows us to give you insights into how users
    // are using your web application compared to others. However, it is
    // explicitly opt-in in case you do not wish for your environments
    // to be recorded.
});
```

This will allow TestBox to communicate with your web site. This communication is
important to remove loading states and generally provide a good user experience.

If you use React, your implementation might look like this:

```javascript
import { startTestBox } from "@testboxlab/browser";
import { useEffect } from "react";

export default function App() {
    useEffect(() => {
        startTestBox();
    }, []);
}
```

### Auto-login

If you have opted to use our client-side auto-login functionality, you have a bit
more work to do.

On your login page/component, you will want to add some code similar to the following:

```javascript
import { autoLoginCallback } from "@testboxlab/browser";

autoLoginCallback((email, password) => {
    // Use the email and password to log in, either by filling out
    // your "login" form and submitting, or some other mechanism.

    // After logging in, make sure to redirect the user.
    window.location = "/";
});
```

## Testing

[1]: https://partner-docs.testbox.com/docs/autologin/javascript/
